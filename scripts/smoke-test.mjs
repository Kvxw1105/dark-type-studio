import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const js = fs.readFileSync(path.join(root, "app.js"), "utf8");

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

if (failures.length) {
  console.error("Smoke test failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Smoke test passed: ${ids.length} 个 HTML ID，${new Set(queriedIds).size} 个脚本选择器均有效。`);
