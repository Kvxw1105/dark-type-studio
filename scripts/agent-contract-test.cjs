"use strict";

const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const core = require("../studio-core.js");

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "dark-type-agent-"));
const projectPath = path.join(temp, "project.json");
const operationsPath = path.join(temp, "ops.json");
const project = { format: core.PROJECT_FORMAT, version: "1.6.0", revision: 0, name: "测试", width: 1080, height: 1080, background: "#000000", layers: [{ id: "title", type: "text", name: "标题", text: "暗幕标题", x: 540, y: 200, fontSize: 100 }] };
fs.writeFileSync(projectPath, JSON.stringify(project));
fs.writeFileSync(operationsPath, JSON.stringify([
  { type: "move-layer", layerId: "title", x: 500, y: 220 },
  { type: "set-text-range-style", layerId: "title", start: 0, end: 2, style: { color: "#e60012" } },
]));

const applied = spawnSync(process.execPath, ["bin/dark-type.cjs", "apply", projectPath, "--operations", operationsPath], { cwd: path.resolve(__dirname, ".."), encoding: "utf8" });
assert.equal(applied.status, 0, applied.stderr);
const next = JSON.parse(fs.readFileSync(projectPath, "utf8"));
assert.equal(next.layers[0].x, 500);
assert.deepEqual(next.layers[0].textRuns, [{ start: 0, end: 2, style: { color: "#e60012" } }]);
assert.equal(next.revision, 1);

const capabilities = spawnSync(process.execPath, ["bin/dark-type.cjs", "capabilities"], { cwd: path.resolve(__dirname, ".."), encoding: "utf8" });
assert.equal(capabilities.status, 0, capabilities.stderr);
assert.equal(JSON.parse(capabilities.stdout).capabilities.length, core.CAPABILITIES.length);
for (const [format, signature] of [["png", "89504e47"], ["jpg", "ffd8ff"], ["webp", "52494646"]]) {
  const output = path.join(temp, `export.${format}`);
  const exported = spawnSync(process.execPath, ["bin/dark-type.cjs", "export", projectPath, "--format", format, "--output", output], { cwd: path.resolve(__dirname, ".."), encoding: "utf8", timeout: 30000 });
  assert.equal(exported.status, 0, exported.stderr);
  assert.ok(fs.readFileSync(output).subarray(0, 4).toString("hex").startsWith(signature), `${format} signature`);
}
const mcpOutput = path.join(temp, "mcp-export.png");
const mcpInput = [
  { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26" } },
  { jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "studio_export_image", arguments: { projectPath, outputPath: mcpOutput, format: "png", scale: 1 } } },
].map((message) => JSON.stringify(message)).join("\n") + "\n";
const mcp = spawnSync(process.execPath, ["mcp-server.cjs"], { cwd: path.resolve(__dirname, ".."), input: mcpInput, encoding: "utf8", timeout: 30000 });
assert.equal(mcp.status, 0, mcp.stderr);
assert.ok(fs.existsSync(mcpOutput), `MCP export output: ${mcp.stdout} ${mcp.stderr}`);
assert.equal(fs.readFileSync(mcpOutput).subarray(0, 4).toString("hex"), "89504e47", "MCP PNG signature");
fs.rmSync(temp, { recursive: true, force: true });
console.log("Agent contract test passed: CLI and MCP apply shared operations and export images.");
