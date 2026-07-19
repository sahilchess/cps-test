const clickBtn = document.getElementById('click-button');
const resetBtn = document.getElementById('reset-button');
const timerEl = document.getElementById('timer');
const clicksEl = document.getElementById('clicks');
const avgEl = document.getElementById('avg-cps');
const lifeClicksEl = document.getElementById('lifetime-clicks');
const lifeAvgEl = document.getElementById('lifetime-avg-cps');
const btn5 = document.getElementById('5-sec');
const btn10 = document.getElementById('10-sec');
const btn15 = document.getElementById('15-sec');

let duration = 10.0;
let timeLeft = duration;
let clicks = 0;
let interval = null;
let playing = false;
let gameOver = false;

// grab whatever was saved before, if nothing default to 0
let lifeClicks = parseInt(localStorage.getItem('cps_lifetime_clicks')) || 0;
let lifeGames = parseInt(localStorage.getItem('cps_lifetime_games')) || 0;

updateLifetimeDisplay();

clickBtn.addEventListener('click', () => {
  if (gameOver) return;
  if (!playing) startTimer();
  clicks++;
  clicksEl.textContent = clicks;
});

btn5.addEventListener('click', () => setDuration(5.0));
btn10.addEventListener('click', () => setDuration(10.0));
btn15.addEventListener('click', () => setDuration(15.0));
resetBtn.addEventListener('click', resetGame);

function setDuration(sec) {
  duration = sec;
  timeLeft = sec;
  timerEl.textContent = sec.toFixed(1);
}

function startTimer() {
  playing = true;
  clickBtn.textContent = "click as fast as you can!!!";
  resetBtn.style.display = "none";
  btn5.style.display = "none";
  btn10.style.display = "none";
  btn15.style.display = "none";

  interval = setInterval(() => {
    timeLeft = parseFloat((timeLeft - 0.1).toFixed(1));
    timerEl.textContent = timeLeft.toFixed(1);
    if (timeLeft <= 0) endGame();
  }, 100);
}

function endGame() {
  clearInterval(interval);
  playing = false;
  gameOver = true;
  clickBtn.disabled = true;
  clickBtn.textContent = "time's up, check your stats";
  resetBtn.style.display = "block";
  btn5.style.display = "block";
  btn10.style.display = "block";
  btn15.style.display = "block";

  const cps = clicks / duration;
  avgEl.textContent = cps.toFixed(2);

  lifeClicks += clicks;
  lifeGames += 1;
  localStorage.setItem('cps_lifetime_clicks', lifeClicks);
  localStorage.setItem('cps_lifetime_games', lifeGames);
  updateLifetimeDisplay();
}

function updateLifetimeDisplay() {
  lifeClicksEl.textContent = lifeClicks;
  if (lifeGames === 0) {
    lifeAvgEl.textContent = "0.00";
    return;
  }
  // not perfectly accurate since duration can change between games but close enough
  const totalSec = lifeGames * duration;
  lifeAvgEl.textContent = (lifeClicks / totalSec).toFixed(2);
}

function resetGame() {
  clearInterval(interval);
  timeLeft = duration;
  clicks = 0;
  playing = false;
  gameOver = false;
  timerEl.textContent = duration.toFixed(1);
  clicksEl.textContent = "0";
  avgEl.textContent = "0.00";
  clickBtn.disabled = false;
  clickBtn.textContent = "click me to start the timer!!";
}
