// 分享卡片生成

// 预加载QR码为data URL（避免html2canvas CORS问题）
var qrDataUrl = '';
function preloadQR() {
  return new Promise(function(resolve) {
    if (qrDataUrl) { resolve(qrDataUrl); return; }
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      var c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      c.getContext('2d').drawImage(img, 0, 0);
      qrDataUrl = c.toDataURL('image/png');
      resolve(qrDataUrl);
    };
    img.onerror = function() {
      qrDataUrl = '';
      resolve('');
    };
    img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://earth-online-score.pages.dev';
  });
}

async function generateShareCard() {
  if (typeof html2canvas === 'undefined') {
    alert('html2canvas 未加载，请检查网络连接后刷新页面');
    return;
  }

  var card = document.getElementById('result-card');
  var overlay = document.getElementById('share-overlay');
  var imgEl = document.getElementById('share-img');

  // 确保QR码以data URL形式加载（避免CORS空白）
  var qrImg = card.querySelector('.res-qr-img');
  if (qrImg) {
    qrImg.src = await preloadQR() || qrImg.src;
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
