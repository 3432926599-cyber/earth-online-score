// 地球Online — 主控制器

function setVh() { document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px'); }
setVh();
window.addEventListener('resize', function() { requestAnimationFrame(setVh); });

var state = {
  currentSection: 'sec-landing', currentQuestion: 0,
  answers: [], achievements: [], score: 0, grade: '', startedAt: null, starRating: 0
};

function showSection(id) {
  document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
  var t = document.getElementById(id);
  if (t) { t.classList.add('active'); state.currentSection = id; window.scrollTo(0, 0); }
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btn-start').addEventListener('click', function() {
    state.startedAt = Date.now(); showSection('sec-quiz'); renderQuestion(0);
  });
  document.getElementById('btn-share').addEventListener('click', generateShareCard);
  document.getElementById('btn-wall').addEventListener('click', function() { showSection('sec-wall'); renderWall(); });
  document.getElementById('btn-close-share').addEventListener('click', function() {
    document.getElementById('share-overlay').classList.add('hidden');
  });
  if (navigator.deviceMemory && navigator.deviceMemory < 4) document.body.classList.add('low-end-mode');
  setupWechat();
});

// ═══ 星级评价弹窗 ═══
function showStarRating(callback) {
  var ex = document.querySelector('.star-overlay'); if (ex) ex.remove();
  var overlay = document.createElement('div'); overlay.className = 'star-overlay';
  var tags = ['蚊子太强','金币难赚','没捏脸','退不了游','建模漏洞','睡眠Bug','氪金太多','版本差异'];
  overlay.innerHTML =
    '<div class="star-card">' +
      '<div class="star-card-title">给地球Online打个分吧</div>' +
      '<div class="star-card-sub">80亿玩家 · 差评如潮 · 但还在玩</div>' +
      '<div class="star-tagline-row">' + tags.map(function(t){return '<span class="star-tag">'+t+'</span>';}).join('') + '</div>' +
      '<div class="star-row" id="star-row"></div>' +
      '<div class="star-label" id="star-label"></div>' +
      '<button class="star-submit" id="star-submit">提交评分 →</button>' +
      '<button class="star-skip" id="star-skip">跳过</button></div>';
  document.body.appendChild(overlay);
  var rating = 0;
  var labels = ['垃圾游戏！','差点意思','凑合能玩','还不错','真爱无疑！'];
  (function rs(r){
    var sr = overlay.querySelector('#star-row'); sr.innerHTML = '';
    for (var i=1;i<=5;i++) {
      var b = document.createElement('button'); b.className = 'star-btn' + (i<=r?' active':'');
      b.textContent = i<=r?'★':'☆';
      b.addEventListener('click',(function(v){return function(){rating=v;rs(rating);overlay.querySelector('#star-label').textContent=labels[v-1]||'';};})(i));
      sr.appendChild(b);
    }
  })(0);
  overlay.querySelectorAll('.star-tag').forEach(function(t){t.addEventListener('click',function(){this.classList.toggle('active');});});
  overlay.querySelector('#star-submit').addEventListener('click',function(){state.starRating=rating;overlay.remove();callback();});
  overlay.querySelector('#star-skip').addEventListener('click',function(){state.starRating=0;overlay.remove();callback();});
}

// ═══ 结果页渲染 — 杂志拼贴风 ═══
function renderResult() {
  var gi = getGradeInfo(state.grade);
  var card = document.getElementById('result-card');
  var sorted = getAchievementsSorted(state.achievements);
  var top3 = sorted.slice(0,3);
  var defaults = ['退游按钮不存在','捏脸系统崩坏','蚊子没削弱'];
  for (var d=0;d<defaults.length&&top3.length<3;d++) { if (top3.indexOf(defaults[d])===-1) top3.push(defaults[d]); }

  var rarityColor = {S:'#d4893b',A:'#c0392b',B:'#2c3e3a',C:'#889',D:'#e74c3c'};
  var rarityLabel = {S:'传说',A:'稀有',B:'少见',C:'常见',D:'反向成就'};
  var gradeEmoji = {S:'👑',A:'⭐',B:'🎮',C:'🫡',D:'🩹'};

  var achHTML = top3.map(function(k,i){
    var a = ACHIEVEMENTS[k]; if(!a) return '';
    var rc = rarityColor[a.rarity]||'#2c3e3a';
    return '<div class="res-ach-item" style="border-left:3px solid '+rc+';">'+
      '<div class="res-ach-top">'+
        '<span class="res-ach-icon">'+a.icon+'</span>'+
        '<span class="res-ach-name">'+a.name+'</span>'+
        '<span class="res-ach-rank">第'+a.rank+'名</span>'+
      '</div>'+
      '<div class="res-ach-desc">'+a.desc+'</div>'+
    '</div>';
  }).join('');

  var hiddenCount = Math.max(0, sorted.length - 3);

  card.innerHTML =
    // ═══ 背景纹理层 ═══
    '<div class="res-container">'+

      // 纹理：网格点
      '<div class="res-texture-dots"></div>'+
      // 纹理：弱渐变
      '<div class="res-texture-grad"></div>'+

      // ═══ 顶部：拍立得风格地球 ═══
      '<div class="res-polaroid-row">'+
        '<div class="res-polaroid-small">'+
          '<div class="res-polaroid-img"></div>'+
          '<div class="res-polaroid-label">EARTH ONLINE · REPORT</div>'+
        '</div>'+
        '<div class="res-stamp-red">TOP<br>SECRET</div>'+
      '</div>'+

      // ═══ 标题 ═══
      '<div class="res-title-area">'+
        '<h1 class="res-title">你在地球<span class="res-title-red">Online</span></h1>'+
        '<p class="res-subtitle">的玩家评估报告</p>'+
        '<div class="res-divider"></div>'+
      '</div>'+

      // ═══ 评分卡 ═══
      '<div class="res-score-card">'+
        '<div class="res-score-emoji">'+ (gradeEmoji[state.grade]||'🫡') +'</div>'+
        '<div class="res-score-label">您的地球Online 系统评分是</div>'+
        '<div class="res-score-big">'+
          '<span class="res-score-letter">'+state.grade+'</span>'+
          '<span class="res-score-plus">+</span>'+
        '</div>'+
        '<div class="res-score-num">'+state.score+' 分</div>'+
        '<div class="res-score-tagline">「'+gi.msg+'」</div>'+
      '</div>'+

      // ═══ 成就TOP3 ═══
      '<div class="res-ach-section">'+
        '<div class="res-ach-title">'+
          '<span class="res-ach-star">★</span> 我的成就 · TOP 3 <span class="res-ach-star">★</span>'+
        '</div>'+
        achHTML +
        (hiddenCount>0 ? '<div class="res-ach-more">扫码查看完整报告中的 '+hiddenCount+' 项隐藏成就 →</div>' : '')+
      '</div>'+

      // ═══ DEBUFF ═══
      '<div class="res-debuff-row">'+
        '<span class="res-debuff">⚠ 睡眠副本排队失败</span>'+
        '<span class="res-debuff">⚠ 金币余额接近零点</span>'+
      '</div>'+

      // 胶带
      '<div class="res-tape-strip">'+
        '<span class="res-tape res-tape-1"></span>'+
        '<span class="res-tape res-tape-2"></span>'+
      '</div>'+
    '</div>';
}

window._quizDone = function() {
  var result = calculateScore(state.answers, state.achievements);
  state.score = result.score; state.grade = result.grade;
  showStarRating(function() { renderResult(); showSection('sec-result'); sendAnalytics(); });
};

// ═══ 微信 ═══
function setupWechat() {
  var isWx = /MicroMessenger/i.test(navigator.userAgent);
  var footer = document.getElementById('sec-footer'); if(!footer) return;
  var link = footer.querySelector('.footer-link'); if(!link) return;
  if(isWx){link.style.cursor='default';link.style.textDecoration='underline';link.addEventListener('click',function(e){e.preventDefault();var u='supersuperchik-home.pages.dev';if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(u).then(function(){alert('链接已复制！浏览器打开：'+u);}).catch(function(){prompt('长按复制，浏览器打开：',u);});}else{prompt('长按复制，浏览器打开：',u);}});}
}

// ═══ 埋点 ═══
var SUPABASE_URL='https://YOUR-PROJECT.supabase.co',SUPABASE_KEY='YOUR-ANON-KEY';
async function sendAnalytics(){var p={score:state.score,grade:state.grade,achievement_count:state.achievements.length,achievements:state.achievements.slice(0,10),answer_count:state.answers.length,star_rating:state.starRating,duration_sec:state.startedAt?Math.round((Date.now()-state.startedAt)/1000):0,timestamp:new Date().toISOString()};try{await fetch(SUPABASE_URL+'/rest/v1/scores',{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(p)});}catch(e){}}
