// main.js（ESM形式）
import { getAuth, signInWithPopup, GithubAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { questions } from './test-data.js';  // 必要に応じて

const auth = getAuth();
const provider = new GithubAuthProvider();

let userEmail = "";
let currentQuestion = 0;
let score = 0;

document.getElementById('loginBtn').onclick = () => {
  signInWithPopup(auth, provider)
    .then(result => {
      const user = result.user;
      userEmail = user.email || "";
      document.getElementById('userInfo').textContent = `ようこそ、${user.displayName || user.email}さん！`;
      document.getElementById('loginBtn').style.display = "none";
      document.getElementById('logoutBtn').style.display = "inline-block";
      document.getElementById('quiz-area').style.display = "block";
      startQuiz();
    })
    .catch(error => {
      alert("ログインに失敗しました：" + error.message);
    });
};

document.getElementById('logoutBtn').onclick = () => {
  signOut(auth).then(() => {
    userEmail = "";
    document.getElementById('userInfo').textContent = "";
    document.getElementById('loginBtn').style.display = "inline-block";
    document.getElementById('logoutBtn').style.display = "none";
    document.getElementById('quiz-area').style.display = "none";
    document.getElementById('result-area').style.display = "none";
    currentQuestion = 0;
    score = 0;
  });
};

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  document.getElementById('result-area').style.display = "none";
  showQuestion();
}

function showQuestion() {
  if (currentQuestion >= questions.length) {
    showResult();
    return;
  }
  const q = questions[currentQuestion];
  document.getElementById('question-text').textContent = `Q${currentQuestion + 1}: ${q.question}`;
  const choicesDiv = document.getElementById('choices');
  choicesDiv.innerHTML = "";
  q.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = "choice";
    btn.textContent = choice;
    btn.onclick = () => {
      if (choice === q.answer) score++;
      currentQuestion++;
      showQuestion();
    };
    choicesDiv.appendChild(btn);
  });
}

function showResult() {
  document.getElementById('quiz-area').style.display = "none";
  document.getElementById('result-area').style.display = "block";
  document.getElementById('result-message').textContent =
    `あなたの正解数は ${score} / ${questions.length} 問です！`;
}

export function sendResultByEmail() {
  const result = document.getElementById('result-message').textContent;
  const subject = encodeURIComponent('定期テスト結果');
  const body = encodeURIComponent('あなたのテスト結果:\n\n' + result);
  window.location.href = `mailto:${userEmail}?subject=${subject}&body=${body}`;
}
