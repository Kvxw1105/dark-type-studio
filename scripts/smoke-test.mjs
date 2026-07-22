import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const js = fs.readFileSync(path.join(root, "app.js"), "utf8");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const workflowPath = path.join(root, ".github", "workflows", "pages.yml");

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
assert(duplicateIds.length === 0, `HTML 存在重复 ID：${[...new Set(duplicateIds)].join(", ")}`);

const queriedIds = [...js.matchAll(/querySelector\("#([A-Za-z0-9_-]+)"\)/g)].map((match) => match[1]);
for (const id of new Set(queriedIds)) {
  assert(ids.includes(id), `app.js 引用了不存在的元素 #${id}`);
}

assert(html.includes('id="designCanvas"'), "缺少设计画布");
assert(html.includes('data-template-id="square-cover"'), "缺少方形封面模板入口");
assert(html.includes('data-template-id="video-title"'), "缺少视频标题模板入口");
assert(js.includes('"square-cover"'), "缺少方形模板定义");
assert(js.includes('"video-title"'), "缺少视频标题模板定义");
assert(js.includes('exportImage("image/png"'), "缺少 PNG 导出");
assert(js.includes('exportImage("image/jpeg"'), "缺少 JPG 导出");
assert(js.includes('exportImage("image/webp"'), "缺少 WebP 导出");
assert(js.includes("new FontFace"), "缺少本地字体加载能力");
assert(css.includes(".workspace"), "缺少工作区布局样式");
assert(pkg.version === "1.1.1", "package.json 版本应为 1.1.1");
assert(js.includes('APP_VERSION = "1.1.1"'), "app.js 版本与 package.json 不一致");
assert(html.includes('id="layerRotation"'), "缺少图层旋转控件");
assert(html.includes('data-mobile-view="canvas"'), "缺少移动端工作区切换");
assert(html.includes('id="canvasPreset"'), "缺少社媒画布尺寸预设");
assert(js.includes("drawAlignmentGuides"), "缺少中心对齐参考线");
assert(js.includes("navigator.vibrate"), "缺少吸附触觉反馈");
assert(js.includes("roundedRectPath"), "缺少自适应胶囊印章渲染");
assert(fs.existsSync(workflowPath), "缺少 GitHub Pages 工作流");
if (fs.existsSync(workflowPath)) {
  const workflow = fs.readFileSync(workflowPath, "utf8");
  for (const required of ["actions/checkout@", "npm test", "actions/configure-pages@", "actions/upload-pages-artifact@", "actions/deploy-pages@"]) {
    assert(workflow.includes(required), `Pages 工作流缺少 ${required}`);
  }
}

if (failures.length) {
  console.error("Smoke test failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Smoke test passed: ${ids.length} 个 HTML ID，${new Set(queriedIds).size} 个脚本选择器均有效。`);
