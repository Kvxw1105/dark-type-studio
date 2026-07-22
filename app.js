"use strict";

const APP_VERSION = "1.1.0";
const STORAGE_KEY = "dark-type-studio:last-project";
const MAX_HISTORY = 60;
const SNAP_DISTANCE_PX = 10;

const FONT_OPTIONS = [
  { name: "宋体标题", value: '"STSong", "Songti SC", "SimSun", serif' },
  { name: "黑体标题", value: '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif' },
  { name: "楷体手写", value: '"STKaiti", "KaiTi", "Kaiti SC", serif' },
  { name: "仿宋", value: '"STFangsong", "FangSong", serif' },
  { name: "衬线西文", value: 'Georgia, "Times New Roman", serif' },
  { name: "无衬线西文", value: 'Inter, Arial, sans-serif' },
];

const COLORS = {
  red: "#e60012",
  white: "#ffffff",
  black: "#000000",
};

const TEMPLATE_DEFINITIONS = {
  "square-cover": {
    id: "square-cover",
    name: "主页方形封面",
    width: 1080,
    height: 1080,
    background: COLORS.black,
    layers: [
      textLayer({
        id: "square-topline",
        name: "顶部红字",
        text: "2026算法改版后",
        x: 540,
        y: 90,
        maxWidth: 920,
        fontSize: 78,
        fontFamily: FONT_OPTIONS[1].value,
        fontWeight: 900,
        color: COLORS.red,
        align: "center",
        letterSpacing: 1,
        lineHeight: 1.05,
      }),
      textLayer({
        id: "square-title",
        name: "主标题",
        text: "推流\n机制",
        x: 540,
        y: 176,
        maxWidth: 950,
        fontSize: 330,
        fontFamily: FONT_OPTIONS[0].value,
        fontWeight: 900,
        color: COLORS.white,
        align: "center",
        letterSpacing: -18,
        lineHeight: 0.92,
        shadowColor: "#111111",
        shadowBlur: 2,
      }),
      textLayer({
        id: "square-caption",
        name: "底部说明",
        text: "看懂平台如何分配流量",
        x: 540,
        y: 934,
        maxWidth: 900,
        fontSize: 48,
        fontFamily: FONT_OPTIONS[1].value,
        fontWeight: 800,
        color: COLORS.white,
        align: "center",
        letterSpacing: 1,
        lineHeight: 1,
      }),
      sealLayer({
        id: "square-seal",
        name: "印章",
        text: "密",
        x: 540,
        y: 1017,
        size: 68,
        fontSize: 42,
      }),
    ],
  },
  "video-title": {
    id: "video-title",
    name: "视频开头标题页",
    width: 1920,
    height: 1080,
    background: COLORS.black,
    layers: [
      textLayer({
        id: "video-topline",
        name: "顶部红字",
        text: "2026算法改版后",
        x: 960,
        y: 138,
        maxWidth: 1540,
        fontSize: 126,
        fontFamily: FONT_OPTIONS[1].value,
        fontWeight: 900,
        color: COLORS.red,
        align: "center",
        letterSpacing: 3,
        lineHeight: 1,
      }),
      textLayer({
        id: "video-title",
        name: "主标题",
        text: "详解推流机制",
        x: 960,
        y: 286,
        maxWidth: 1760,
        fontSize: 252,
        fontFamily: FONT_OPTIONS[0].value,
        fontWeight: 900,
        color: COLORS.white,
        align: "center",
        letterSpacing: -12,
        lineHeight: 1,
      }),
      textLayer({
        id: "video-caption",
        name: "逻辑说明",
        text: "完整逻辑拆解",
        x: 900,
        y: 650,
        maxWidth: 720,
        fontSize: 76,
        fontFamily: FONT_OPTIONS[1].value,
        fontWeight: 800,
        color: COLORS.white,
        align: "center",
        letterSpacing: 1,
        lineHeight: 1,
      }),
      sealLayer({
        id: "video-seal",
        name: "印章",
        text: "密",
        x: 1196,
        y: 691,
        size: 82,
        fontSize: 50,
      }),
      lineLayer({
        id: "video-left-line",
        name: "左装饰线",
        x: 64,
        y: 848,
        width: 420,
        thickness: 3,
        color: "#d8d8d8",
        opacity: 0.65,
      }),
      lineLayer({
        id: "video-right-line",
        name: "右装饰线",
        x: 1436,
        y: 848,
        width: 420,
        thickness: 3,
        color: "#d8d8d8",
        opacity: 0.65,
      }),
      textLayer({
        id: "video-hook",
        name: "底部钩子",
        text: "为什么你的内容刚发就输",
        x: 960,
        y: 796,
        maxWidth: 1120,
        fontSize: 82,
        fontFamily: FONT_OPTIONS[2].value,
        fontWeight: 700,
        color: COLORS.white,
        align: "center",
        letterSpacing: 4,
        lineHeight: 1,
      }),
      lineLayer({
        id: "video-underline",
        name: "红色下划线",
        x: 620,
        y: 944,
        width: 680,
        thickness: 5,
        color: COLORS.red,
        opacity: 0.9,
      }),
    ],
  },
};

function baseLayer(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    name: "图层",
    type: "text",
    x: 100,
    y: 100,
    opacity: 1,
    visible: true,
    locked: false,
    rotation: 0,
    ...overrides,
  };
}

function textLayer(overrides = {}) {
  return baseLayer({
    type: "text",
    text: "新文字",
    maxWidth: 800,
    fontSize: 72,
    fontFamily: FONT_OPTIONS[1].value,
    fontWeight: 700,
    color: COLORS.white,
    align: "center",
    letterSpacing: 0,
    lineHeight: 1.1,
    strokeColor: COLORS.black,
    strokeWidth: 0,
    shadowColor: COLORS.black,
    shadowBlur: 0,
    ...overrides,
  });
}

function sealLayer(overrides = {}) {
  return baseLayer({
    type: "seal",
    text: "密",
    size: 72,
    fontSize: 44,
    fontFamily: FONT_OPTIONS[1].value,
    fontWeight: 900,
    color: COLORS.white,
    background: COLORS.red,
    align: "center",
    ...overrides,
  });
}

function lineLayer(overrides = {}) {
  return baseLayer({
    type: "line",
    width: 500,
    thickness: 3,
    color: COLORS.white,
    ...overrides,
  });
}

const elements = {
  canvas: document.querySelector("#designCanvas"),
  canvasShell: document.querySelector("#canvasShell"),
  stage: document.querySelector("#stage"),
  templateGrid: document.querySelector("#templateGrid"),
  currentTemplateName: document.querySelector("#currentTemplateName"),
  canvasSizeLabel: document.querySelector("#canvasSizeLabel"),
  backgroundColor: document.querySelector("#backgroundColor"),
  backgroundHex: document.querySelector("#backgroundHex"),
  exportScale: document.querySelector("#exportScale"),
  canvasPreset: document.querySelector("#canvasPreset"),
  layerList: document.querySelector("#layerList"),
  emptyEditor: document.querySelector("#emptyEditor"),
  layerEditor: document.querySelector("#layerEditor"),
  layerText: document.querySelector("#layerText"),
  fontFamily: document.querySelector("#fontFamily"),
  fontWeight: document.querySelector("#fontWeight"),
  fontUploadInput: document.querySelector("#fontUploadInput"),
  layerX: document.querySelector("#layerX"),
  layerY: document.querySelector("#layerY"),
  layerRotation: document.querySelector("#layerRotation"),
  fontSize: document.querySelector("#fontSize"),
  maxWidth: document.querySelector("#maxWidth"),
  letterSpacing: document.querySelector("#letterSpacing"),
  lineHeight: document.querySelector("#lineHeight"),
  textAlign: document.querySelector("#textAlign"),
  layerColor: document.querySelector("#layerColor"),
  lineWidth: document.querySelector("#lineWidth"),
  lineThickness: document.querySelector("#lineThickness"),
  sealSize: document.querySelector("#sealSize"),
  sealFontSize: document.querySelector("#sealFontSize"),
  sealBackground: document.querySelector("#sealBackground"),
  strokeColor: document.querySelector("#strokeColor"),
  strokeWidth: document.querySelector("#strokeWidth"),
  shadowColor: document.querySelector("#shadowColor"),
  shadowBlur: document.querySelector("#shadowBlur"),
  layerOpacity: document.querySelector("#layerOpacity"),
  opacityLabel: document.querySelector("#opacityLabel"),
  statusMessage: document.querySelector("#statusMessage"),
  toast: document.querySelector("#toast"),
  undoButton: document.querySelector("#undoButton"),
  redoButton: document.querySelector("#redoButton"),
  zoomLabel: document.querySelector("#zoomLabel"),
};

const context = elements.canvas.getContext("2d", { alpha: false });

let state = cloneTemplate("square-cover");
let selectedLayerId = state.layers[1].id;
let zoomMode = "fit";
let customZoom = 1;
let hitBoxes = [];
let dragState = null;
let toastTimer = null;
let history = [];
let historyIndex = -1;
let suppressHistory = false;
let customFonts = [...FONT_OPTIONS];
let alignmentGuides = { vertical: false, horizontal: false };

init();

function init() {
  populateFontOptions();
  bindEvents();
  restoreSavedProject();
  commitHistory();
  resizeCanvas();
  renderAll();
  requestAnimationFrame(fitCanvasToStage);
}

function cloneTemplate(templateId) {
  const template = TEMPLATE_DEFINITIONS[templateId];
  return structuredClone({
    version: APP_VERSION,
    templateId: template.id,
    name: template.name,
    width: template.width,
    height: template.height,
    background: template.background,
    layers: template.layers,
    updatedAt: new Date().toISOString(),
  });
}

function bindEvents() {
  elements.templateGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-template-id]");
    if (!card) return;
    switchTemplate(card.dataset.templateId);
  });

  elements.backgroundColor.addEventListener("input", () => {
    updateBackground(elements.backgroundColor.value);
  });

  elements.backgroundHex.addEventListener("change", () => {
    const color = normalizeHex(elements.backgroundHex.value);
    if (!color) {
      elements.backgroundHex.value = state.background;
      showToast("请输入有效的十六进制颜色，例如 #000000。", true);
      return;
    }
    updateBackground(color);
  });

  document.querySelector("#addTextButton").addEventListener("click", addTextLayer);
  document.querySelector("#duplicateLayerButton").addEventListener("click", duplicateSelectedLayer);
  document.querySelector("#deleteLayerButton").addEventListener("click", deleteSelectedLayer);
  document.querySelector("#moveUpButton").addEventListener("click", moveSelectedLayerUp);
  document.querySelector("#centerHorizontalButton").addEventListener("click", centerSelectedHorizontally);
  document.querySelector("#centerVerticalButton").addEventListener("click", centerSelectedVertically);

  document.querySelector("#saveButton").addEventListener("click", saveToLocalStorage);
  document.querySelector("#loadButton").addEventListener("click", loadFromLocalStorage);
  document.querySelector("#downloadProjectButton").addEventListener("click", downloadProject);
  document.querySelector("#importProjectInput").addEventListener("change", importProject);
  document.querySelector("#resetTemplateButton").addEventListener("click", resetCurrentTemplate);

  document.querySelector("#exportPngButton").addEventListener("click", () => exportImage("image/png", "png"));
  document.querySelector("#exportJpgButton").addEventListener("click", () => exportImage("image/jpeg", "jpg"));
  document.querySelector("#exportWebpButton").addEventListener("click", () => exportImage("image/webp", "webp"));

  document.querySelector("#fitButton").addEventListener("click", () => {
    zoomMode = "fit";
    fitCanvasToStage();
  });
  document.querySelector("#zoomInButton").addEventListener("click", () => changeZoom(0.1));
  document.querySelector("#zoomOutButton").addEventListener("click", () => changeZoom(-0.1));

  elements.undoButton.addEventListener("click", undo);
  elements.redoButton.addEventListener("click", redo);

  elements.layerList.addEventListener("click", handleLayerListClick);
  elements.layerEditor.addEventListener("input", handleEditorInput);
  elements.layerEditor.addEventListener("change", handleEditorInput);
  elements.fontUploadInput.addEventListener("change", loadCustomFont);

  elements.canvas.addEventListener("pointerdown", handlePointerDown);
  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);
  window.addEventListener("resize", () => {
    if (zoomMode === "fit") fitCanvasToStage();
  });
  window.addEventListener("keydown", handleKeyboard);
  document.querySelectorAll("[data-mobile-view]").forEach((button) => {
    button.addEventListener("click", () => setMobileView(button.dataset.mobileView));
  });

  elements.canvasPreset.addEventListener("change", () => {
    const [width, height] = elements.canvasPreset.value.split("x").map(Number);
    applyCanvasSize(width, height);
  });
}

function restoreSavedProject() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const project = JSON.parse(raw);
    validateProject(project);
    state = structuredClone(project);
    selectedLayerId = state.layers[0]?.id ?? null;
  } catch (error) {
    console.warn("Unable to restore saved project", error);
    showToast("本机项目无法自动恢复，已使用默认模板。", true);
  }
}

function setMobileView(view) {
  document.body.dataset.mobileView = view;
  document.querySelectorAll("[data-mobile-view]").forEach((button) => {
    const active = button.dataset.mobileView === view;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });
  if (view === "canvas") requestAnimationFrame(fitCanvasToStage);
}

function switchTemplate(templateId) {
  if (!TEMPLATE_DEFINITIONS[templateId] || templateId === state.templateId) return;
  state = cloneTemplate(templateId);
  selectedLayerId = state.layers.find((layer) => layer.type === "text")?.id ?? state.layers[0]?.id ?? null;
  resizeCanvas();
  commitHistory(true);
  renderAll();
  zoomMode = "fit";
  requestAnimationFrame(fitCanvasToStage);
  showToast(`已切换到「${state.name}」。`);
}

function resetCurrentTemplate() {
  const accepted = window.confirm("确定恢复当前模板吗？现有修改会被覆盖。");
  if (!accepted) return;
  state = cloneTemplate(state.templateId);
  selectedLayerId = state.layers.find((layer) => layer.type === "text")?.id ?? state.layers[0]?.id ?? null;
  resizeCanvas();
  commitHistory(true);
  renderAll();
  showToast("当前模板已恢复。", false);
}

function resizeCanvas() {
  elements.canvas.width = state.width;
  elements.canvas.height = state.height;
  elements.canvas.style.width = `${state.width}px`;
  elements.canvas.style.height = `${state.height}px`;
  elements.currentTemplateName.textContent = state.name;
  elements.canvasSizeLabel.textContent = `${state.width} × ${state.height}`;
  elements.backgroundColor.value = state.background;
  elements.backgroundHex.value = state.background;
  const presetValue = `${state.width}x${state.height}`;
  if ([...elements.canvasPreset.options].some((option) => option.value === presetValue)) {
    elements.canvasPreset.value = presetValue;
  }
}

function applyCanvasSize(width, height) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return;
  if (width === state.width && height === state.height) return;
  const scaleX = width / state.width;
  const scaleY = height / state.height;
  const sizeScale = scaleX;
  for (const layer of state.layers) {
    layer.x *= scaleX;
    layer.y *= scaleY;
    if (layer.fontSize) layer.fontSize *= sizeScale;
    if (layer.maxWidth) layer.maxWidth *= scaleX;
    if (layer.size) layer.size *= sizeScale;
    if (layer.width) layer.width *= scaleX;
    if (layer.thickness) layer.thickness *= sizeScale;
    if (layer.strokeWidth) layer.strokeWidth *= sizeScale;
    if (layer.shadowBlur) layer.shadowBlur *= sizeScale;
  }
  state.width = width;
  state.height = height;
  touchState();
  resizeCanvas();
  commitHistory();
  renderAll();
  zoomMode = "fit";
  requestAnimationFrame(fitCanvasToStage);
  showToast(`画布已调整为 ${width} × ${height}`);
}

function renderAll() {
  drawCanvas();
  renderLayerList();
  renderEditor();
  updateTemplateCards();
  updateHistoryButtons();
}

function drawCanvas(targetContext = context, scale = 1, showSelection = true) {
  const ctx = targetContext;
  const width = state.width;
  const height = state.height;

  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = state.background;
  ctx.fillRect(0, 0, width, height);

  hitBoxes = [];
  for (const layer of state.layers) {
    if (!layer.visible) continue;
    const box = drawLayer(ctx, layer);
    if (box) hitBoxes.push({ layerId: layer.id, ...box });
  }

  if (showSelection && selectedLayerId) {
    const selectedBox = hitBoxes.find((box) => box.layerId === selectedLayerId);
    if (selectedBox) drawSelection(ctx, selectedBox);
  }

  if (showSelection) drawAlignmentGuides(ctx);

  ctx.restore();
}

function drawLayer(ctx, layer) {
  ctx.save();
  ctx.globalAlpha = clamp(layer.opacity ?? 1, 0, 1);
  const radians = ((layer.rotation ?? 0) * Math.PI) / 180;
  if (radians) {
    ctx.translate(layer.x, layer.y);
    ctx.rotate(radians);
    ctx.translate(-layer.x, -layer.y);
  }

  let box = null;
  if (layer.type === "text") box = drawTextLayer(ctx, layer);
  if (layer.type === "seal") box = drawSealLayer(ctx, layer);
  if (layer.type === "line") box = drawLineLayer(ctx, layer);

  ctx.restore();
  return radians && box ? rotatedBounds(box, layer.x, layer.y, radians) : box;
}

function drawAlignmentGuides(ctx) {
  if (!alignmentGuides.vertical && !alignmentGuides.horizontal) return;
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#ff3344";
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 8]);
  if (alignmentGuides.vertical) {
    ctx.beginPath();
    ctx.moveTo(state.width / 2, 0);
    ctx.lineTo(state.width / 2, state.height);
    ctx.stroke();
  }
  if (alignmentGuides.horizontal) {
    ctx.beginPath();
    ctx.moveTo(0, state.height / 2);
    ctx.lineTo(state.width, state.height / 2);
    ctx.stroke();
  }
  ctx.restore();
}

function rotatedBounds(box, originX, originY, radians) {
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const points = [
    [box.x, box.y], [box.x + box.width, box.y],
    [box.x, box.y + box.height], [box.x + box.width, box.y + box.height],
  ].map(([x, y]) => ({
    x: originX + (x - originX) * cosine - (y - originY) * sine,
    y: originY + (x - originX) * sine + (y - originY) * cosine,
  }));
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return {
    x: Math.min(...xs), y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

function drawTextLayer(ctx, layer) {
  applyTextStyle(ctx, layer);
  const lines = wrapText(ctx, layer.text ?? "", layer.maxWidth, layer.letterSpacing);
  const lineHeightPx = layer.fontSize * layer.lineHeight;
  let maxRenderedWidth = 0;

  lines.forEach((line, index) => {
    const lineY = layer.y + index * lineHeightPx;
    const width = measureSpacedText(ctx, line, layer.letterSpacing);
    maxRenderedWidth = Math.max(maxRenderedWidth, width);

    if (layer.strokeWidth > 0) {
      drawSpacedText(ctx, line, layer.x, lineY, layer.letterSpacing, layer.align, true);
    }
    drawSpacedText(ctx, line, layer.x, lineY, layer.letterSpacing, layer.align, false);
  });

  const ascent = layer.fontSize * 0.82;
  const totalHeight = Math.max(lineHeightPx, lines.length * lineHeightPx);
  let left = layer.x;
  if (layer.align === "center") left -= maxRenderedWidth / 2;
  if (layer.align === "right") left -= maxRenderedWidth;

  return {
    x: left - 12,
    y: layer.y - ascent - 12,
    width: maxRenderedWidth + 24,
    height: totalHeight + 24,
  };
}

function drawSealLayer(ctx, layer) {
  const radius = layer.size / 2;
  ctx.fillStyle = layer.background;
  ctx.beginPath();
  ctx.arc(layer.x, layer.y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = `${layer.fontWeight} ${layer.fontSize}px ${layer.fontFamily}`;
  ctx.fillStyle = layer.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(layer.text, layer.x, layer.y + layer.fontSize * 0.03);

  return {
    x: layer.x - radius - 8,
    y: layer.y - radius - 8,
    width: layer.size + 16,
    height: layer.size + 16,
  };
}

function drawLineLayer(ctx, layer) {
  ctx.fillStyle = layer.color;
  ctx.fillRect(layer.x, layer.y, layer.width, layer.thickness);
  return {
    x: layer.x - 10,
    y: layer.y - 12,
    width: layer.width + 20,
    height: Math.max(layer.thickness, 4) + 24,
  };
}

function applyTextStyle(ctx, layer) {
  ctx.font = `${layer.fontWeight} ${layer.fontSize}px ${layer.fontFamily}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = layer.color;
  ctx.strokeStyle = layer.strokeColor;
  ctx.lineWidth = layer.strokeWidth * 2;
  ctx.lineJoin = "round";
  ctx.shadowColor = layer.shadowColor;
  ctx.shadowBlur = layer.shadowBlur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = Math.max(0, layer.shadowBlur * 0.12);
}

function wrapText(ctx, rawText, maxWidth, letterSpacing) {
  const paragraphs = String(rawText).split("\n");
  const lines = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.length) {
      lines.push("");
      continue;
    }

    let current = "";
    for (const char of [...paragraph]) {
      const candidate = current + char;
      if (current && measureSpacedText(ctx, candidate, letterSpacing) > maxWidth) {
        lines.push(current);
        current = char;
      } else {
        current = candidate;
      }
    }
    lines.push(current);
  }

  return lines.length ? lines : [""];
}

function measureSpacedText(ctx, text, letterSpacing = 0) {
  const chars = [...text];
  if (!chars.length) return 0;
  const glyphWidth = chars.reduce((sum, char) => sum + ctx.measureText(char).width, 0);
  return glyphWidth + Math.max(0, chars.length - 1) * letterSpacing;
}

function drawSpacedText(ctx, text, x, y, letterSpacing, align, stroke) {
  const chars = [...text];
  const totalWidth = measureSpacedText(ctx, text, letterSpacing);
  let cursorX = x;
  if (align === "center") cursorX -= totalWidth / 2;
  if (align === "right") cursorX -= totalWidth;

  for (const char of chars) {
    if (stroke) ctx.strokeText(char, cursorX, y);
    else ctx.fillText(char, cursorX, y);
    cursorX += ctx.measureText(char).width + letterSpacing;
  }
}

function drawSelection(ctx, box) {
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.setLineDash([10, 8]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#28a9ff";
  ctx.fillStyle = "rgba(40, 169, 255, 0.08)";
  ctx.fillRect(box.x, box.y, box.width, box.height);
  ctx.strokeRect(box.x, box.y, box.width, box.height);
  ctx.setLineDash([]);

  const size = 9;
  const corners = [
    [box.x, box.y],
    [box.x + box.width, box.y],
    [box.x, box.y + box.height],
    [box.x + box.width, box.y + box.height],
  ];
  for (const [x, y] of corners) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
    ctx.strokeStyle = "#28a9ff";
    ctx.strokeRect(x - size / 2, y - size / 2, size, size);
  }
  ctx.restore();
}

function renderLayerList() {
  elements.layerList.innerHTML = "";
  [...state.layers].reverse().forEach((layer) => {
    const item = document.createElement("div");
    item.className = `layer-item${layer.id === selectedLayerId ? " active" : ""}`;
    item.dataset.layerId = layer.id;
    item.innerHTML = `
      <span class="layer-icon">${layer.type === "text" ? "T" : layer.type === "seal" ? "印" : "—"}</span>
      <span class="layer-info">
        <div class="layer-name">${escapeHtml(layer.name)}</div>
        <div class="layer-subtitle">${escapeHtml(layerPreview(layer))}</div>
      </span>
      <span class="layer-actions">
        <button class="layer-action-button${layer.locked ? " active" : ""}" data-action="lock" type="button" aria-label="${layer.locked ? "解锁图层" : "锁定图层"}" title="${layer.locked ? "解锁" : "锁定"}">${layer.locked ? "锁" : "开"}</button>
        <button class="layer-action-button${layer.visible ? "" : " hidden-layer"}" data-action="visibility" type="button" aria-label="切换可见性" title="显示/隐藏">${layer.visible ? "●" : "○"}</button>
      </span>
    `;
    elements.layerList.appendChild(item);
  });
}

function layerPreview(layer) {
  if (layer.type === "text" || layer.type === "seal") return String(layer.text || "空文字").replace(/\n/g, " / ");
  return `${Math.round(layer.width)} × ${Math.round(layer.thickness)}`;
}

function renderEditor() {
  const layer = getSelectedLayer();
  if (!layer) {
    elements.emptyEditor.classList.remove("hidden");
    elements.layerEditor.classList.add("hidden");
    return;
  }

  elements.emptyEditor.classList.add("hidden");
  elements.layerEditor.classList.remove("hidden");

  toggleFieldsForLayerType(layer.type);

  elements.layerX.value = Math.round(layer.x);
  elements.layerY.value = Math.round(layer.y);
  elements.layerRotation.value = layer.rotation ?? 0;
  elements.layerOpacity.value = layer.opacity ?? 1;
  elements.opacityLabel.textContent = `${Math.round((layer.opacity ?? 1) * 100)}%`;

  if (layer.type === "text" || layer.type === "seal") {
    ensureFontOption(layer.fontFamily);
    elements.layerText.value = layer.text ?? "";
    elements.fontFamily.value = layer.fontFamily;
    elements.fontWeight.value = String(layer.fontWeight);
    elements.fontSize.value = layer.fontSize;
    elements.layerColor.value = layer.color;
  }

  if (layer.type === "text") {
    elements.maxWidth.value = layer.maxWidth;
    elements.letterSpacing.value = layer.letterSpacing;
    elements.lineHeight.value = layer.lineHeight;
    elements.textAlign.value = layer.align;
    elements.strokeColor.value = layer.strokeColor;
    elements.strokeWidth.value = layer.strokeWidth;
    elements.shadowColor.value = layer.shadowColor;
    elements.shadowBlur.value = layer.shadowBlur;
  }

  if (layer.type === "seal") {
    elements.sealSize.value = layer.size;
    elements.sealFontSize.value = layer.fontSize;
    elements.sealBackground.value = layer.background;
  }

  if (layer.type === "line") {
    elements.lineWidth.value = layer.width;
    elements.lineThickness.value = layer.thickness;
    elements.layerColor.value = layer.color;
  }
}

function toggleFieldsForLayerType(type) {
  document.querySelectorAll(".text-only").forEach((node) => node.classList.toggle("hidden", type !== "text"));
  document.querySelectorAll(".textual-only").forEach((node) => node.classList.toggle("hidden", type !== "text" && type !== "seal"));
  document.querySelectorAll(".seal-only").forEach((node) => node.classList.toggle("hidden", type !== "seal"));
  document.querySelectorAll(".line-only").forEach((node) => node.classList.toggle("hidden", type !== "line"));
}

function handleLayerListClick(event) {
  const item = event.target.closest(".layer-item");
  if (!item) return;
  const layer = state.layers.find((entry) => entry.id === item.dataset.layerId);
  if (!layer) return;

  if (event.target.closest('[data-action="visibility"]')) {
    layer.visible = !layer.visible;
    touchState();
    commitHistory();
    renderAll();
    return;
  }

  if (event.target.closest('[data-action="lock"]')) {
    layer.locked = !layer.locked;
    touchState();
    commitHistory();
    renderAll();
    showToast(layer.locked ? "图层已锁定" : "图层已解锁");
    return;
  }

  selectedLayerId = layer.id;
  renderAll();
}

function handleEditorInput(event) {
  const layer = getSelectedLayer();
  if (!layer) return;
  const id = event.target.id;
  const value = event.target.value;

  const handlers = {
    layerText: () => (layer.text = value),
    fontFamily: () => (layer.fontFamily = value),
    fontWeight: () => (layer.fontWeight = Number(value)),
    layerX: () => (layer.x = Number(value)),
    layerY: () => (layer.y = Number(value)),
    layerRotation: () => (layer.rotation = Number(value)),
    fontSize: () => (layer.fontSize = Number(value)),
    maxWidth: () => (layer.maxWidth = Number(value)),
    letterSpacing: () => (layer.letterSpacing = Number(value)),
    lineHeight: () => (layer.lineHeight = Number(value)),
    textAlign: () => (layer.align = value),
    layerColor: () => (layer.color = value),
    lineWidth: () => (layer.width = Number(value)),
    lineThickness: () => (layer.thickness = Number(value)),
    sealSize: () => (layer.size = Number(value)),
    sealFontSize: () => (layer.fontSize = Number(value)),
    sealBackground: () => (layer.background = value),
    strokeColor: () => (layer.strokeColor = value),
    strokeWidth: () => (layer.strokeWidth = Number(value)),
    shadowColor: () => (layer.shadowColor = value),
    shadowBlur: () => (layer.shadowBlur = Number(value)),
    layerOpacity: () => {
      layer.opacity = Number(value);
      elements.opacityLabel.textContent = `${Math.round(layer.opacity * 100)}%`;
    },
  };

  if (!handlers[id]) return;
  handlers[id]();
  touchState();
  drawCanvas();
  renderLayerList();

  if (event.type === "change" || id === "layerText") commitHistory();
}

function addTextLayer() {
  const layer = textLayer({
    name: "新增文字",
    text: "输入标题",
    x: state.width / 2,
    y: state.height / 2,
    maxWidth: state.width * 0.75,
    fontSize: Math.round(state.width * 0.08),
  });
  state.layers.push(layer);
  selectedLayerId = layer.id;
  touchState();
  commitHistory();
  renderAll();
  showToast("已新增文字图层。", false);
}

function duplicateSelectedLayer() {
  const layer = getSelectedLayer();
  if (!layer) return;
  const clone = structuredClone(layer);
  clone.id = crypto.randomUUID();
  clone.name = `${layer.name} 副本`;
  clone.x += 28;
  clone.y += 28;
  const index = state.layers.findIndex((entry) => entry.id === layer.id);
  state.layers.splice(index + 1, 0, clone);
  selectedLayerId = clone.id;
  touchState();
  commitHistory();
  renderAll();
}

function deleteSelectedLayer() {
  const index = state.layers.findIndex((layer) => layer.id === selectedLayerId);
  if (index < 0) return;
  state.layers.splice(index, 1);
  selectedLayerId = state.layers[Math.min(index, state.layers.length - 1)]?.id ?? null;
  touchState();
  commitHistory();
  renderAll();
}

function moveSelectedLayerUp() {
  const index = state.layers.findIndex((layer) => layer.id === selectedLayerId);
  if (index < 0 || index === state.layers.length - 1) return;
  [state.layers[index], state.layers[index + 1]] = [state.layers[index + 1], state.layers[index]];
  touchState();
  commitHistory();
  renderAll();
}

function centerSelectedHorizontally() {
  const layer = getSelectedLayer();
  if (!layer) return;
  if (layer.type === "line") layer.x = (state.width - layer.width) / 2;
  else layer.x = state.width / 2;
  touchState();
  commitHistory();
  renderAll();
}

function centerSelectedVertically() {
  const layer = getSelectedLayer();
  if (!layer) return;
  layer.y = state.height / 2;
  touchState();
  commitHistory();
  renderAll();
}

function updateBackground(color) {
  state.background = color;
  elements.backgroundColor.value = color;
  elements.backgroundHex.value = color;
  touchState();
  commitHistory();
  drawCanvas();
}

function handlePointerDown(event) {
  const point = pointerToCanvas(event);
  const target = [...hitBoxes].reverse().find((box) => pointInBox(point, box));

  if (!target) {
    selectedLayerId = null;
    renderAll();
    return;
  }

  selectedLayerId = target.layerId;
  const layer = getSelectedLayer();
  if (layer.locked) {
    dragState = null;
    renderAll();
    showToast("图层已锁定，请先解锁");
    return;
  }
  dragState = {
    pointerId: event.pointerId,
    startX: point.x,
    startY: point.y,
    layerX: layer.x,
    layerY: layer.y,
    centerOffsetX: target.x + target.width / 2 - layer.x,
    centerOffsetY: target.y + target.height / 2 - layer.y,
    snappedX: false,
    snappedY: false,
    moved: false,
  };
  elements.canvas.setPointerCapture?.(event.pointerId);
  elements.canvas.classList.add("dragging");
  renderAll();
}

function handlePointerMove(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  const layer = getSelectedLayer();
  if (!layer) return;
  if (layer.locked) return;
  const point = pointerToCanvas(event);
  const dx = point.x - dragState.startX;
  const dy = point.y - dragState.startY;
  let nextX = dragState.layerX + dx;
  let nextY = dragState.layerY + dy;
  const threshold = SNAP_DISTANCE_PX / Math.max(customZoom, 0.1);
  const visualCenterX = nextX + dragState.centerOffsetX;
  const visualCenterY = nextY + dragState.centerOffsetY;
  const snapX = Math.abs(visualCenterX - state.width / 2) <= threshold;
  const snapY = Math.abs(visualCenterY - state.height / 2) <= threshold;
  if (snapX) nextX = state.width / 2 - dragState.centerOffsetX;
  if (snapY) nextY = state.height / 2 - dragState.centerOffsetY;
  if ((snapX && !dragState.snappedX) || (snapY && !dragState.snappedY)) {
    navigator.vibrate?.(8);
  }
  dragState.snappedX = snapX;
  dragState.snappedY = snapY;
  alignmentGuides = { vertical: snapX, horizontal: snapY };
  elements.canvas.dataset.guideX = String(snapX);
  elements.canvas.dataset.guideY = String(snapY);
  layer.x = Math.round(nextX);
  layer.y = Math.round(nextY);
  dragState.moved = dragState.moved || Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5;
  touchState();
  drawCanvas();
  renderEditor();
}

function handlePointerUp(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  elements.canvas.releasePointerCapture?.(event.pointerId);
  elements.canvas.classList.remove("dragging");
  if (dragState.moved) commitHistory();
  dragState = null;
  alignmentGuides = { vertical: false, horizontal: false };
  delete elements.canvas.dataset.guideX;
  delete elements.canvas.dataset.guideY;
  renderAll();
}

function pointerToCanvas(event) {
  const rect = elements.canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * state.width,
    y: ((event.clientY - rect.top) / rect.height) * state.height,
  };
}

function pointInBox(point, box) {
  return point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height;
}

function handleKeyboard(event) {
  if (isTypingTarget(event.target)) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      event.shiftKey ? redo() : undo();
    }
    return;
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
    event.preventDefault();
    event.shiftKey ? redo() : undo();
    return;
  }

  const layer = getSelectedLayer();
  if (!layer) return;
  if (layer.locked) return;
  const amount = event.shiftKey ? 10 : 1;
  const movements = {
    ArrowLeft: [-amount, 0],
    ArrowRight: [amount, 0],
    ArrowUp: [0, -amount],
    ArrowDown: [0, amount],
  };

  if (movements[event.key]) {
    event.preventDefault();
    layer.x += movements[event.key][0];
    layer.y += movements[event.key][1];
    touchState();
    commitHistory();
    renderAll();
  }

  if (event.key === "Delete" || event.key === "Backspace") {
    event.preventDefault();
    deleteSelectedLayer();
  }
}

function isTypingTarget(target) {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
}

function fitCanvasToStage() {
  const availableWidth = Math.max(200, elements.stage.clientWidth - 84);
  const availableHeight = Math.max(200, elements.stage.clientHeight - 84);
  customZoom = Math.min(availableWidth / state.width, availableHeight / state.height, 1);
  applyZoom(customZoom, "fit");
}

function changeZoom(delta) {
  zoomMode = "custom";
  customZoom = clamp(customZoom + delta, 0.1, 1.5);
  applyZoom(customZoom, "custom");
}

function applyZoom(zoom, mode) {
  elements.canvas.style.width = `${Math.round(state.width * zoom)}px`;
  elements.canvas.style.height = `${Math.round(state.height * zoom)}px`;
  elements.zoomLabel.value = mode === "fit" ? "适应" : `${Math.round(zoom * 100)}%`;
}

async function exportImage(mimeType, extension) {
  const scale = Number(elements.exportScale.value);
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = state.width * scale;
  exportCanvas.height = state.height * scale;
  const exportContext = exportCanvas.getContext("2d", { alpha: mimeType === "image/png" });
  drawCanvas(exportContext, scale, false);

  const quality = mimeType === "image/jpeg" ? 0.95 : 0.96;
  exportCanvas.toBlob(
    (blob) => {
      if (!blob) {
        showToast("导出失败，请稍后重试。", true);
        return;
      }
      downloadBlob(blob, `${safeFilename(state.name)}-${formatTimestamp()}.${extension}`);
      showToast(`已导出 ${state.width * scale} × ${state.height * scale} ${extension.toUpperCase()}。`, false);
      drawCanvas();
    },
    mimeType,
    quality,
  );
}

function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    elements.statusMessage.textContent = "已保存到本机";
    showToast("项目已保存到当前浏览器。", false);
  } catch (error) {
    console.warn("Unable to save project", error);
    showToast("保存失败，浏览器存储空间可能不足。", true);
  }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      showToast("本机还没有已保存的项目。", true);
      return;
    }
    applyProject(JSON.parse(raw));
    showToast("已读取本机项目。", false);
  } catch (error) {
    console.warn("Unable to load project", error);
    showToast("项目数据损坏，无法读取。", true);
  }
}

function downloadProject() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json;charset=utf-8" });
  downloadBlob(blob, `${safeFilename(state.name)}-${formatTimestamp()}.json`);
  showToast("项目 JSON 已导出。", false);
}

async function importProject(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  try {
    const project = JSON.parse(await file.text());
    applyProject(project);
    showToast("项目已导入。", false);
  } catch (error) {
    console.warn("Unable to import project", error);
    showToast("导入失败：请确认文件是有效的项目 JSON。", true);
  }
}

function applyProject(project) {
  validateProject(project);
  state = structuredClone(project);
  selectedLayerId = state.layers[0]?.id ?? null;
  resizeCanvas();
  commitHistory(true);
  renderAll();
  zoomMode = "fit";
  requestAnimationFrame(fitCanvasToStage);
}

function validateProject(project) {
  if (!project || typeof project !== "object") throw new Error("Invalid project");
  if (!Number.isFinite(project.width) || !Number.isFinite(project.height)) throw new Error("Invalid canvas size");
  if (!Array.isArray(project.layers)) throw new Error("Invalid layers");
}

async function loadCustomFont(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  const layer = getSelectedLayer();
  if (!layer || (layer.type !== "text" && layer.type !== "seal")) return;

  const familyName = `本地字体-${file.name.replace(/\.[^.]+$/, "")}-${Date.now()}`;
  try {
    const fontData = await file.arrayBuffer();
    const font = new FontFace(familyName, fontData);
    await font.load();
    document.fonts.add(font);
    customFonts.push({ name: file.name, value: `"${familyName}"` });
    populateFontOptions();
    layer.fontFamily = `"${familyName}"`;
    elements.fontFamily.value = layer.fontFamily;
    touchState();
    commitHistory();
    renderAll();
    showToast(`字体「${file.name}」已加载。`, false);
  } catch (error) {
    console.warn("Unable to load custom font", error);
    showToast("字体加载失败，请尝试 TTF、OTF、WOFF 或 WOFF2 文件。", true);
  }
}

function populateFontOptions() {
  const current = elements.fontFamily.value;
  elements.fontFamily.innerHTML = "";
  for (const option of customFonts) {
    const node = document.createElement("option");
    node.value = option.value;
    node.textContent = option.name;
    elements.fontFamily.appendChild(node);
  }
  if (current && [...elements.fontFamily.options].some((option) => option.value === current)) {
    elements.fontFamily.value = current;
  }
}

function ensureFontOption(value) {
  if ([...elements.fontFamily.options].some((option) => option.value === value)) return;
  const node = document.createElement("option");
  node.value = value;
  node.textContent = `项目字体：${value}`;
  elements.fontFamily.appendChild(node);
}

function commitHistory(reset = false) {
  if (suppressHistory) return;
  const snapshot = JSON.stringify(state);

  if (reset) {
    history = [snapshot];
    historyIndex = 0;
  } else {
    if (history[historyIndex] === snapshot) return;
    history = history.slice(0, historyIndex + 1);
    history.push(snapshot);
    if (history.length > MAX_HISTORY) history.shift();
    historyIndex = history.length - 1;
  }
  updateHistoryButtons();
}

function undo() {
  if (historyIndex <= 0) return;
  historyIndex -= 1;
  restoreHistorySnapshot(history[historyIndex]);
}

function redo() {
  if (historyIndex >= history.length - 1) return;
  historyIndex += 1;
  restoreHistorySnapshot(history[historyIndex]);
}

function restoreHistorySnapshot(snapshot) {
  suppressHistory = true;
  state = JSON.parse(snapshot);
  if (!state.layers.some((layer) => layer.id === selectedLayerId)) selectedLayerId = state.layers[0]?.id ?? null;
  resizeCanvas();
  renderAll();
  suppressHistory = false;
  if (zoomMode === "fit") requestAnimationFrame(fitCanvasToStage);
}

function updateHistoryButtons() {
  elements.undoButton.disabled = historyIndex <= 0;
  elements.redoButton.disabled = historyIndex >= history.length - 1;
}

function updateTemplateCards() {
  document.querySelectorAll("[data-template-id]").forEach((card) => {
    card.classList.toggle("active", card.dataset.templateId === state.templateId);
  });
}

function getSelectedLayer() {
  return state.layers.find((layer) => layer.id === selectedLayerId) ?? null;
}

function touchState() {
  state.updatedAt = new Date().toISOString();
  elements.statusMessage.textContent = "存在未保存修改";
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function showToast(message, isError = false) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.style.borderColor = isError ? "rgba(233, 25, 32, 0.65)" : "#353b45";
  elements.toast.classList.add("show");
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2600);
}

function normalizeHex(value) {
  const raw = String(value).trim();
  if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw.toLowerCase();
  if (/^[0-9a-fA-F]{6}$/.test(raw)) return `#${raw.toLowerCase()}`;
  return null;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function safeFilename(value) {
  return String(value)
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, "-")
    .slice(0, 80) || "dark-type-design";
}

function formatTimestamp() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
