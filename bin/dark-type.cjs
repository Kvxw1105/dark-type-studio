#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const http = require("node:http");
const childProcess = require("node:child_process");
const path = require("node:path");
const core = require("../studio-core.js");

function usage() {
  console.error("Usage: dark-type <inspect|validate|capabilities|apply|export> <project.json> [--operations ops.json] [--output file] [--base-revision revision] [--format png|jpg|webp] [--scale 1|2|4]");
  process.exitCode = 2;
}
function readJson(file) { return JSON.parse(fs.readFileSync(path.resolve(file), "utf8")); }
function writeJson(file, value) {
  const target = path.resolve(file);
  const temporary = `${target}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporary, target);
}
function print(value) { process.stdout.write(`${JSON.stringify(value, null, 2)}\n`); }

function projectUrl(project) {
  return Buffer.from(JSON.stringify(project)).toString("base64url");
}
function findChrome() {
  const candidates = [
    process.env.DARK_TYPE_CHROME,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
  ];
  return candidates.find((candidate) => {
    if (!candidate) return false;
    if (candidate.includes("/") || candidate.includes("\\")) return fs.existsSync(candidate);
    return !childProcess.spawnSync(candidate, ["--version"], { stdio: "ignore" }).error;
  });
}
async function waitForTarget(port) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await response.json();
      const target = targets.find((entry) => entry.type === "page" && entry.webSocketDebuggerUrl);
      if (target) return target.webSocketDebuggerUrl;
    } catch (_) { /* Chrome is still starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Chrome 调试端口启动超时。");
}
function connectCdp(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    const pending = new Map();
    let sequence = 0;
    socket.addEventListener("open", () => resolve({
      call(method, params = {}) {
        const id = ++sequence;
        socket.send(JSON.stringify({ id, method, params }));
        return new Promise((resolveCall, rejectCall) => pending.set(id, { resolve: resolveCall, reject: rejectCall }));
      },
      close() { socket.close(); },
    }));
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      const current = pending.get(message.id);
      if (!current) return;
      pending.delete(message.id);
      if (message.error) current.reject(new Error(message.error.message)); else current.resolve(message.result);
    });
    socket.addEventListener("error", () => reject(new Error("无法连接 Chrome 调试协议。")));
  });
}
async function exportProject(project, output, format, scale) {
  const chrome = findChrome();
  if (!chrome) throw new Error("未找到 Chrome；设置 DARK_TYPE_CHROME 后重试。");
  if (!Number.isFinite(scale) || ![1, 2, 4].includes(scale)) throw new Error("导出倍率必须为 1、2 或 4。");
  const mime = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" }[format];
  if (!mime) throw new Error("导出格式必须为 png、jpg 或 webp。");
  const port = 21000 + Math.floor(Math.random() * 1000);
  const profile = fs.mkdtempSync(path.join(require("node:os").tmpdir(), "dark-type-chrome-"));
  const pageUrl = `file:///${path.resolve(__dirname, "..", "index.html").replace(/\\/g, "/")}?project=${projectUrl(project)}`;
  const chromeArgs = ["--headless=new", "--disable-gpu", "--disable-dev-shm-usage", "--no-first-run", `--remote-debugging-address=127.0.0.1`, `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--allow-file-access-from-files", pageUrl];
  if (process.platform !== "win32") chromeArgs.push("--no-sandbox");
  const chromeProcess = childProcess.spawn(chrome, chromeArgs, { stdio: "ignore", windowsHide: true });
  let cdp;
  try {
    cdp = await connectCdp(await waitForTarget(port));
    let dataUrl = "";
    for (let attempt = 0; attempt < 30 && !dataUrl; attempt += 1) {
      const result = await cdp.call("Runtime.evaluate", { expression: `(() => { if (!window.DarkTypeStudio || !window.drawCanvas) return ''; const source = document.querySelector('#designCanvas'); const output = document.createElement('canvas'); output.width = source.width * ${scale}; output.height = source.height * ${scale}; drawCanvas(output.getContext('2d'), ${scale}, false); return output.toDataURL('${mime}', 0.92); })()`, returnByValue: true });
      dataUrl = result.result?.value || "";
      if (!dataUrl) await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!dataUrl) throw new Error("浏览器画布未就绪。");
    fs.writeFileSync(path.resolve(output), Buffer.from(dataUrl.split(",")[1], "base64"));
  } finally {
    cdp?.close();
    chromeProcess.kill();
    await new Promise((resolve) => chromeProcess.once("exit", resolve));
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 2, retryDelay: 100 }); break; }
      catch (_) { await new Promise((resolve) => setTimeout(resolve, 150)); }
    }
  }
}

const [command, projectFile, ...args] = process.argv.slice(2);
const option = (name) => { const index = args.indexOf(name); return index < 0 ? null : args[index + 1]; };
async function main() {
  try {
  if (command === "capabilities") print({ capabilities: core.CAPABILITIES });
  else if (!projectFile) usage();
  else {
    const project = core.normalizeProject(readJson(projectFile));
    if (command === "inspect") print({ project, revision: core.revisionOf(project) });
    else if (command === "validate") print({ valid: true, revision: core.revisionOf(project), layers: project.layers.length });
    else if (command === "apply") {
      const operationsFile = option("--operations");
      if (!operationsFile) throw new Error("apply 需要 --operations ops.json。");
      const result = core.applyOperations(project, readJson(operationsFile), { baseRevision: option("--base-revision") });
      writeJson(option("--output") || projectFile, result.project);
      print({ revision: result.revision, operations: result.operations, output: path.resolve(option("--output") || projectFile) });
    } else if (command === "export") {
      const format = (option("--format") || "png").toLowerCase();
      const output = option("--output") || `${path.basename(projectFile, path.extname(projectFile))}.${format}`;
      await exportProject(project, output, format, Number(option("--scale") || 1));
      print({ output: path.resolve(output), format, scale: Number(option("--scale") || 1) });
    } else usage();
  }
  } catch (error) {
  process.stderr.write(`${error.code ?? "ERROR"}: ${error.message}\n`);
  process.exitCode = 1;
}
}

if (require.main === module) main();

module.exports = { exportProject };
