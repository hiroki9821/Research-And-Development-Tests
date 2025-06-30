let userEmail = "";

// Firebase Authのインスタンス取得
const auth = firebase.auth();
const provider = new firebase.auth.GithubAuthProvider();

// クイズ用グローバル変数
let currentQuestion = 0;
let score = 0;

// ログインボタン
document.getElementById('loginBtn').onclick = () => {
  auth.signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      userEmail = user.email || "";
      document.getElementById('userInfo').textContent = `ようこそ、${user.displayName || user.email}さん！`;
      document.getElementById('loginBtn').style.display = "none";
      document.getElementById('logoutBtn').style.display = "inline-block";
      document.getElementById('quiz-area').style.display = "block";
      startQuiz(); // ログイン時にクイズ開始
    })
    .catch(error => {
      alert("ログインに失敗しました：" + error.message);
    });
};

// ログアウトボタン
document.getElementById('logoutBtn').onclick = () => {
  auth.signOut().then(() => {
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

// クイズ開始
function startQuiz() {
  currentQuestion = 0;
  score = 0;
  document.getElementById('result-area').style.display = "none";
  showQuestion();
}

// 問題表示
function showQuestion() {
  if (currentQuestion >= questions.length) {
    showResult();
    return;
  }
  const q = questions[currentQuestion];
  document.getElementById('question-text').textContent = `Q${currentQuestion + 1}: ${q.question}`;
  const choicesDiv = document.getElementById('choices');
  choicesDiv.innerHTML = "";
  q.choices.forEach((choice, idx) => {
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

// 結果表示
function showResult() {
  document.getElementById('quiz-area').style.display = "none";
  document.getElementById('result-area').style.display = "block";
  document.getElementById('result-message').textContent =
    `あなたの正解数は ${score} / ${questions.length} 問です！`;
}

// メール送信ボタン（index.htmlのscript部と重複しないよう注意）
window.sendResultByEmail = function() {
  const result = document.getElementById('result-message').textContent;
  const subject = encodeURIComponent('定期テスト結果');
  const body = encodeURIComponent('あなたのテスト結果:\n\n' + result);
  window.location.href = `mailto:${userEmail}?subject=${subject}&body=${body}`;
};
