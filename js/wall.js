// 差评墙

function renderWall() {
  var grid = document.getElementById('wall-grid');
  if (!grid) return;
  grid.innerHTML = WALL_REVIEWS.map(function(r) {
    return '<div class="wall-mag-card">' +
      '<div class="wall-mag-stars">' + '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars) + '</div>' +
      '<div class="wall-mag-text">' + r.text + '</div>' +
      '<div class="wall-mag-player">— 玩家' + r.player + '</div>' +
    '</div>';
  }).join('');
}
