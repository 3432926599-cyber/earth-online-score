<p align="center">
  <img src="https://img.shields.io/badge/status-live-brightgreen?style=flat" alt="Live">
  <img src="https://img.shields.io/badge/stack-HTML%2FCSS%2FJS-f7df1e?logo=javascript" alt="Stack">
  <img src="https://img.shields.io/badge/deploy-Cloudflare_Pages-f38020?logo=cloudflare" alt="CF Pages">
  <img src="https://img.shields.io/badge/libs-html2canvas_1.4.1-6078ea" alt="html2canvas">
  <img src="https://img.shields.io/badge/design-Brutalist_Industrial-e85d04" alt="Design">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>

<h1 align="center">🌍 地球Online · 玩家评估报告</h1>

<p align="center"><strong>赛博系统界面风格 H5 测试页 — 24 题测地球Online玩家评分，生成分享卡片</strong></p>

<p align="center">
  <a href="https://earth-online-score.pages.dev"><strong>🌐 Live Demo</strong></a>
  ·
  <a href="#-本地预览"><strong>🏃 Quick Start</strong></a>
</p>

---

## ✦ 这是什么？

一个纯前端的娱乐向心理测试 H5 页面。用户回答 24 道题后，系统生成一份**赛博朋克风格**的「地球Online玩家评估报告」，包含评分、属性雷达图、成就徽章，支持一键生成分享卡片。

> ⚠️ 娱乐向 · 别当真但也别不当真 · 最终解释权归你自己

---

## 🎨 设计风格

采用 **Brutalist Industrial（野兽派工业风）** 设计系统：

- **色彩**：混凝土底色 `#e8e4df` + 安全橙 `#e85d04` 点缀
- **排版**：杂志问卷式布局 + 拍立得封面
- **结果页**：赛博系统界面风格，终端命令式信息展示
- **组件**：硬边无圆角、橡皮章标签、胶带装饰

---

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 🎯 **24 题评分体系** | 分模块评估（身份确认 → 生存技能 → 社交属性 → 隐藏天赋） |
| 📊 **多维雷达图** | Canvas 手绘雷达图，展示 6 维能力值 |
| 🏆 **成就徽章** | emoji 成就图标系统，根据答题结果解锁 |
| 📸 **分享卡片** | html2canvas 一键生成，可保存/分享 |
| 💬 **差评墙** | 玩家留言区，LocalStorage 持久化 |
| 📱 **移动端适配** | 微信 X5 内核适配、4 级响应式断点 |
| 🔌 **零依赖构建** | 纯静态，浏览器直接打开即用 |

---

## 📁 项目结构

```
earth-online-score/
├── index.html              # 主入口，4 个 Section（封面→答题→结果→差评墙）
├── css/
│   ├── style.css           # 全局样式 + 赛博主题
│   ├── magazine.css        # 杂志问卷布局
│   └── x5-fix.css          # 微信 X5 内核兼容
├── js/
│   ├── app.js              # 主逻辑（题目加载、评分计算、卡片生成）
│   ├── questions.js        # 24 题题库
│   └── share-card.js       # 分享卡片 Canvas 绘制
├── assets/
│   └── earth-horizon.jpg   # 地球地平线照片（Unsplash）
├── docs/
│   ├── pain-map-earth-online-score.md
│   └── validation-report-earth-online-score.md
└── README.md
```

---

## 🏃 本地预览

```bash
# 直接用浏览器打开
open index.html

# 或启动本地服务器
npx serve .
```

无需 `npm install`，无需构建工具。

---

## 🚀 部署

### Cloudflare Pages

1. 推送代码到 GitHub
2. Cloudflare Pages → 连接仓库
   - **构建命令**：（无）
   - **输出目录**：`/`（根目录）
3. 自动获得 `<project>.pages.dev` 域名

```bash
# 或通过 Wrangler CLI 手动部署
npx wrangler pages deploy . --project-name=earth-online-score
```

---

## 🔧 可选配置

| 配置项 | 文件 | 说明 |
|--------|------|------|
| Supabase 埋点 | `js/app.js` | 修改 `SUPABASE_URL` / `SUPABASE_KEY` |
| 题库 | `js/questions.js` | 增删改题目 |
| 评分权重 | `js/app.js` | 调整各模块权重 |

> 埋点功能静默失败，不影响核心功能。

---

## 🔗 相关链接

- **个人主页**：[supersuperchik-home.pages.dev](https://supersuperchik-home.pages.dev)
- **GitHub**：[3432926599-cyber](https://github.com/3432926599-cyber)

---

## 👤 作者

**SupersupErChik** — [GitHub](https://github.com/3432926599-cyber)

---

## 📄 License

MIT © 2026 SupersupErChik
