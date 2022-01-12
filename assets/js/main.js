// -----------------------
// GLOBAL VARIABLES
// -----------------------
const main = document.querySelector('.content');
const time = document.querySelector('.time');
const modal = document.querySelector('.modal');
const questions = [
  {
    question: 'The variable keyword ______ cannot have its value redefined.',
    options: ['let', 'const', 'var'],
    answer: 'const',
  },
  {
    question: 'Inside which HTML element do we put the JavaScript?',
    options: ['<link>', '<script>', '<javascript>', '<js>'],
    answer: '<script>',
  },
  {
    question: 'Where is the correct place to insert a JavaScript?',
    options: [
      'The <head> section.',
      'The <body> section.',
      'Both the <head> section and the <body> section are correct.',
    ],
    answer: 'Both the <head> section and the <body> section are correct.',
  },
  {
    question: 'The external JavaScript file must contain the \<script\> tag.',
    options: ['true', 'false'],
    answer: 'true',
  },
  {
    question: 'How do you call a function named "myFunction"?',
    options: ['myFunction()', 'call myFunction()', 'hey myFunction()'],
    answer: 'myFunction()',
  },
];
let currentTime = 0;
let hiScore;
let availableQuestions = [...new Array(questions.length).keys()];
let highScores = [];

// -----------------------
// FUNCTIONS
// -----------------------
const startQuiz = function () {
  // Set the timer (add 1 second so the timer displays the actual start time)
  currentTime = 60;
  // Update the count down every 1 second
  setInterval(function () {
    currentTime = Math.max(0, currentTime - 1);
    time.textContent = currentTime;
  }, 1000);

  showQuestion();
};

const showQuestion = function () {
  // If there's still time on the clock and questions available to be answered
  if (parseInt(currentTime) > 0 && availableQuestions.length > 0) {
    // Get a random question from the available questions
    let num = Math.floor(Math.random() * availableQuestions.length);
    // Get the question from the questions object that matches the question number
    // from the available pool
    let currQ = questions[availableQuestions[num]];

    // Display the question in the main element
    main.innerHTML = `
  <h1>${currQ.question}</h1>
  `;
    for (let i = 0; i < currQ.options.length; i++) {
      let btn = document.createElement('button');
      btn.setAttribute('data-key', num);
      btn.textContent = i + 1 + '. ' + currQ.options[i];
      btn.className = 'questionBtn';
      btn.addEventListener('click', answerHandler);
      main.appendChild(btn);
    }
    // Remove the question from the available pool so we don't get it again
    availableQuestions.splice(availableQuestions.indexOf(num), 1);
  } else {
    // We're either out of time or questions, end the game
    return endGame();
  }
};

const answerHandler = function (event) {
  // Get the question key
  let key = event.target.dataset['key'];
  // Get the answer text from the button
  let answer = event.target.textContent
    .substring(event.target.textContent.indexOf('. ') + 1)
    .trim();
  // Create the Correct / Wrong answer div
  let response = document.createElement('div');
  response.className = 'response';

  if (answer == questions[key].answer) {
    // If the button matches the answer on the question object
    // it's correct
    response.textContent = 'Correct!';
  } else {
    // The answer was wrong, deduct 10s from the timer
    response.textContent = 'Wrong!';
    currentTime = Math.max(currentTime - 10, 0);
    time.textContent = currentTime;
  }

  // Set the response answer div to go away after being
  // shown for 2 seconds
  setTimeout(() => {
    response.remove();
  }, 2000);

  // Show the next question
  showQuestion();

  // Append the response to the content page, it will
  // display under the current question's answer buttons
  main.appendChild(response);
};

const endGame = function () {
  if (currentTime === 0) {
    // The player lost, the timer has run out
    alert("Time's up!");
  } else {
    // The player won, they answered all questions with
    // time left on the timer
    alert('You won!');

    // Record the current timer value as the high score
    hiScore = currentTime;

    // Set the timer to 0 so it stops counting down
    currentTime = 0;
  }

  // Display the user's high score and form to save the score
  main.innerHTML = `
  <h1>All done!</h2>
  <p>Your final score is ${hiScore}.</p>
  <form>
  <label for="initials">Enter initials:</label>
  <input name="initials" id="initials" type="text" />
  <button type="submit" id="submit">Submit</button>
  </form>
  `;
  document.querySelector('form').addEventListener('submit', saveHiScore);
};

const saveHiScore = function (event) {
  event.preventDefault();
  // Save current score to the highScores array
  highScores.push({ initials: event.target[0].value, score: hiScore });
  // Save the highScores array to localStorage
  localStorage.setItem('highScores', JSON.stringify(highScores));
  // Reset the form and disable the submit button so the same score
  // can't be submitted multiple times
  event.target.reset();
  document.querySelector('#submit').disabled = true;

  // Re-load the high scores
  loadHighScores();
};

const loadHighScores = function () {
  let savedScores = localStorage.getItem('highScores');
  // If the high scores value is empty, do nothing
  // or load in the high scores from localStorage
  if (!savedScores) {
    highScores = [];
  } else {
    highScores = JSON.parse(savedScores);
  }

  let table = document.querySelector('tbody');
  let row;
  for (let i = 0; i < highScores.length; i++) {
    // Create a row
    row = document.createElement('tr');
    row.className = 'score';
    // Create columns with Rank (array index),
    // initials, and the score
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${highScores[i].initials}</td>
      <td>${highScores[i].score}</td>
    `;
    // Add the row to the table
    table.appendChild(row);
  }
};

const showModal = function () {
  modal.style.display = 'block';
};

const handleModalClick = function (event) {
  let target = event.target;
  switch (target.className) {
    case 'close-modal':
      modal.style.display = 'none';
      break;
    case 'clear-scores':
      // When the Clear High Scores button is clicked,
      // reset the highScores array and localStorage
      highScores = [];
      localStorage.setItem('highScores', highScores);

      // Select all of the table rows with the score class
      let scores = document.querySelectorAll('.score');

      // Loop through the scores and delete them from the DOM
      scores.forEach((score) => score.remove());

      // Rebuild the high scores table
      loadHighScores();
      break;
  }
};

// -----------------------
// EVENT HANDLERS
// -----------------------
document.querySelector('#start-quiz').addEventListener('click', startQuiz);
document.querySelector('.view-hi-score').addEventListener('click', showModal);
modal.addEventListener('click', handleModalClick);

loadHighScores();
