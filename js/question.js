// question.js (مُدمج ومُحسن)

const team1 = sessionStorage.getItem('team1') || 'الفريق 1';
const team2 = sessionStorage.getItem('team2') || 'الفريق 2';
let score1 = parseInt(sessionStorage.getItem('score1') || '0');
let score2 = parseInt(sessionStorage.getItem('score2') || '0');
let currentTeam = parseInt(sessionStorage.getItem('currentTeam') || 1);

document.getElementById('btnTeam1').textContent = team1;
document.getElementById('btnTeam2').textContent = team2;

document.getElementById('questionText').textContent = '';
document.getElementById('answerText').textContent = '';
document.getElementById('questionImage').style.display = 'none';

let timer = 0;
let running = true;

function updateTimer() {
  if (!running) return;
  timer++;
  const min = String(Math.floor(timer / 60)).padStart(2, '0');
  const sec = String(timer % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${min}:${sec}`;
}

setInterval(updateTimer, 1000);

// تحميل السؤال
const questionId = localStorage.getItem('currentQuestionId');

if (!questionId) {
  alert('حدث خطأ: لم يتم تحديد السؤال.');
  window.location.href = 'game.html';
}

fetch('data/questions.json')
  .then(res => res.json())
  .then(data => {
    const question = data.find(q => q.id === questionId);
    if (!question) {
      alert('السؤال غير موجود');
      window.location.href = 'game.html';
      return;
    }

    // عرض محتوى السؤال
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('answerText').textContent = question.answer || 'لا توجد إجابة متاحة';

    if (question.image) {
      const img = document.getElementById('questionImage');
      img.src = question.image;
      img.style.display = 'block';
    }

    // حفظ السؤال للرجوع منه لاحقًا
    window.currentQuestion = question;
  });

// عرض الإجابة
function showAnswer() {
  document.getElementById('answerModal').style.display = 'flex';
}

// إغلاق نافذة الإجابة
function closeModal() {
  document.getElementById('answerModal').style.display = 'none';
}

// احتساب النقاط بعد اختيار الفريق الفائز
function awardPoints(winnerTeam) {
  if (!window.currentQuestion) return;

  if (winnerTeam === 1) score1 += currentQuestion.points;
  else if (winnerTeam === 2) score2 += currentQuestion.points;

  sessionStorage.setItem('score1', score1);
  sessionStorage.setItem('score2', score2);

  // حفظ السؤال كـ "تمت الإجابة عليه"
  const answered = JSON.parse(localStorage.getItem('answeredQuestions')) || [];
  if (!answered.includes(currentQuestion.id)) {
    answered.push(currentQuestion.id);
    localStorage.setItem('answeredQuestions', JSON.stringify(answered));
  }

  // تبديل الفريق
  currentTeam = currentTeam === 1 ? 2 : 1;
  sessionStorage.setItem('currentTeam', currentTeam);

  window.location.href = 'game.html';
}
