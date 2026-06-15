// 评分计算

function calculateScore(answers, achievements) {
  var score = 50;
  var scoreMap = {
    '强制在线':1,'通勤耐力MAX':2,'外卖至尊VIP':1,'凌晨三点常驻者':-3,'空想行动派':-2,
    'NPC觉醒':-1,'经济断奶':6,'全款置业':8,'真心羁绊':5,'初心未改':5,
    '自律传说':5,'落日收藏家':4,'海外地图已扩展':3,'退游按钮不存在':2,
    'BUG共生体':2,'捏脸系统崩坏':2,'蚊子没削弱':2,'金币获取困难':-3
  };
  achievements.forEach(function(key) {
    if (scoreMap[key]) score += scoreMap[key];
  });
  score = Math.max(35, Math.min(88, score));
  var grade = 'D';
  if (score >= 78) grade = 'S';
  else if (score >= 68) grade = 'A';
  else if (score >= 58) grade = 'B';
  else if (score >= 48) grade = 'C';
  return { score: score, grade: grade };
}

function getGradeInfo(grade) {
  return GRADE_MAP[grade];
}
