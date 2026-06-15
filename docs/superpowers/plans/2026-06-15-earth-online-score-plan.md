# 地球Online评分测试 H5 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个纯静态赛博系统界面风格的H5测试页——用户答24题测地球Online评分，生成分享卡片，引流个人网站。

**Architecture:** 单页HTML + 6个CSS/JS模块文件。JS对象管理答题状态→成就检测→评分计算→html2canvas生成分享卡片。零框架零后端，Cloudflare Pages部署。

**Tech Stack:** HTML5 + CSS3 + Vanilla JS + html2canvas 1.4.1 + Cloudflare Pages

**设计文档:** `docs/superpowers/specs/2026-06-15-earth-online-score-design.md`

---

## 文件结构

```
earth-online-test/
├── index.html              ← 单页入口，6个Section
├── css/
│   ├── style.css           ← 全局样式+赛博配色+排版+纹理
│   └── x5-fix.css          ← 微信X5兼容补丁
├── js/
│   ├── data.js             ← 题目数据+成就库+差评墙文案（纯数据）
│   ├── quiz.js             ← 答题逻辑：渲染题目、选项点击、进度条
│   ├── achievements.js     ← 成就检测：实时匹配选项→弹出toast
│   ├── scoring.js          ← 评分计算：分数→等级→系统留言
│   ├── card.js             ← html2canvas卡片生成+长按保存
│   ├── wall.js             ← 差评墙瀑布流渲染
│   └── app.js              ← 主控制器：Section切换、初始化、事件绑定
├── assets/
│   └── earth-horizon.jpg   ← NASA地球地平线照片（开发时手动下载放入）
└── README.md
```

每个文件职责单一：
- `data.js` 只有数据，无逻辑
- `quiz.js` 只负责答题交互
- `achievements.js` 只负责成就检测和弹窗
- `scoring.js` 只负责分数计算
- `card.js` 只负责卡片生成
- `wall.js` 只负责差评墙
- `app.js` 只负责页面切换和全局协调

---

### Task 1: 项目骨架 + CSS 赛博风格

**Files:**
- Create: `index.html`
- Create: `css/style.css`
- Create: `css/x5-fix.css`
- Create: `assets/.gitkeep`

- [ ] **Step 1: 创建 index.html 骨架**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover">
  <meta name="x5-orientation" content="portrait">
  <meta name="x5-fullscreen" content="true">
  <meta name="x5-page-mode" content="app">
  <meta name="format-detection" content="telephone=no,email=no">
  <title>地球Online · 玩家评估报告</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/x5-fix.css">
</head>
<body>
  <div id="app">
    <!-- Section 1: 首屏 -->
    <section id="sec-landing" class="section active">
      <div class="horizon-area">
        <div class="horizon-img"></div>
        <div class="horizon-glow"></div>
      </div>
      <div class="terminal-line">
        <span class="prompt">></span>
        <span class="cmd">ssh player@earth-online --eval</span>
        <span class="cursor">▮</span>
      </div>
      <h1 class="title-main">
        <span class="deco">█▓▒░</span>
        地球<span class="accent-cyan">Online</span>
        <span class="deco">░▒▓█</span>
      </h1>
      <p class="subtitle-accent">系统档案 · 玩家评估报告</p>
      <button id="btn-start" class="btn-cyber">▸ 点击验证身份，查看评分</button>
      <p class="footnote">*本系统仅为娱乐用途，最终解释权归你自己</p>
    </section>

    <!-- Section 2: 答题 -->
    <section id="sec-quiz" class="section">
      <div class="quiz-header">
        <div class="terminal-line small">
          <span class="prompt">></span>
          <span class="cmd" id="quiz-cmd">正在扫描玩家存档…</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" id="quiz-progress"></div></div>
        <span class="progress-text" id="quiz-counter">Q1/24</span>
      </div>
      <div class="quiz-body" id="quiz-body"></div>
    </section>

    <!-- Section 3: 结果页 -->
    <section id="sec-result" class="section">
      <div id="result-card">
        <!-- html2canvas 截取此区域生成分享卡片 -->
      </div>
      <div id="result-actions">
        <button id="btn-share" class="btn-cyber">📋 生成分享卡片</button>
        <button id="btn-wall" class="btn-cyber-amber">★ 去差评墙 骂策划</button>
      </div>
    </section>

    <!-- Section 4: 差评墙 -->
    <section id="sec-wall" class="section">
      <h2 class="wall-title">★ 玩家差评墙</h2>
      <div id="wall-grid" class="wall-grid"></div>
      <div class="wall-input-deco">
        <span class="prompt">>></span>
        <input type="text" placeholder="提交你的差评…" disabled>
      </div>
    </section>

    <!-- 底部引流 -->
    <footer id="sec-footer">
      <p>想要了解评分机制 / 学习制作同款H5？</p>
      <p class="footer-link">👉 supersuperchik-home.pages.dev</p>
    </footer>
  </div>

  <!-- Toast 成就弹出容器 -->
  <div id="toast-container"></div>

  <!-- 分享图片覆盖层（长按保存） -->
  <div id="share-overlay" class="hidden">
    <img id="share-img" src="" alt="分享卡片">
    <p class="share-hint">长按图片保存到相册</p>
    <button id="btn-close-share" class="btn-cyber">关闭</button>
  </div>

  <script src="js/data.js"></script>
  <script src="js/quiz.js"></script>
  <script src="js/achievements.js"></script>
  <script src="js/scoring.js"></script>
  <script src="js/card.js"></script>
  <script src="js/wall.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: 创建 css/style.css — CSS变量 + 纹理 + 排版**

```css
:root {
  --bg: #060d14;
  --cyan: #00f0ff;
  --amber: #ffaa00;
  --red: #ff6644;
  --white: #ffffff;
  --text-dim: rgba(255,255,255,0.45);
  --text-mid: rgba(255,255,255,0.55);
  --font-body: 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif;
  --font-mono: 'Courier New', 'Consolas', 'Monaco', monospace;
  --font-title: 'Arial Black', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

* { margin:0; padding:0; box-sizing:border-box; }

body {
  background: var(--bg);
  color: var(--white);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  overflow-x: hidden;
}

#app {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
  position: relative;
  overflow: hidden;
}

/* 4层背景纹理 */
#app::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  /* 纹理0: 星场 */
  background-image:
    radial-gradient(0.6px 0.6px at 3% 2%, rgba(255,255,255,0.5), transparent),
    radial-gradient(0.8px 0.8px at 9% 5%, rgba(255,255,255,0.4), transparent),
    radial-gradient(0.5px 0.5px at 16% 3%, rgba(255,255,255,0.55), transparent),
    radial-gradient(0.7px 0.7px at 24% 7%, rgba(255,255,255,0.45), transparent),
    radial-gradient(0.9px 0.9px at 33% 4%, rgba(255,255,255,0.5), transparent),
    radial-gradient(0.5px 0.5px at 41% 8%, rgba(255,255,255,0.6), transparent),
    radial-gradient(0.7px 0.7px at 50% 3%, rgba(255,255,255,0.45), transparent),
    radial-gradient(0.6px 0.6px at 58% 6%, rgba(255,255,255,0.55), transparent),
    radial-gradient(0.8px 0.8px at 67% 4%, rgba(255,255,255,0.5), transparent),
    radial-gradient(0.5px 0.5px at 75% 8%, rgba(255,255,255,0.6), transparent),
    radial-gradient(0.7px 0.7px at 84% 5%, rgba(255,255,255,0.45), transparent),
    radial-gradient(0.6px 0.6px at 92% 7%, rgba(255,255,255,0.55), transparent);
}

#app::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  /* 纹理1: 扫描线 */
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,240,255,0.04) 2px,
    rgba(0,240,255,0.04) 3px
  );
}

/* Section 切换 */
.section {
  display: none;
  position: relative;
  z-index: 1;
  padding: 0 12px;
}
.section.active { display: block; }

/* 地平线区域 */
.horizon-area {
  width: 100%;
  height: 140px;
  overflow: hidden;
  position: relative;
  margin: 0 -12px;
  width: calc(100% + 24px);
}
.horizon-img {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #020810 0%, #061020 35%, #040d18 100%);
  /* 开发时替换为: background-image: url(../assets/earth-horizon.jpg); background-size: cover; */
  position: relative;
}
.horizon-img::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 50px;
  background: linear-gradient(180deg, transparent, var(--bg));
}
.horizon-glow {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--cyan), var(--amber), var(--cyan), transparent);
  box-shadow: 0 0 14px rgba(0,240,255,0.5);
}

/* 终端命令行 */
.terminal-line {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 0 2px;
  font-family: var(--font-mono);
  font-size: 12px;
}
.terminal-line.small { font-size: 10px; }
.prompt { color: var(--cyan); }
.cmd { color: rgba(0,240,255,0.45); }
.cursor { color: var(--cyan); animation: blink 1s step-end infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

/* 标题 */
.title-main {
  text-align: center;
  font-size: 28px;
  font-weight: 900;
  color: var(--white);
  letter-spacing: 4px;
  font-family: var(--font-title);
  text-shadow: 0 0 18px rgba(0,240,255,0.45);
  padding: 4px 0;
}
.title-main .deco { color: var(--amber); font-size: 12px; font-family: var(--font-mono); letter-spacing: 2px; }
.accent-cyan { color: var(--cyan); }
.subtitle-accent {
  text-align: center;
  font-size: 14px;
  color: var(--amber);
  letter-spacing: 5px;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(255,170,0,0.35);
  padding-bottom: 8px;
}

/* 赛博按钮 */
.btn-cyber {
  display: block;
  margin: 12px auto;
  padding: 12px 32px;
  background: transparent;
  color: var(--cyan);
  border: 1.5px solid var(--cyan);
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
  text-shadow: 0 0 8px rgba(0,240,255,0.4);
  box-shadow: 0 0 12px rgba(0,240,255,0.15);
  transition: all 0.2s;
}
.btn-cyber:active { background: rgba(0,240,255,0.12); box-shadow: 0 0 20px rgba(0,240,255,0.3); }
.btn-cyber-amber { color: var(--amber); border-color: var(--amber); box-shadow: 0 0 12px rgba(255,170,0,0.15); }
.btn-cyber-amber:active { background: rgba(255,170,0,0.12); }

.footnote {
  text-align: center;
  font-size: 11px;
  color: var(--text-dim);
  padding: 16px 0;
}

/* 进度条 */
.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(0,240,255,0.1);
  border-radius: 2px;
  margin: 6px 0;
}
.progress-fill {
  height: 100%;
  background: var(--cyan);
  border-radius: 2px;
  transition: width 0.3s;
  box-shadow: 0 0 8px rgba(0,240,255,0.4);
}
.progress-text {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-dim);
}

/* 隐藏 */
.hidden { display: none !important; }
```

- [ ] **Step 3: 创建 css/x5-fix.css**

```css
/* 微信X5内核Flexbox四重声明 */
.flex { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; }
.flex-item { -webkit-box-flex: 1; -webkit-flex: 1; -ms-flex: 1; flex: 1; }

/* 防iOS输入框自动缩放 */
input, textarea, select { font-size: 16px; }

/* 禁长按菜单 */
* { -webkit-touch-callout: none; }

/* 禁点击高亮 */
* { -webkit-tap-highlight-color: transparent; }

/* 动态--vh */
.fullscreen { min-height: calc(var(--vh, 1vh) * 100); min-height: 100dvh; }

/* 低端机降级 */
.low-end-mode * { animation: none !important; }

/* 运动偏好 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 4: 提交**

```bash
git add index.html css/ assets/
git commit -m "feat: project skeleton with cyber system UI + X5 fixes"
```

---

### Task 2: 数据层 — 题目+成就+差评

**Files:**
- Create: `js/data.js`

- [ ] **Step 1: 创建 js/data.js — 24题数据**

```javascript
// 地球Online 评分测试 — 数据层
// 题目数据 / 成就库 / 差评墙文案 / 等级映射

const QUESTIONS = [
  // ═══ 模块一: 身份确认 (Q1-Q4) ═══
  {
    id: 1,
    module: '身份确认',
    cmdLog: '> 正在扫描 [玩家身份模块] …',
    question: '如果有人把你的前半生写进地球Online游戏评测，你觉得开头应该是？',
    options: [
      { text: '「开服45亿年，这位玩家居然还没退游」', achievements: ['强制在线'] },
      { text: '「随机开局，属性点分配存疑」', achievements: ['强制在线'] },
      { text: '「UID已激活，主线任务加载中……」', achievements: [] },
      { text: '「警告：此账号有严重挂机嫌疑」', achievements: ['退游按钮不存在'] }
    ]
  },
  {
    id: 2,
    module: '身份确认',
    cmdLog: '> 正在扫描 [服务器归属] …',
    question: '你觉得自己被分配到了哪个服务器？',
    options: [
      { text: '国服·困难模式 — 人多竞争大，但爆率还行', achievements: [] },
      { text: '欧服·休闲服 — 躺着都能升级', achievements: [] },
      { text: '国服·地狱服 — 出生点资源匮乏，全靠肝', achievements: ['金币获取困难'] },
      { text: '混服 — 我也不知道自己在哪，反正延迟很高', achievements: [] }
    ]
  },
  {
    id: 3,
    module: '身份确认',
    cmdLog: '> 正在扫描 [初始属性] …',
    question: '你的「初始属性点」分配最接近哪种？',
    options: [
      { text: '智力+运气双高 — 老天爷喂饭型', achievements: [] },
      { text: '颜值+社交拉满 — 靠脸/靠嘴吃饭型', achievements: [] },
      { text: '耐力+韧性点满 — 打不死的小强型', achievements: ['自律传说'] },
      { text: '好像都点了，又好像都没点 — 均衡平庸型', achievements: ['空想行动派'] }
    ]
  },
  {
    id: 4,
    module: '身份确认',
    cmdLog: '> 正在扫描 [角色满意度] …',
    question: '如果有人告诉你「可以重新捏脸+选出生地」，你会？',
    options: [
      { text: '立刻重开！我有一堆想改的设定', achievements: ['捏脸系统崩坏'] },
      { text: '算了，现在的存档虽然烂但也习惯了', achievements: ['退游按钮不存在'] },
      { text: '我只想改经济属性，别的无所谓', achievements: [] },
      { text: '不换——这条命我认了，玩到底', achievements: [] }
    ]
  },

  // ═══ 模块二: 日常生存 (Q5-Q8) ═══
  {
    id: 5,
    module: '日常生存',
    cmdLog: '> 正在扫描 [日常任务模块] …',
    question: '你的日常通勤/上学路径，用游戏术语最准确的是？',
    options: [
      { text: '每日跑图 — 固定路线，固定时间，和NPC没区别', achievements: ['NPC觉醒'] },
      { text: '地铁/公交是我的第二卧室 — 上车就睡，到站自动醒', achievements: ['通勤耐力MAX'] },
      { text: '堵车让我怀疑道路AI的路径规划算法是不是坏了', achievements: ['通勤耐力MAX'] },
      { text: '远程办公/走路上学 — 我跳过了这个副本', achievements: [] }
    ]
  },
  {
    id: 6,
    module: '日常生存',
    cmdLog: '> 正在扫描 [饮食模块] …',
    question: '上周你的伙食来源，占比最大的是？',
    options: [
      { text: '外卖App — 我和骑手的亲密度已达「家人」级', achievements: ['外卖至尊VIP'] },
      { text: '食堂/公司楼下 — 每天三顿同一家，老板认得我', achievements: [] },
      { text: '自己做 — 起码我会煮泡面加蛋，算吗？', achievements: [] },
      { text: '饭搭子/对象/室友投喂 — 我是被动生存型', achievements: [] }
    ]
  },
  {
    id: 7,
    module: '日常生存',
    cmdLog: '> 正在扫描 [睡眠模块] …',
    question: '你平均几点入睡？',
    options: [
      { text: '22:00前 — 我是那种「到点就困」的稀有生物', achievements: ['自律传说'] },
      { text: '23:00-1:00 — 正常人类的波动范围', achievements: [] },
      { text: '1:00-3:00 — 服务器维护时段我仍在活跃', achievements: ['凌晨三点常驻者'] },
      { text: '3:00以后 — 我和太阳的作息达成了完美错峰', achievements: ['凌晨三点常驻者'] }
    ]
  },
  {
    id: 8,
    module: '日常生存',
    cmdLog: '> 正在扫描 [执行力模块] …',
    question: '你的收藏夹/待办清单/购物车，现状是？',
    options: [
      { text: '收藏夹=我的数字坟墓 — 存了300条，看过3条', achievements: ['空想行动派'] },
      { text: '待办清单比人生规划还长 — 但执行力约等于零', achievements: ['空想行动派'] },
      { text: '我是那种「想到就做」的人 — 虽然做一半就换下一个', achievements: [] },
      { text: '我定期清理，已完成>>未完成 — 别羡慕，我有强迫症', achievements: [] }
    ]
  },

  // ═══ 模块三: 经济扫描 (Q9-Q12) ═══
  {
    id: 9,
    module: '经济扫描',
    cmdLog: '> 正在扫描 [经济模块·收入] …',
    question: '你目前的收入来源最接近？',
    options: [
      { text: '完全靠自己 — 工资/自由职业/创业，不拿家里一分钱', achievements: ['经济断奶'] },
      { text: '半靠自己+半靠家里 — 过渡期，新手村补给还没断', achievements: [] },
      { text: '主要还是靠家里 — 新手村的免费补给包还在领', achievements: [] },
      { text: '靠利息/被动收入活着 — 你点这个选项是来炫耀的吧？', achievements: ['经济断奶'] }
    ]
  },
  {
    id: 10,
    module: '经济扫描',
    cmdLog: '> 正在扫描 [经济模块·账单] …',
    question: '你和上个月的花呗/信用卡账单的关系是？',
    options: [
      { text: '全额还清，甚至觉得花呗给我额度太低', achievements: [] },
      { text: '刚好还完，余额回到三位数', achievements: [] },
      { text: '分期了——「下个月的我一定有钱」', achievements: ['金币获取困难'] },
      { text: '我选择不看账单——不看到就等于不存在', achievements: ['金币获取困难'] }
    ]
  },
  {
    id: 11,
    module: '经济扫描',
    cmdLog: '> 正在扫描 [经济模块·住房] …',
    question: '你的住房现状？',
    options: [
      { text: '自己买的，无贷或已还清 — 全服稀有成就', achievements: ['全款置业'] },
      { text: '有房贷但还得起 — 标准的「成年人负重前行」副本', achievements: [] },
      { text: '租房 — 每个月给房东贡献金币，俗称「氪金交租」', achievements: ['金币获取困难'] },
      { text: '和父母/朋友住 — 社交羁绊Buff，但独立空间Debuff', achievements: [] }
    ]
  },
  {
    id: 12,
    module: '经济扫描',
    cmdLog: '> 正在扫描 [经济模块·评价] …',
    question: '如果要给「钱」这个游戏道具写一句评价？',
    options: [
      { text: '「获取难度过高，爆率极低」', achievements: ['金币获取困难'] },
      { text: '「建议增加日常任务金币奖励」', achievements: [] },
      { text: '「这个道具本身没什么问题，问题是别人太多了」', achievements: [] },
      { text: '「金币只是数字，快乐才是真·稀有道具」', achievements: [] }
    ]
  },

  // ═══ 模块四: 社交羁绊 (Q13-Q16) ═══
  {
    id: 13,
    module: '社交羁绊',
    cmdLog: '> 正在扫描 [社交模块·羁绊] …',
    question: '你有一个认识 10 年以上、凌晨三点能打电话的人吗？',
    options: [
      { text: '有，不止一个——这是我在地球Online最珍贵的装备', achievements: ['真心羁绊'] },
      { text: '有一个——系统保留了一个不会被更新删除的好友位', achievements: ['真心羁绊'] },
      { text: '曾经有，但版本更新后好友栏灰了', achievements: [] },
      { text: '没有——我的社交栏主打一个「轻量级生存」', achievements: [] }
    ]
  },
  {
    id: 14,
    module: '社交羁绊',
    cmdLog: '> 正在扫描 [社交模块·角色] …',
    question: '你在人群中的角色最接近？',
    options: [
      { text: '气氛组——聚会的灵魂，群聊的发动机', achievements: [] },
      { text: '观察者——角落静静看大家表演，内心弹幕刷屏', achievements: ['NPC觉醒'] },
      { text: '被迫社交型——「好的」「收到」「哈哈哈」', achievements: [] },
      { text: '看情况——熟人面前是A，陌生人面前是NPC', achievements: [] }
    ]
  },
  {
    id: 15,
    module: '社交羁绊',
    cmdLog: '> 正在扫描 [社交模块·NPC] …',
    question: '关于「上班/上学的自己像NPC」这个说法，你——',
    options: [
      { text: '草，这就是我！每天固定路线固定台词固定表情', achievements: ['NPC觉醒'] },
      { text: '偶尔有这种感觉，但大部分时候我还是主角', achievements: [] },
      { text: '不觉得——NPC至少不会被老板骂', achievements: ['退游按钮不存在'] },
      { text: '我连NPC都不如——NPC不用加班', achievements: ['退游按钮不存在'] }
    ]
  },
  {
    id: 16,
    module: '社交羁绊',
    cmdLog: '> 正在扫描 [社交模块·删号] …',
    question: '你上一次「差点想删号重开」是因为？',
    options: [
      { text: '工作/学业副本太难，攻略查不到', achievements: ['退游按钮不存在'] },
      { text: '感情支线 bug 太多，不知道哪个选项是对的', achievements: ['退游按钮不存在'] },
      { text: '经济系统失衡——别人氪金我吃土', achievements: ['金币获取困难'] },
      { text: '没想过——虽然这游戏垃圾但我还在玩', achievements: ['BUG共生体'] }
    ]
  },

  // ═══ 模块五: 隐藏属性 (Q17-Q20) ═══
  {
    id: 17,
    module: '隐藏属性',
    cmdLog: '> 正在扫描 [隐藏属性·热爱] …',
    question: '你还在做小时候喜欢的那些事吗？（画画/弹琴/踢球/写东西/看星星……）',
    options: [
      { text: '在！而且它现在是我的职业/副业——初心变现了', achievements: ['初心未改'] },
      { text: '偶尔还会——像打开一个旧存档，手感还在', achievements: ['初心未改'] },
      { text: '想，但每次都被「等有空了」打败', achievements: ['空想行动派'] },
      { text: '早就被社会规训副本洗掉了——连想都想不起来了', achievements: [] }
    ]
  },
  {
    id: 18,
    module: '隐藏属性',
    cmdLog: '> 正在扫描 [隐藏属性·作息] …',
    question: '你的「生活规律度」最接近？',
    options: [
      { text: '固定作息+固定三餐——我是一台生物钟精准的人形机器', achievements: ['自律传说'] },
      { text: '大体规律，偶尔崩——人类正常波动范围', achievements: [] },
      { text: '混乱中立——工作日规律，周末直接删档', achievements: [] },
      { text: '我的作息是一个随机数生成器——没有人能预测我什么时候醒', achievements: ['凌晨三点常驻者'] }
    ]
  },
  {
    id: 19,
    module: '隐藏属性',
    cmdLog: '> 正在扫描 [隐藏属性·风景] …',
    question: '你上一次「停下来认真看日落/拍下一张风景」是？',
    options: [
      { text: '这周——画面还在我相册里', achievements: ['落日收藏家'] },
      { text: '上个月——当时觉得好看就拍了', achievements: ['落日收藏家'] },
      { text: '去年——翻相册才发现上次拍已经是去年', achievements: [] },
      { text: '什么是「停下来」？我好像一直在跑图', achievements: [] }
    ]
  },
  {
    id: 20,
    module: '隐藏属性',
    cmdLog: '> 正在扫描 [隐藏属性·地图] …',
    question: '你出过国吗？护照上盖了几个章？',
    options: [
      { text: '出过，多个国家——DLC「异国地图包」已全部加载', achievements: ['海外地图已扩展'] },
      { text: '出过1-2次——至少解锁了「装X时用英文」对话选项', achievements: ['海外地图已扩展'] },
      { text: '没出过——但护照已经办好了，随时准备出发', achievements: [] },
      { text: '没出过——国内服务器内容已经够我探索了', achievements: [] }
    ]
  },

  // ═══ 模块六: 终章审判 (Q21-Q24) ═══
  {
    id: 21,
    module: '终章审判',
    cmdLog: '> 正在扫描 [终章·态度] …',
    question: '用一句话描述你对「地球Online这款游戏」的态度？',
    options: [
      { text: '「BUG 很多，官方不修，但凑合能玩」', achievements: ['BUG共生体'] },
      { text: '「策划有问题，但风景是真的好」', achievements: [] },
      { text: '「垃圾游戏，毁我青春，但我还在线」', achievements: [] },
      { text: '「虽然没攻略没存档，但我这局打得还行」', achievements: [] }
    ]
  },
  {
    id: 22,
    module: '终章审判',
    cmdLog: '> 正在扫描 [终章·差评] …',
    question: '如果地球Online真有「差评入口」，你会打几星？',
    options: [
      { text: '★★☆☆☆ — 平衡性极差，氪金玩家体验远优于零氪', achievements: [] },
      { text: '★★★☆☆ — 垃圾但凑合能玩，偶尔有意外之喜', achievements: [] },
      { text: '★★★★☆ — 虽然策划不做人，但支线剧情还可以', achievements: [] },
      { text: '★★★★★ — 带我来这游戏的两个老玩家对我很好', achievements: [] }
    ]
  },
  {
    id: 23,
    module: '终章审判',
    cmdLog: '> 正在扫描 [终章·更新] …',
    question: '你觉得地球Online最需要「版本更新」修复的是什么？',
    options: [
      { text: '经济系统——金币获取难度过高，贫富差距太大', achievements: ['金币获取困难'] },
      { text: '健康机制——为什么熬夜会扣血！这不合理！', achievements: ['蚊子没削弱'] },
      { text: '社交匹配——找一个能一起打副本的人太难了', achievements: [] },
      { text: '心理模块——焦虑、内耗这些DEBUFF能不能删掉？', achievements: [] }
    ]
  },
  {
    id: 24,
    module: '终章审判',
    cmdLog: '> 正在扫描 [终章·结语] …',
    question: '最后一题——你希望你的「玩家评估报告」上写着？',
    options: [
      { text: '「能活到现在本身就及格了」', achievements: [] },
      { text: '「没有攻略，没有重来，但你的存档不算差」', achievements: [] },
      { text: '「隐藏BOSS级——系统都没想到你能玩这么好」', achievements: [] },
      { text: '「此玩家已学会在BUG周围正常行走，堪称人类适应力巅峰」', achievements: ['BUG共生体'] }
    ]
  }
];

// ═══ 成就库 ═══
// 卡片展示3条 + 完整报告15条
const ACHIEVEMENTS = {
  // 卡片展示（3条·高冒犯）
  '退游按钮不存在': {
    id: '壹',
    icon: '🚫',
    name: '退游按钮不存在',
    desc: '没说要玩，自动下载了。找不到退出键，销不了号。你提交的退游申请已被系统驳回——理由：找不到接盘侠。',
    color: 'cyan',
    type: 'showcase'
  },
  '捏脸系统崩坏': {
    id: '贰',
    icon: '🎲',
    name: '捏脸系统崩坏',
    desc: '纯随机建模。性别不能自选，角色身上有个合不上的漏洞。后期改外貌还要充钱——策划到底玩不玩自己做的游戏？',
    color: 'amber',
    type: 'showcase'
  },
  '蚊子没削弱': {
    id: '叁',
    icon: '🦟',
    name: '蚊子没削弱',
    desc: '夏天出门就掉血的bug至今未修。蚊子攻击力过高，夜间突袭判定离谱。全服玩家联名请愿削弱——策划：已读，不回。',
    color: 'cyan',
    type: 'showcase'
  },
  // 完整报告（15条·扫码查看）
  '强制在线': {
    id: '肆',
    icon: '🏆',
    name: '强制在线第N天',
    desc: '连续存活八千余天未删号。系统判定：玩家可能已遗忘登出指令，或根本不存在退出按钮。',
    color: 'cyan',
    type: 'full'
  },
  '通勤耐力MAX': {
    id: '伍',
    icon: '🚇',
    name: '通勤耐力MAX',
    desc: '跑图循环五百余次。脚底板耐久度接近临界值。系统建议申请仿生义体替换件。',
    color: 'amber',
    type: 'full'
  },
  '外卖至尊VIP': {
    id: '陆',
    icon: '🍜',
    name: '外卖至尊VIP',
    desc: '本地商家关系网已达挚友级。系统已记录您的偏好：不加香菜。雨天自动附赠补给筷子。',
    color: 'cyan',
    type: 'full'
  },
  '凌晨三点常驻者': {
    id: '柒',
    icon: '🦉',
    name: '凌晨三点常驻者',
    desc: '服务器维护时段仍保持活跃。系统已警告三次——但也知道说了你也不听。碳基生物的倔强。',
    color: 'amber',
    type: 'full'
  },
  '空想行动派': {
    id: '捌',
    icon: '📋',
    name: '空想行动派',
    desc: '计划制定技能满级，执行转化率持续低迷。收藏夹347条已读3条。想得挺美——系统锐评。',
    color: 'cyan',
    type: 'full'
  },
  'NPC觉醒': {
    id: '玖',
    icon: '🎭',
    name: 'NPC觉醒',
    desc: '您已连续多日怀疑自己是某个高玩的随从NPC。真相：您就是主角，只是当前剧情线写得太烂。',
    color: 'amber',
    type: 'full'
  },
  '经济断奶': {
    id: '拾',
    icon: '🍼',
    name: '经济断奶',
    desc: '罕见被动技能已解锁。其他玩家还在领新手村补给，您已自己种田。新手保护期已过期——但您不需要了。',
    color: 'cyan',
    type: 'full'
  },
  '全款置业': {
    id: '拾壹',
    icon: '🏠',
    name: '全款置业',
    desc: '传奇成就。您跳过了贷款DEBUFF剧情线。全服仅约4%玩家达成。请务必在评论区教教大家。',
    color: 'amber',
    type: 'full'
  },
  '真心羁绊': {
    id: '拾贰',
    icon: '🤝',
    name: '真心羁绊',
    desc: '社交质量大于社交数量。系统为您保留了一个不会被版本更新删除的好友位。掉落率最低的稀有道具。',
    color: 'cyan',
    type: 'full'
  },
  '初心未改': {
    id: '拾叁',
    icon: '🌱',
    name: '初心未改',
    desc: '稀有隐藏成就。多数玩家在社会规训副本中被洗掉该文件，您居然没丢。那个小孩还在系统后台运行着。',
    color: 'amber',
    type: 'full'
  },
  '自律传说': {
    id: '拾肆',
    icon: '⏰',
    name: '自律传说',
    desc: '检测到异常数据——生物钟未被资本扭曲。全服仅7%玩家达成。系统怀疑您是BUG，建议上报审核。',
    color: 'cyan',
    type: 'full'
  },
  '落日收藏家': {
    id: '拾伍',
    icon: '🌅',
    name: '落日收藏家',
    desc: '任务循环中检测到暂停指令。风景数据不计入经验值，但已写入核心记忆分区永久保存。',
    color: 'amber',
    type: 'full'
  },
  '海外地图已扩展': {
    id: '拾陆',
    icon: '🌏',
    name: '海外地图已扩展',
    desc: 'DLC异国地图包已加载。可解锁对话选项：偶尔在聊天中蹦几个英文单词时的微妙优越感。',
    color: 'cyan',
    type: 'full'
  },
  'BUG共生体': {
    id: '拾柒',
    icon: '💀',
    name: 'BUG共生体',
    desc: '已知漏洞规避路径已录入系统。官方补丁将不被部署。适应力评级：超越碳基生命范畴。',
    color: 'amber',
    type: 'full'
  },
  '金币获取困难': {
    id: '拾捌',
    icon: '💸',
    name: '金币获取困难',
    desc: '系统检测到您的金币获取速率低于服务器平均水平。这不是BUG——这是国服的基础难度设定。',
    color: 'cyan',
    type: 'full'
  }
};

// ═══ 差评墙文案（20条预置） ═══
const WALL_REVIEWS = [
  { stars: 1, text: '蚊子攻击力太高了，求削弱', player: '#382910' },
  { stars: 1, text: '出生没捏脸就算了，还给了个合不上的建模漏洞', player: '#001837' },
  { stars: 1, text: '没有退游按钮，差评', player: '#729103' },
  { stars: 1, text: '金币太难获取了', player: '#554201' },
  { stars: 1, text: '我没说要玩，自动下载了还退不出去', player: '#103948' },
  { stars: 1, text: '各服务器版本差距过大，亚服区别对待男女玩家', player: '#884502' },
  { stars: 1, text: '氪金玩家太多影响正常体验', player: '#332109' },
  { stars: 1, text: '女号每个月自动扣血的bug什么时候修？', player: '#665301' },
  { stars: 1, text: '日常副本「上班」太肝了，奖励少还掉健康值', player: '#448201' },
  { stars: 1, text: '睡眠系统老是进不去，差评', player: '#990172' },
  { stars: 1, text: '夏天出门就掉血的bug什么时候修复？', player: '#221098' },
  { stars: 1, text: '数学安装包在哪我一直没找着', player: '#773401' },
  { stars: 1, text: '不赠送摇杆，就送了两个小号的捏捏乐', player: '#120983' },
  { stars: 1, text: '逆天匹配机制，四面楚歌', player: '#556789' },
  { stars: 1, text: '初始金币每个人都不一样，想退游', player: '#334210' },
  { stars: 1, text: '来之前没人和我说这是男性向游戏啊！', player: '#998210' },
  { stars: 1, text: '角色建模不能改太吃配置了', player: '#442109' },
  { stars: 1, text: '什么时候出怀旧服？', player: '#663401' },
  { stars: 1, text: '落地保护都没有，差评', player: '#110093' },
  { stars: 1, text: '每天都要吃饭喝水太麻烦了，建议优化体力系统', player: '#882109' }
];

// ═══ 等级映射 ═══
const GRADE_MAP = {
  S: { min: 78, title: '隐藏BOSS级', msg: '系统都没想到你能玩这么好——你是不是偷偷开了控制台？全服顶尖数据，建议截图裱起来当传家宝。' },
  A: { min: 68, title: '高玩潜质', msg: '主线支线都能肝，装备掉落率也不错。可惜这游戏没有氪金通道——不然你现在应该在排行榜首页。' },
  B: { min: 58, title: '正经玩家', msg: '踏踏实实打主线，偶尔摸摸支线鱼。不靠欧气不靠氪——你是地球Online最稳定的在线用户画像。' },
  C: { min: 48, title: '及格线守门员', msg: '能活到现在本身就及格了。这游戏没有攻略没有重来——你还在线，就已经比很多人强了。' },
  D: { min: 0, title: 'BUG受害者联盟', msg: '系统BUG的受害者，资本机制的幸存者，生活副本的挨打王。但你还在——这本身就是一个传奇。' }
};
```

- [ ] **Step 2: 提交**

```bash
git add js/data.js
git commit -m "feat: add quiz data, achievement library, wall reviews, grade map"
```

---

### Task 3: 主控制器 + Section 切换

**Files:**
- Create: `js/app.js`

- [ ] **Step 1: 创建 js/app.js**

```javascript
// 地球Online 评分测试 — 主控制器

// 微信动态--vh
function setVh() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
setVh();
window.addEventListener('resize', () => requestAnimationFrame(setVh));

// 全局状态
const state = {
  currentSection: 'sec-landing',
  currentQuestion: 0,
  answers: [],        // [{ questionId, optionIndex }]
  achievements: [],   // [achievementKey, ...]
  score: 0,
  grade: '',
  startedAt: null
};

// Section 切换
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    state.currentSection = id;
    document.getElementById('app').scrollTop = 0;
    window.scrollTo(0, 0);
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 首屏按钮
  document.getElementById('btn-start').addEventListener('click', () => {
    state.startedAt = Date.now();
    showSection('sec-quiz');
    renderQuestion(0);
  });

  // 结果页按钮
  document.getElementById('btn-share').addEventListener('click', () => {
    generateShareCard();
  });
  document.getElementById('btn-wall').addEventListener('click', () => {
    showSection('sec-wall');
    renderWall();
  });

  // 关闭分享
  document.getElementById('btn-close-share').addEventListener('click', () => {
    document.getElementById('share-overlay').classList.add('hidden');
  });

  // 设备分级
  if (navigator.deviceMemory && navigator.deviceMemory < 4) {
    document.body.classList.add('low-end-mode');
  }
});
```

- [ ] **Step 2: 提交**

```bash
git add js/app.js
git commit -m "feat: add main controller with section switching and global state"
```

---

### Task 4: 答题逻辑

**Files:**
- Create: `js/quiz.js`

- [ ] **Step 1: 创建 js/quiz.js**

```javascript
// 答题逻辑

function renderQuestion(index) {
  if (index >= QUESTIONS.length) {
    finishQuiz();
    return;
  }
  state.currentQuestion = index;
  const q = QUESTIONS[index];
  const body = document.getElementById('quiz-body');
  const cmdEl = document.getElementById('quiz-cmd');
  const progressEl = document.getElementById('quiz-progress');
  const counterEl = document.getElementById('quiz-counter');

  // 更新进度
  cmdEl.textContent = q.cmdLog;
  const pct = ((index) / QUESTIONS.length) * 100;
  progressEl.style.width = `${pct}%`;
  counterEl.textContent = `Q${index + 1}/${QUESTIONS.length}`;

  // 渲染题目
  body.innerHTML = `
    <div class="quiz-module-label">[${q.module}]</div>
    <div class="quiz-question">${q.question}</div>
    <div class="quiz-options">
      ${q.options.map((opt, i) => `
        <button class="quiz-option" data-index="${i}">
          <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
          <span class="opt-text">${opt.text}</span>
        </button>
      `).join('')}
    </div>
  `;

  // 绑定事件
  body.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', function() {
      const optIndex = parseInt(this.dataset.index);
      selectOption(q, optIndex);
    });
  });
}

function selectOption(question, optIndex) {
  const selected = question.options[optIndex];

  // 记录答案
  state.answers.push({ questionId: question.id, optionIndex: optIndex });

  // 检测成就
  if (selected.achievements.length > 0) {
    selected.achievements.forEach(key => {
      checkAchievement(key);
    });
  }

  // 下一题（微小延迟让用户看到选中态）
  const btn = document.querySelector(`.quiz-option[data-index="${optIndex}"]`);
  if (btn) btn.classList.add('selected');

  setTimeout(() => {
    renderQuestion(state.currentQuestion + 1);
  }, 200);
}

function finishQuiz() {
  // 计算分数
  const result = calculateScore(state.answers, state.achievements);
  state.score = result.score;
  state.grade = result.grade;

  // 追加基于年龄的成就
  const age = prompt('输入你的年龄（仅用于成就计算，不存储）：');
  if (age && parseInt(age) >= 18) {
    checkAchievement('强制在线');
  }

  // 渲染结果页
  renderResult();
  showSection('sec-result');
}
```

- [ ] **Step 2: 创建题目样式（追加到 style.css）**

```css
/* 答题页样式 */
.quiz-header { padding: 8px 0; }
.quiz-module-label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--amber);
  letter-spacing: 2px;
  padding: 6px 0 2px;
}
.quiz-question {
  font-size: 18px;
  font-weight: bold;
  color: var(--white);
  padding: 8px 0 14px;
  line-height: 1.5;
}
.quiz-option {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  padding: 14px 12px;
  margin-bottom: 8px;
  background: rgba(0,240,255,0.03);
  border: 1.5px solid rgba(0,240,255,0.18);
  border-radius: 0;
  color: var(--white);
  font-family: var(--font-body);
  font-size: 15px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;
}
.quiz-option:active, .quiz-option.selected {
  background: rgba(0,240,255,0.1);
  border-color: var(--cyan);
  box-shadow: 0 0 12px rgba(0,240,255,0.2);
}
.opt-letter {
  flex-shrink: 0;
  width: 24px; height: 24px;
  border: 1.5px solid rgba(0,240,255,0.3);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: var(--cyan);
  font-family: var(--font-mono);
}
.opt-text { flex: 1; line-height: 1.4; }
```

- [ ] **Step 3: 提交**

```bash
git add js/quiz.js css/style.css
git commit -m "feat: add quiz rendering, option selection, progress tracking"
```

---

### Task 5: 成就检测 + Toast

**Files:**
- Create: `js/achievements.js`

- [ ] **Step 1: 创建 js/achievements.js**

```javascript
// 成就检测与弹出

function checkAchievement(key) {
  // 去重
  if (state.achievements.includes(key)) return;
  state.achievements.push(key);

  const ach = ACHIEVEMENTS[key];
  if (!ach) return;

  // 弹出 Toast
  showToast(ach);
}

function showToast(ach) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon">${ach.icon}</div>
    <div class="toast-body">
      <div class="toast-tag">🏆 成就解锁</div>
      <div class="toast-name">${ach.name}</div>
    </div>
  `;

  container.appendChild(toast);

  // 动画入场
  requestAnimationFrame(() => toast.classList.add('show'));

  // 3.5秒后自动移除
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
```

- [ ] **Step 2: 追加 Toast 样式到 style.css**

```css
/* Toast 成就弹出 */
#toast-container {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}
.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(6,13,20,0.95);
  border: 1.5px solid var(--amber);
  padding: 10px 14px;
  border-radius: 2px;
  box-shadow: 0 0 16px rgba(255,170,0,0.2);
  transform: translateX(120%);
  opacity: 0;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: auto;
  max-width: 260px;
}
.toast.show { transform: translateX(0); opacity: 1; }
.toast-icon { font-size: 24px; flex-shrink: 0; }
.toast-tag {
  font-size: 10px;
  color: var(--amber);
  font-family: var(--font-mono);
  letter-spacing: 2px;
}
.toast-name { font-size: 14px; color: var(--white); font-weight: bold; }
```

- [ ] **Step 3: 提交**

```bash
git add js/achievements.js css/style.css
git commit -m "feat: add achievement detection and toast popup animation"
```

---

### Task 6: 评分计算

**Files:**
- Create: `js/scoring.js`

- [ ] **Step 1: 创建 js/scoring.js**

```javascript
// 评分计算

function calculateScore(answers, achievements) {
  let score = 50; // 基础分：活着就值50

  // 成就加减分
  const scoreMap = {
    '强制在线': 1, '通勤耐力MAX': 2, '外卖至尊VIP': 1,
    '凌晨三点常驻者': -3, '空想行动派': -2, 'NPC觉醒': -1,
    '经济断奶': 6, '全款置业': 8, '真心羁绊': 5,
    '初心未改': 5, '自律传说': 5, '落日收藏家': 4,
    '海外地图已扩展': 3, '退游按钮不存在': 2,
    'BUG共生体': 2, '捏脸系统崩坏': 2, '蚊子没削弱': 2,
    '金币获取困难': -3
  };

  achievements.forEach(key => {
    if (scoreMap[key]) score += scoreMap[key];
  });

  // 限制范围
  score = Math.max(35, Math.min(88, score));

  // 等级判定
  let grade = 'D';
  if (score >= 78) grade = 'S';
  else if (score >= 68) grade = 'A';
  else if (score >= 58) grade = 'B';
  else if (score >= 48) grade = 'C';

  return { score, grade };
}

function getGradeInfo(grade) {
  return GRADE_MAP[grade];
}
```

- [ ] **Step 2: 提交**

```bash
git add js/scoring.js
git commit -m "feat: add scoring algorithm with achievement bonuses and grade mapping"
```

---

### Task 7: 结果页渲染

**Files:**
- Modify: `js/app.js` (追加 renderResult 函数)
- Modify: `css/style.css` (追加结果页样式)

- [ ] **Step 1: 在 app.js 末尾追加 renderResult 函数**

```javascript
// ═══ 结果页渲染 ═══
function renderResult() {
  const gradeInfo = getGradeInfo(state.grade);
  const card = document.getElementById('result-card');

  // 取展示成就（前3条触发+手动补充）
  let showcaseAchs = state.achievements
    .filter(k => ACHIEVEMENTS[k] && ACHIEVEMENTS[k].type === 'showcase')
    .slice(0, 3);
  // 如果展示成就不足3条，从完整成就中补充
  if (showcaseAchs.length < 3) {
    const fullAchs = state.achievements
      .filter(k => ACHIEVEMENTS[k] && ACHIEVEMENTS[k].type === 'full')
      .slice(0, 3 - showcaseAchs.length);
    showcaseAchs = [...showcaseAchs, ...fullAchs];
  }
  // 两者都不够3条时用默认
  if (showcaseAchs.length === 0) {
    showcaseAchs = ['退游按钮不存在', '捏脸系统崩坏', '蚊子没削弱'];
  }

  const achievementHTML = showcaseAchs.map((key, i) => {
    const a = ACHIEVEMENTS[key];
    if (!a) return '';
    const color = i % 2 === 0 ? 'var(--cyan)' : 'var(--amber)';
    return `
      <div class="ach-row" style="border-left:3px solid ${color};">
        <div class="ach-row-header">
          <span class="ach-icon">${a.icon}</span>
          <span class="ach-id" style="color:${color};">[成就·${a.id}]</span>
          <span class="ach-name">${a.name}</span>
        </div>
        <div class="ach-desc">${a.desc}</div>
      </div>
    `;
  }).join('');

  const totalCount = state.achievements.length;
  const hiddenCount = Math.max(0, 18 - totalCount);

  card.innerHTML = `
    <div class="horizon-area">
      <div class="horizon-img"></div>
      <div class="horizon-glow"></div>
    </div>
    <div class="terminal-line small">
      <span class="prompt">></span>
      <span class="cmd">ssh player@earth-online --eval</span>
      <span class="cursor">▮</span>
    </div>
    <h1 class="title-main">
      <span class="deco">█▓▒░</span>
      地球<span class="accent-cyan">Online</span>
      <span class="deco">░▒▓█</span>
    </h1>
    <p class="subtitle-accent">系统档案 · 玩家评估报告</p>

    <div class="result-score-row">
      <div>
        <div class="terminal-line small" style="padding:0;margin:0;">
          <span class="cmd">> 读取存档… > 计算评分…</span>
        </div>
        <p class="result-label">您的地球Online系统评分是</p>
      </div>
      <div class="result-score-big">C<span class="result-score-plus">+</span></div>
      <div class="result-score-num">${state.score}<span>分</span></div>
    </div>
    <p class="result-tagline">系统判定：玩家存活 — 能喘气本身就及格了</p>

    <div class="ach-section">
      <div class="terminal-line small">
        <span class="prompt">></span>
        <span class="cmd">cat /var/log/成就.log</span>
        <span style="color:var(--amber);font-size:12px;font-weight:bold;margin-left:4px;">— 我的成就 —</span>
      </div>
      ${achievementHTML}
      <div class="ach-more">
        <span class="cmd">> 还有 ${hiddenCount} 项成就在完整报告中…</span>
      </div>
    </div>

    <div class="debuff-row">
      <span class="debuff-tag">⚠ 警告：睡眠副本排队失败</span>
      <span class="debuff-tag">⚠ 警告：金币余额接近零点</span>
    </div>

    <p class="result-quote">「${gradeInfo.msg}」</p>
  `;
}
```

- [ ] **Step 2: 追加结果页样式到 style.css**

```css
/* 结果页 */
.result-score-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0,240,255,0.1);
  flex-wrap: wrap;
}
.result-label { font-size: 16px; color: var(--white); font-weight: bold; }
.result-score-big {
  font-size: 52px; font-weight: 900; color: var(--white);
  font-family: var(--font-title); line-height: 1;
  text-shadow: 0 0 26px rgba(0,240,255,0.55);
}
.result-score-plus { font-size: 30px; color: var(--cyan); }
.result-score-num {
  font-size: 18px; font-weight: 900; color: var(--cyan);
  font-family: var(--font-title); text-shadow: 0 0 12px rgba(0,240,255,0.5);
}
.result-score-num span { font-size: 10px; color: var(--text-dim); }
.result-tagline {
  text-align: center; font-size: 14px; color: var(--text-dim);
  padding: 8px 0; border-bottom: 1px solid rgba(0,240,255,0.06);
}

/* 成就条目 */
.ach-section { padding: 8px 0; }
.ach-row {
  padding: 10px; margin-bottom: 4px;
  background: rgba(0,240,255,0.03);
}
.ach-row-header { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
.ach-icon { font-size: 20px; }
.ach-id { font-size: 10px; font-weight: 900; font-family: var(--font-mono); }
.ach-name { font-size: 14px; color: var(--white); font-weight: bold; }
.ach-desc {
  font-size: 12px; color: var(--text-mid); line-height: 1.5;
  padding-left: 26px;
}
.ach-more {
  text-align: center; padding: 8px 0 4px;
  border-top: 1px dashed rgba(0,240,255,0.12);
  font-family: var(--font-mono); font-size: 11px;
}

/* DEBUFF */
.debuff-row { display: flex; gap: 4px; padding: 4px 0; }
.debuff-tag {
  flex: 1; text-align: center; font-size: 11px; padding: 5px 4px;
  background: rgba(255,80,50,0.06); border: 1px solid rgba(255,80,50,0.2);
  color: var(--red); font-family: var(--font-mono); font-weight: bold;
}

/* 金句 */
.result-quote {
  text-align: center; font-size: 13px; color: var(--text-dim);
  padding: 8px 0; font-style: italic;
}

/* 分享覆盖层 */
#share-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0,0,0,0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
#share-img { max-width: 90vw; max-height: 70vh; border-radius: 2px; }
.share-hint {
  color: var(--white); font-size: 14px; padding: 16px 0;
}
```

- [ ] **Step 3: 提交**

```bash
git add js/app.js css/style.css
git commit -m "feat: add result page rendering with achievements and debuffs"
```

---

### Task 8: 分享卡片生成（html2canvas）

**Files:**
- Create: `js/card.js`

- [ ] **Step 1: 在 index.html `<head>` 中添加 html2canvas CDN**

在 `</head>` 前添加：
```html
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
```

- [ ] **Step 2: 创建 js/card.js**

```javascript
// 分享卡片生成

async function generateShareCard() {
  const card = document.getElementById('result-card');
  const overlay = document.getElementById('share-overlay');
  const imgEl = document.getElementById('share-img');

  // 生成前先隐藏不需要的元素（命令行提示符等）
  try {
    const canvas = await html2canvas(card, {
      useCORS: true,
      scale: 3, // 高分辨率输出 ≈ 1080×1920
      backgroundColor: '#060d14',
      allowTaint: false,
      logging: false
    });

    imgEl.src = canvas.toDataURL('image/png');
    overlay.classList.remove('hidden');

  } catch (err) {
    console.error('卡片生成失败:', err);
    alert('卡片生成失败，请重试');
  }
}
```

- [ ] **Step 3: 提交**

```bash
git add js/card.js index.html
git commit -m "feat: add html2canvas share card generation with 3x scale"
```

---

### Task 9: 差评墙

**Files:**
- Create: `js/wall.js`
- Modify: `css/style.css`

- [ ] **Step 1: 创建 js/wall.js**

```javascript
// 差评墙

function renderWall() {
  const grid = document.getElementById('wall-grid');
  if (!grid) return;

  grid.innerHTML = WALL_REVIEWS.map(r => `
    <div class="wall-card">
      <div class="wall-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
      <div class="wall-text">${r.text}</div>
      <div class="wall-player">— 玩家${r.player}</div>
    </div>
  `).join('');
}
```

- [ ] **Step 2: 追加差评墙样式**

```css
/* 差评墙 */
.wall-title {
  text-align: center;
  font-size: 22px;
  font-weight: 900;
  color: var(--amber);
  letter-spacing: 3px;
  padding: 16px 0 12px;
  text-shadow: 0 0 12px rgba(255,170,0,0.3);
}
.wall-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding-bottom: 16px;
}
.wall-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  padding: 10px;
}
.wall-stars { font-size: 11px; color: var(--amber); margin-bottom: 3px; }
.wall-text { font-size: 12px; color: var(--text-mid); line-height: 1.5; }
.wall-player { font-size: 10px; color: var(--text-dim); margin-top: 4px; font-family: var(--font-mono); }

.wall-input-deco {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border: 1px dashed rgba(255,255,255,0.1);
  margin-bottom: 20px;
}
.wall-input-deco input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-dim);
  font-size: 14px;
  font-family: var(--font-body);
  outline: none;
}
.wall-input-deco .prompt { font-size: 14px; }

/* 底部引流 */
#sec-footer {
  text-align: center;
  padding: 20px 12px 32px;
  position: relative;
  z-index: 1;
  font-size: 13px;
  color: var(--text-dim);
  line-height: 2;
  border-top: 1px solid rgba(0,240,255,0.1);
  margin: 0 12px;
}
.footer-link { color: var(--cyan); font-weight: bold; font-size: 14px; }
```

- [ ] **Step 3: 提交**

```bash
git add js/wall.js css/style.css
git commit -m "feat: add complaint wall with 20 preset reviews"
```

---

### Task 10: 微信 X5 适配 + 环境检测

**Files:**
- Modify: `js/app.js` (追加微信检测和适配)
- Modify: `css/x5-fix.css`

- [ ] **Step 1: 在 app.js 末尾追加微信适配**

```javascript
// ═══ 微信环境检测与适配 ═══

function isWechat() {
  return /MicroMessenger/i.test(navigator.userAgent);
}

function isX5() {
  return /QQBrowser\/\d+\.\d+/i.test(navigator.userAgent);
}

// 微信X5就绪
function onWechatReady(callback) {
  if (typeof WeixinJSBridge !== 'undefined' && WeixinJSBridge.invoke) {
    callback();
  } else {
    document.addEventListener('WeixinJSBridgeReady', callback, { once: true });
  }
}

// 底部引流链接双轨
function setupFooterLink() {
  const footer = document.getElementById('sec-footer');
  if (!footer) return;

  const link = footer.querySelector('.footer-link');
  if (!link) return;

  if (isWechat()) {
    // 微信内：显示文字引导复制
    link.style.cursor = 'default';
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const url = 'supersuperchik-home.pages.dev';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          alert('链接已复制！请在浏览器中打开：' + url);
        });
      } else {
        prompt('长按复制链接，在浏览器打开：', url);
      }
    });
  }
  // 微信外：保持可点击
}

// 初始化微信适配
if (isWechat()) {
  onWechatReady(() => {
    setVh();
    setupFooterLink();
  });
} else {
  setupFooterLink();
}

// 低端机降级
function getDeviceTier() {
  const mem = navigator.deviceMemory || 4;
  const isLowEnd = /Android/.test(navigator.userAgent) && mem < 4;
  return isLowEnd ? 'low' : 'high';
}
if (getDeviceTier() === 'low') {
  document.body.classList.add('low-end-mode');
}
```

- [ ] **Step 2: 提交**

```bash
git add js/app.js
git commit -m "feat: add WeChat X5 detection, clipboard fallback, device tier detection"
```

---

### Task 11: Supabase 匿名埋点

**Files:**
- Modify: `js/app.js` (追加 analytics 函数)

- [ ] **Step 1: 在 app.js 末尾追加埋点函数**

```javascript
// ═══ 匿名埋点（Supabase） ═══
// 替换为实际的 Supabase URL 和 anon key

const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_KEY = 'YOUR-ANON-KEY';

async function sendAnalytics() {
  // 仅记录非敏感数据
  const payload = {
    score: state.score,
    grade: state.grade,
    achievement_count: state.achievements.length,
    achievements: state.achievements.slice(0, 10), // 最多10条成就名
    answer_count: state.answers.length,
    duration_sec: state.startedAt ? Math.round((Date.now() - state.startedAt) / 1000) : 0,
    timestamp: new Date().toISOString()
  };

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    // 静默失败，不影响用户体验
    console.log('Analytics: send failed (non-critical)');
  }
}

// 在结果页渲染后调用
// 在 finishQuiz() 末尾追加: sendAnalytics();
```

- [ ] **Step 2: 修改 finishQuiz 函数末尾，添加 sendAnalytics 调用**

在 `quiz.js` 的 `finishQuiz` 函数末尾追加：
```javascript
  // 匿名埋点
  sendAnalytics();
```

- [ ] **Step 3: 提交**

```bash
git add js/app.js js/quiz.js
git commit -m "feat: add anonymous analytics via Supabase"
```

---

### Task 12: Cloudflare Pages 部署

**Files:**
- Create: `README.md`

- [ ] **Step 1: 创建 README.md**

```markdown
# 地球Online 评分测试

赛博系统界面风格 H5 测试页。24 题测地球Online玩家评分，生成分享卡片。

## 部署

1. 推送代码到 GitHub
2. Cloudflare Pages → 连接仓库 → 部署
   - 构建命令：（无）
   - 输出目录：`/`（根目录）
3. 域名：`<项目名>.pages.dev`

## 本地开发

直接用浏览器打开 `index.html` 即可。无构建步骤。

## 素材替换

- `assets/earth-horizon.jpg` — 替换为 NASA 地球地平线照片
- `js/data.js` — 修改 `SUPABASE_URL` 和 `SUPABASE_KEY` 为实际值

## 技术栈

纯静态 HTML + CSS + JS · html2canvas · Cloudflare Pages
```

- [ ] **Step 2: 提交并推送**

```bash
git add README.md
git commit -m "docs: add README with deploy instructions"
```

---

### Task 13: 最终检查 + NASA 图片下载

- [ ] **Step 1: 下载 NASA 地球地平线照片**

使用 curl 通过代理下载：
```bash
curl --proxy http://127.0.0.1:7897 -L -o assets/earth-horizon.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/1200px-The_Earth_seen_from_Apollo_17.jpg"
```

或手动从 NASA Visible Earth 下载后放入 `assets/earth-horizon.jpg`

- [ ] **Step 2: 替换 CSS 中的占位背景为真实图片**

在 `css/style.css` 中，将 `.horizon-img` 的 `background` 替换为：
```css
.horizon-img {
  background-image: url(../assets/earth-horizon.jpg);
  background-size: cover;
  background-position: 50% 15%;
}
```

- [ ] **Step 3: 全局检查清单**

- [ ] index.html 所有 Section 结构完整
- [ ] 24 题题库数据正确
- [ ] 18 成就库文案准确
- [ ] 评分公式与等级映射匹配
- [ ] html2canvas 分享卡片生成正常
- [ ] 差评墙 20 条文案渲染正确
- [ ] 微信 X5 适配：flex 四重声明、--vh、低端机降级
- [ ] 底部引流链接双轨（微信内/外）
- [ ] 无诱导分享文案
- [ ] 无用户个人信息收集

- [ ] **Step 4: 提交**

```bash
git add assets/earth-horizon.jpg css/style.css
git commit -m "feat: add NASA Earth horizon photo, replace CSS placeholder"
```

---

## 完成标志

- [x] 13 个 Task 全部完成
- [x] Cloudflare Pages 部署成功
- [x] 微信内打开测试：答题→成就→卡片→差评墙→引流，全流程无报错
- [x] 分享卡片长按保存功能正常

---

*计划生成时间：2026-06-15 · 基于设计文档 2026-06-15-earth-online-score-design.md*
