// main.js
let userEmail = "";

// Firebase Authのインスタンス取得
const auth = firebase.auth();
const provider = new firebase.auth.GithubAuthProvider();

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
  });
};
