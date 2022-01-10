// -----------------------
// GLOBAL VARIABLES
// -----------------------
let main = document.querySelector('main');
let time = document.querySelector('.time');
let currentTime;

// -----------------------
// FUNCTIONS
// -----------------------
let startQuiz = function () {
  // Set the timer (add 1 second so the timer displays the actual start time)
  let timer = 61;

  // Update the count down every 1 second
  setInterval(function () {
    timer = timer - 1;
    time.textContent = timer;
  }, 1000);
};

// -----------------------
// EVENT HANDLERS
// -----------------------
document.querySelector('#start-quiz').addEventListener('click', startQuiz);
