// 成就检测与弹出

function checkAchievement(key) {
  if (state.achievements.indexOf(key) !== -1) return;
  state.achievements.push(key);
  var ach = ACHIEVEMENTS[key];
  if (!ach) return;
  showToast(ach);
}

function showToast(ach) {
  var container = document.getElementById('toast-container');
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML =
    '<div class="toast-icon">' + ach.icon + '</div>' +
    '<div class="toast-body">' +
      '<div class="toast-tag">🏆 成就解锁</div>' +
      '<div class="toast-name">' + ach.name + '</div>' +
    '</div>';
  container.appendChild(toast);
  requestAnimationFrame(function() { toast.classList.add('show'); });
  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { toast.remove(); }, 400);
  }, 3500);
}
