function saveTeams() {
  const team1 = document.getElementById('team1').value.trim();
  const team2 = document.getElementById('team2').value.trim();

  if (!team1 || !team2) {
    alert("يرجى إدخال أسماء الفريقين");
    return;
  }

  sessionStorage.setItem('team1', team1);
  sessionStorage.setItem('team2', team2);

  // الانتقال إلى صفحة اختيار الفئات
  window.location.href = "categories.html";
}
