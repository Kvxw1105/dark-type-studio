#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const core = require("./studio-core.js");
const { exportProject } = require("./bin/dark-type.cjs");

function reply(id, result) { process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, result })}\n`); }
function failure(id, error) { process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32000, message: error.message, data: { code: error.code ?? "ERROR" } } })}\n`); }
function readProject(file) { return core.normalizeProject(JSON.parse(fs.readFileSync(path.resolve(file), "utf8"))); }
function writeProject(file, project) {
  const target = path.resolve(file);
  const temporary = `${target}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(project, null, 2)}\n`);
  fs.renameSync(temporary, target);
}
function content(value) { return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] }; }
const tools = [
  { name: "studio_capabilities", description: "List Dark Type Studio capabilities.", inputSchema: { type: "object", properties: {} } },
  { name: "studio_get_project", description: "Read and validate a Dark Type Studio project JSON.", inputSchema: { type: "object", required: ["projectPath"], properties: { projectPath: { type: "string" } } } },
  { name: "studio_apply_operations", description: "Atomically apply project operations. Supply baseRevision from studio_get_project to prevent overwrite.", inputSchema: { type: "object", required: ["projectPath", "operations"], properties: { projectPath: { type: "string" }, baseRevision: { type: "string" }, operations: { type: "array" }, outputPath: { type: "string" } } } },
  { name: "studio_validate_project", description: "Validate a Dark Type Studio project JSON.", inputSchema: { type: "object", required: ["projectPath"], properties: { projectPath: { type: "string" } } } },
  { name: "studio_export_image", description: "Render a project through Dark Type Studio's browser canvas and export PNG, JPG, or WebP.", inputSchema: { type: "object", required: ["projectPath", "outputPath"], properties: { projectPath: { type: "string" }, outputPath: { type: "string" }, format: { type: "string", enum: ["png", "jpg", "webp"] }, scale: { type: "number", enum: [1, 2, 4] } } } },
];

async function handle(request) {
  if (request.method === "initialize") return { protocolVersion: request.params?.protocolVersion ?? "2025-03-26", capabilities: { tools: {} }, serverInfo: { name: "dark-type-studio", version: "1.6.0" } };
  if (request.method === "tools/list") return { tools };
  if (request.method === "tools/call") {
    const { name, arguments: input = {} } = request.params ?? {};
    if (name === "studio_capabilities") return content({ capabilities: core.CAPABILITIES });
    const project = readProject(input.projectPath);
    if (name === "studio_get_project") return content({ project, revision: core.revisionOf(project) });
    if (name === "studio_validate_project") return content({ valid: true, revision: core.revisionOf(project), layers: project.layers.length });
    if (name === "studio_export_image") {
      const format = input.format || "png";
      await exportProject(project, input.outputPath, format, Number(input.scale || 1));
      return content({ outputPath: path.resolve(input.outputPath), format, scale: Number(input.scale || 1), revision: core.revisionOf(project) });
    }
    if (name === "studio_apply_operations") {
      const result = core.applyOperations(project, input.operations, { baseRevision: input.baseRevision });
      const outputPath = path.resolve(input.outputPath || input.projectPath);
      writeProject(outputPath, result.project);
      return content({ revision: result.revision, operations: result.operations, outputPath });
    }
    throw new Error(`Unknown tool ${name}.`);
  }
  return {};
}

let buffer = "";
async function processRequest(line) {
  let request;
  try {
    request = JSON.parse(line);
    const result = await handle(request);
    if (request.id !== undefined) reply(request.id, result);
  } catch (error) {
    if (request?.id !== undefined) failure(request.id, error);
  }
}
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let boundary;
  while ((boundary = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, boundary).trim();
    buffer = buffer.slice(boundary + 1);
    if (!line) continue;
    void processRequest(line);
  }
});
