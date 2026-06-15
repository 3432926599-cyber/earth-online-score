# 地球Online 评分测试

赛博系统界面风格 H5 测试页。24 题测地球Online玩家评分，生成分享卡片。

## 本地预览

直接用浏览器打开 `index.html` 即可，无需构建。

## 部署（Cloudflare Pages）

1. 推送代码到 GitHub
2. Cloudflare Pages → 连接仓库 → 部署
   - 构建命令：（无）
   - 输出目录：`/`（根目录）
3. 获得域名：`<项目名>.pages.dev`

## 素材

- `assets/earth-horizon.jpg` — Unsplash 地球地平线照片
- 成就图标使用 emoji（无需额外素材）

## 配置

- `js/app.js` — 修改 `SUPABASE_URL` 和 `SUPABASE_KEY` 为实际 Supabase 项目值
- 如不需要埋点，忽略即可（静默失败，不影响功能）

## 技术栈

纯静态 HTML + CSS + JS · html2canvas 1.4.1 · Cloudflare Pages
