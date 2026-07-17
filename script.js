const click_button = document.getElementById('click-button');
const reset_button = document.getElementById('reset-button');
const timer_span = document.getElementById('timer');
const clicks_span = document.getElementById('clicks');
const avg_cps_span = document.getElementById('avg-cps');
const lifetime_clicks_span = document.getElementById('lifetime-clicks');
const lifetime_avg_cps_span = document.getElementById('lifetime-avg-cps');
const five_sec = document.getElementById('5-sec');
const ten_sec = document.getElementById('10-sec');
const fifteen_sec = document.getElementById('15-sec');

let game_duration = 10.0;
let time_left = game_duration;
let clicks_count = 0;
let timer_interval = null;
let is_playing = false;
let is_game_over = false;

const timer_step = 0.1;

let lifetime_clicks = parseInt(localStorage.getItem('cps_lifetime_clicks')) || 0;
let lifetime_games = parseInt(localStorage.getItem('cps_lifetime_games')) || 0;

update_lifetime_stats_display();

click_button.addEventListener('click', () => {
  if (is_game_over) return;
  if (!is_playing) start_timer();

  clicks_count++;
  clicks_span.textContent = clicks_count;
});

five_sec.addEventListener('click', () => set_duration(5.0));
ten_sec.addEventListener('click', () => set_duration(10.0));
fifteen_sec.addEventListener('click', () => set_duration(15.0));

function set_duration(seconds) {
  game_duration = seconds;
  time_left = game_duration;
  timer_span.textContent = game_duration.toFixed(1);
}

reset_button.addEventListener('click', reset_game);

function start_timer() {
  is_playing = true;
  click_button.textContent = "click as fast as you can!!!";
  reset_button.style.display = "none";
  five_sec.style.display = "none";
  ten_sec.style.display = "none";
  fifteen_sec.style.display = "none";

  timer_interval = setInterval(() => {
    time_left = parseFloat((time_left - timer_step).toFixed(1));
    timer_span.textContent = time_left.toFixed(1);

    if (time_left <= 0.0) end_game();
  }, 1000 * timer_step);
}

function end_game() {
  clearInterval(timer_interval);
  is_playing = false;
  is_game_over = true;
  click_button.disabled = true;
  click_button.textContent = "time's up, check your stats";
  reset_button.style.display = "block";
  five_sec.style.display = "block";
  ten_sec.style.display = "block";
  fifteen_sec.style.display = "block";

  const final_cps = clicks_count / game_duration;
  avg_cps_span.textContent = final_cps.toFixed(2);

  lifetime_clicks += clicks_count;
  lifetime_games += 1;

  localStorage.setItem('cps_lifetime_clicks', lifetime_clicks);
  localStorage.setItem('cps_lifetime_games', lifetime_games);

  update_lifetime_stats_display();
}

function update_lifetime_stats_display() {
  lifetime_clicks_span.textContent = lifetime_clicks;

  if (lifetime_games === 0) {
    lifetime_avg_cps_span.textContent = "0.00";
    return;
  }

  const total_active_seconds = lifetime_games * game_duration;
  const overall_avg = lifetime_clicks / total_active_seconds;
  lifetime_avg_cps_span.textContent = overall_avg.toFixed(2);
}

function reset_game() {
  clearInterval(timer_interval);

  time_left = game_duration;
  clicks_count = 0;
  is_playing = false;
  is_game_over = false;

  timer_span.textContent = game_duration.toFixed(1);
  clicks_span.textContent = "0";
  avg_cps_span.textContent = "0.00";
  click_button.disabled = false;
  click_button.textContent = "click me to start the timer!!";
}