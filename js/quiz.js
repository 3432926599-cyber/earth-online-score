// 答题逻辑 — 杂志拼贴风

var MODULE_ICONS = {
  '身份确认': '🎮',
  '日常生存': '🏃',
  '经济扫描': '💰',
  '社交羁绊': '💎',
  '隐藏属性': '🌟',
  '终章审判': '🎯'
};

function renderQuestion(index) {
  if (index >= QUESTIONS.length) { finishQuiz(); return; }
  state.currentQuestion = index;
  var q = QUESTIONS[index];
  var body = document.getElementById('quiz-body');
  var counterEl = document.getElementById('quiz-counter');
  var progressEl = document.getElementById('quiz-progress');
  var moduleEl = document.getElementById('quiz-module');

  counterEl.textContent = 'Q' + (index + 1) + '/24';
  progressEl.style.width = (index / QUESTIONS.length * 100) + '%';
  moduleEl.textContent = q.module;

  var icon = MODULE_ICONS[q.module] || '📋';

  body.innerHTML =
    '<div class="quiz-question-card">' +
      '<span class="quiz-q-icon">' + icon + '</span>' +
      '<div class="quiz-q-text">' + q.question + '</div>' +
    '</div>' +
    '<div class="quiz-pills">' +
      q.options.map(function(opt, i) {
        var label = String.fromCharCode(65 + i);
        return '<button class="quiz-pill" data-index="' + i + '">' +
          '<span class="pill-label">' + label + '</span>' +
          '<span>' + opt.text + '</span>' +
        '</button>';
      }).join('') +
    '</div>';

  body.querySelectorAll('.quiz-pill').forEach(function(btn) {
    btn.addEventListener('click', function() {
      this.classList.add('selected');
      setTimeout(function() {
        selectOption(q, parseInt(btn.dataset.index));
      }, 250);
    });
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectOption(question, optIndex) {
  var selected = question.options[optIndex];
  state.answers.push({ questionId: question.id, optionIndex: optIndex });

  if (selected.achievements.length > 0) {
    selected.achievements.forEach(function(key) { checkAchievement(key); });
  }

  setTimeout(function() { renderQuestion(state.currentQuestion + 1); }, 300);
}

function finishQuiz() {
  window._quizDone();
}
