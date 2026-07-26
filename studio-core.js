/* Dark Type Studio project contract shared by the browser, CLI, and MCP server. */
(function attachStudioCore(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DarkTypeStudioCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createStudioCore() {
  "use strict";

  const PROJECT_FORMAT = "studio-project/v1";
  const CAPABILITIES = [
    { id: "project.set", operation: "set-project", writes: true },
    { id: "layer.set", operation: "set-layer", writes: true },
    { id: "layer.move", operation: "move-layer", writes: true },
    { id: "layer.create", operation: "add-layer", writes: true },
    { id: "layer.delete", operation: "delete-layer", writes: true },
    { id: "layer.duplicate", operation: "duplicate-layer", writes: true },
    { id: "layer.reorder", operation: "reorder-layer", writes: true },
    { id: "text.range-style.set", operation: "set-text-range-style", writes: true },
    { id: "project.validate", operation: null, writes: false },
  ];
  const LAYER_TYPES = new Set(["text", "seal", "line"]);
  const PROJECT_FIELDS = new Set(["name", "templateId", "width", "height", "background"]);

  function clone(value) { return structuredClone(value); }
  function error(message, code = "INVALID_OPERATION") {
    const result = new Error(message);
    result.code = code;
    return result;
  }

  function revisionOf(project) {
    const { revision = 0, updatedAt, ...content } = project;
    const text = JSON.stringify(content);
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `r${revision}-${(hash >>> 0).toString(16)}`;
  }

  function validateProject(project) {
    if (!project || typeof project !== "object" || Array.isArray(project)) throw error("项目必须是对象。", "INVALID_PROJECT");
    if (!Number.isFinite(project.width) || project.width < 1 || !Number.isFinite(project.height) || project.height < 1) {
      throw error("画布尺寸无效。", "INVALID_PROJECT");
    }
    if (typeof project.background !== "string") throw error("画布背景无效。", "INVALID_PROJECT");
    if (!Array.isArray(project.layers)) throw error("图层必须是数组。", "INVALID_PROJECT");
    const ids = new Set();
    for (const layer of project.layers) {
      if (!layer || typeof layer !== "object" || !LAYER_TYPES.has(layer.type)) throw error("图层类型无效。", "INVALID_PROJECT");
      if (!layer.id || typeof layer.id !== "string" || ids.has(layer.id)) throw error("图层 ID 必须唯一。", "INVALID_PROJECT");
      if (!Number.isFinite(layer.x) || !Number.isFinite(layer.y)) throw error(`图层 ${layer.id} 坐标无效。`, "INVALID_PROJECT");
      ids.add(layer.id);
    }
    return true;
  }

  function normalizeProject(project) {
    const normalized = clone(project);
    normalized.format ??= PROJECT_FORMAT;
    normalized.version ??= "1.5.1";
    normalized.revision = Number.isInteger(normalized.revision) && normalized.revision >= 0 ? normalized.revision : 0;
    normalized.updatedAt ??= new Date().toISOString();
    validateProject(normalized);
    return normalized;
  }

  function getLayer(project, id) {
    const layer = project.layers.find((entry) => entry.id === id);
    if (!layer) throw error(`找不到图层 ${id}。`, "LAYER_NOT_FOUND");
    return layer;
  }

  function applyOperation(project, operation) {
    if (!operation || typeof operation !== "object" || typeof operation.type !== "string") throw error("操作格式无效。");
    const { type } = operation;
    if (type === "set-project") {
      for (const [key, value] of Object.entries(operation.patch ?? {})) {
        if (!PROJECT_FIELDS.has(key)) throw error(`项目字段 ${key} 不可写。`);
        project[key] = value;
      }
      return;
    }
    if (type === "set-layer") {
      const layer = getLayer(project, operation.layerId);
      for (const [key, value] of Object.entries(operation.patch ?? {})) {
        if (["id", "type"].includes(key)) throw error(`图层字段 ${key} 不可修改。`);
        layer[key] = clone(value);
      }
      return;
    }
    if (type === "move-layer") {
      const layer = getLayer(project, operation.layerId);
      if (!Number.isFinite(operation.x) || !Number.isFinite(operation.y)) throw error("图层坐标无效。");
      layer.x = operation.x;
      layer.y = operation.y;
      return;
    }
    if (type === "add-layer") {
      if (!operation.layer || project.layers.some((layer) => layer.id === operation.layer.id)) throw error("新增图层 ID 无效或已存在。");
      project.layers.push(clone(operation.layer));
      return;
    }
    if (type === "delete-layer") {
      const index = project.layers.findIndex((layer) => layer.id === operation.layerId);
      if (index < 0) throw error(`找不到图层 ${operation.layerId}。`, "LAYER_NOT_FOUND");
      project.layers.splice(index, 1);
      return;
    }
    if (type === "duplicate-layer") {
      const source = getLayer(project, operation.layerId);
      const copy = clone(source);
      copy.id = operation.newLayerId;
      copy.name = operation.name ?? `${source.name} 副本`;
      copy.x += operation.offsetX ?? 24;
      copy.y += operation.offsetY ?? 24;
      if (!copy.id || project.layers.some((layer) => layer.id === copy.id)) throw error("副本图层 ID 无效或已存在。");
      project.layers.push(copy);
      return;
    }
    if (type === "reorder-layer") {
      const index = project.layers.findIndex((layer) => layer.id === operation.layerId);
      if (index < 0) throw error(`找不到图层 ${operation.layerId}。`, "LAYER_NOT_FOUND");
      if (!Number.isInteger(operation.toIndex) || operation.toIndex < 0 || operation.toIndex >= project.layers.length) throw error("目标层级无效。");
      project.layers.splice(operation.toIndex, 0, project.layers.splice(index, 1)[0]);
      return;
    }
    if (type === "set-text-range-style") {
      const layer = getLayer(project, operation.layerId);
      if (layer.type !== "text" || typeof layer.text !== "string") throw error("局部样式仅适用于文本图层。");
      if (!Number.isInteger(operation.start) || !Number.isInteger(operation.end) || operation.start < 0 || operation.end <= operation.start || operation.end > layer.text.length) {
        throw error("文字范围无效。");
      }
      if (!operation.style || typeof operation.style !== "object") throw error("文字样式无效。");
      layer.textRuns ??= [];
      const existing = layer.textRuns.find((run) => run.start === operation.start && run.end === operation.end);
      if (existing) Object.assign(existing.style, clone(operation.style));
      else layer.textRuns.push({ start: operation.start, end: operation.end, style: clone(operation.style) });
      return;
    }
    throw error(`未知操作 ${type}。`, "UNKNOWN_OPERATION");
  }

  function applyOperations(project, operations, options = {}) {
    const next = normalizeProject(project);
    if (options.baseRevision && options.baseRevision !== revisionOf(next)) throw error("项目版本已变化，请重新读取后再提交。", "REVISION_CONFLICT");
    if (!Array.isArray(operations) || operations.length === 0) throw error("至少需要一个操作。", "INVALID_OPERATION");
    for (const operation of operations) applyOperation(next, operation);
    validateProject(next);
    next.revision += 1;
    next.updatedAt = new Date().toISOString();
    return { project: next, revision: revisionOf(next), operations: clone(operations) };
  }

  return { PROJECT_FORMAT, CAPABILITIES, normalizeProject, validateProject, applyOperations, revisionOf };
});
