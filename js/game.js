// game.js

const team1 = sessionStorage.getItem('team1') || 'الفريق 1';
const team2 = sessionStorage.getItem('team2') || 'الفريق 2';
let score1 = parseInt(sessionStorage.getItem('score1') || 0);
let score2 = parseInt(sessionStorage.getItem('score2') || 0);
let currentTeam = parseInt(sessionStorage.getItem('currentTeam') || 1);

document.getElementById('team1Name').textContent = team1;
document.getElementById('team2Name').textContent = team2;
document.getElementById('score1').textContent = score1;
document.getElementById('score2').textContent = score2;
document.getElementById('turnTeam').textContent = currentTeam === 1 ? team1 : team2;

const answeredIds = JSON.parse(localStorage.getItem('answeredQuestions')) || [];
const gameBoard = document.getElementById('gameBoard');

let questionsData = [];
const selectedCategories = JSON.parse(sessionStorage.getItem('categories')) || [];

fetch('data/questions.json')
  .then(res => res.json())
  .then(data => {
    questionsData = Array.isArray(data) ? data : []; // مصفوفة فقط
    if (selectedCategories.length > 0) {
      questionsData = questionsData.filter(q => selectedCategories.includes(q.categoryId));
    }
    renderCategories();

    // التحقق من انتهاء اللعبة
    const totalQuestions = questionsData.length;
    if (answeredIds.length >= totalQuestions) {
      setTimeout(() => {
        let message = '';
        if (score1 > score2) {
          message = `🎉 ${team1} فاز بـ ${score1} نقطة!`;
        } else if (score2 > score1) {
          message = `🎉 ${team2} فاز بـ ${score2} نقطة!`;
        } else {
          message = `🤝 تعادل الفريقين! النقاط: ${score1}`;
        }

        showEndGameMessage(message);
        sessionStorage.clear();
        localStorage.clear();
      }, 500);
    }
  });

function renderCategories() {
  const categories = [...new Set(questionsData.map(q => q.categoryId))];
  gameBoard.innerHTML = '';

  categories.forEach(catId => {
    const catDiv = document.createElement('div');
    catDiv.className = 'category';

    const title = document.createElement('h2');
    title.textContent = catId;
    catDiv.appendChild(title);

    [100, 300, 500].forEach(points => {
      const questionsInLevel = questionsData.filter(q => q.categoryId === catId && q.points === points);
      if (questionsInLevel.length === 0) return;

      const randomQ = getRandomUnanswered(questionsInLevel);

      const btn = document.createElement('button');
      btn.textContent = `${points} نقطة`;
      btn.disabled = answeredIds.includes(randomQ.id);
      btn.style.opacity = btn.disabled ? 0.5 : 1;
      btn.style.cursor = btn.disabled ? 'not-allowed' : 'pointer';

      btn.onclick = () => {
        if (btn.disabled) return;
        sessionStorage.setItem('selectedQuestion', JSON.stringify(randomQ));
        sessionStorage.setItem('currentTeam', currentTeam);
        localStorage.setItem('currentQuestionId', randomQ.id);
        window.location.href = 'question.html';
      };

      catDiv.appendChild(btn);
    });

    gameBoard.appendChild(catDiv);
  });
}

function getRandomUnanswered(questions) {
  const unanswered = questions.filter(q => !answeredIds.includes(q.id));
  if (unanswered.length > 0) {
    return unanswered[Math.floor(Math.random() * unanswered.length)];
  } else {
    return questions[Math.floor(Math.random() * questions.length)];
  }
}

function showEndGameMessage(message) {
  const modal = document.getElementById('endGameModal');
  const msgEl = document.getElementById('endGameMessage');
  const restartBtn = document.getElementById('restartBtn');

  msgEl.textContent = message;
  modal.style.display = 'flex';

  restartBtn.onclick = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = 'index.html';
  };
}
