// 成就检测与弹出 — 屏幕中央弹出

function checkAchievement(key) {
  if (state.achievements.indexOf(key) !== -1) return;
  state.achievements.push(key);
  var ach = ACHIEVEMENTS[key];
  if (!ach) return;
  showAchievementPopup(ach);
}

function showAchievementPopup(ach) {
  var overlay = document.createElement('div');
  overlay.className = 'ach-popup-overlay';

  var rarityLabel = {S:'传说',A:'稀有',B:'少见',C:'常见',D:'反向成就'};
  var rarityColor = {S:'#d4893b',A:'#c0392b',B:'#2c3e3a',C:'#889',D:'#e74c3c'};
  var rc = rarityColor[ach.rarity] || '#2c3e3a';
  var rl = rarityLabel[ach.rarity] || '';

  overlay.innerHTML =
    '<div class="ach-popup-card">' +
      '<div class="ach-popup-badge" style="background:'+rc+';">🏆</div>' +
      '<div class="ach-popup-tag" style="color:'+rc+';">成就解锁 · '+rl+'</div>' +
      '<div class="ach-popup-icon">'+ach.icon+'</div>' +
      '<div class="ach-popup-name">'+ach.name+'</div>' +
      '<div class="ach-popup-desc">'+ach.desc.slice(0,40)+'…</div>' +
    '</div>';

  document.body.appendChild(overlay);

  // 入场动画
  requestAnimationFrame(function() {
    overlay.classList.add('show');
  });

  // 2.5秒后自动消失
  setTimeout(function() {
    overlay.classList.remove('show');
    setTimeout(function() { overlay.remove(); }, 300);
  }, 2500);

  // 点击任意位置关闭
  overlay.addEventListener('click', function() {
    overlay.classList.remove('show');
    setTimeout(function() { overlay.remove(); }, 300);
  });
}
