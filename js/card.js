// 分享卡片生成

async function generateShareCard() {
  // 检查 html2canvas 是否加载
  if (typeof html2canvas === 'undefined') {
    alert('html2canvas 未加载，请检查网络连接后刷新页面');
    return;
  }

  var card = document.getElementById('result-card');
  var overlay = document.getElementById('share-overlay');
  var imgEl = document.getElementById('share-img');

  // 生成前：给卡片设固定宽度，确保截图完整
  var origWidth = card.style.width;
  card.style.width = '100%';

  try {
    var canvas = await html2canvas(card, {
      scale: 2,
      backgroundColor: '#060d14',
      allowTaint: true,
      useCORS: true,
      logging: true
    });
    imgEl.src = canvas.toDataURL('image/png');
    overlay.classList.remove('hidden');
  } catch (err) {
    console.error('卡片生成失败:', err);
    alert('卡片生成失败: ' + err.message + '\n请刷新页面后重试');
  }

  card.style.width = origWidth;
}
