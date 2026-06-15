// 分享卡片生成

async function generateShareCard() {
  if (typeof html2canvas === 'undefined') {
    alert('html2canvas 未加载，请检查网络连接后刷新页面');
    return;
  }

  var card = document.getElementById('result-card');
  var overlay = document.getElementById('share-overlay');
  var imgEl = document.getElementById('share-img');

  // 等待QR码图片加载完成
  var qrImg = card.querySelector('.res-qr-img');
  if (qrImg && !qrImg.complete) {
    await new Promise(function(resolve) {
      qrImg.onload = resolve; qrImg.onerror = resolve;
      setTimeout(resolve, 3000);
    });
  }

  try {
    var canvas = await html2canvas(card, {
      scale: 2, backgroundColor: '#faf8f5', allowTaint: true, useCORS: true, logging: false
    });
    imgEl.src = canvas.toDataURL('image/jpeg', 0.85);
    overlay.classList.remove('hidden');
  } catch (err) {
    console.error('卡片生成失败:', err);
    alert('卡片生成失败: ' + err.message + '\n请刷新页面后重试');
  }
}
