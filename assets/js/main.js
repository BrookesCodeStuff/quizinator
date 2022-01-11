// -----------------------
// GLOBAL VARIABLES
// -----------------------
const main = document.querySelector('.content');
const time = document.querySelector('.time');
const modal = document.querySelector('.modal');
const questions = [
  { question: 'True or False?', options: ['true', 'false'], answer: 'true' },
  { question: 'One or two?', options: ['one', 'two'], answer: 'one' },
  {
    question:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
    options: [
      'yes',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'no',
    ],
    answer: 'no',
  },
];
let currentTime = 0;
let hiScore;
let availableQuestions = [...new Array(questions.length).keys()];
let highScores = [];

// -----------------------
// FUNCTIONS
// -----------------------
let startQuiz = function () {
  // Set the timer (add 1 second so the timer displays the actual start time)
  currentTime = 60;
  // Update the count down every 1 second
  setInterval(function () {
    currentTime = Math.max(0, currentTime - 1);
    time.textContent = currentTime;
  }, 1000);

  showQuestion();
};

let showQuestion = function () {
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

let answerHandler = function (event) {
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

let endGame = function () {
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

let saveHiScore = function (event) {
  event.preventDefault();
  // Save current score to the highScores array
  highScores.push({ initials: event.target[0].value, score: hiScore });
  // Save the highScores array to localStorage
  localStorage.setItem('highScores', JSON.stringify(highScores));
  // Reset the form and disable the submit button so the same score
  // can't be submitted multiple times
  event.target.reset();
  document.querySelector('#submit').disabled = true;
};

let loadHighScores = function () {
  // If the high scores value is empty, do nothing
  // or load in the high scores from localStorage
  if (!highScores) {
    return false;
  }
  highScores = JSON.parse(localStorage.getItem('highScores'));
};

let showModal = function () {
  modal.style.display = 'block';
  let row;
  for (let i = 0; i < highScores.length; i++) {
    // Create a row
    row = document.createElement('tr');

    // Create columns with Rank (array index),
    // initials, and the score
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${highScores[i].initials}</td>
      <td>${highScores[i].score}</td>
    `;
    // Add the row to the table
    document.querySelector('table').appendChild(row);
  }
};

const handleModalClick = function (event) {
  console.log(event);
};

// -----------------------
// EVENT HANDLERS
// -----------------------
document.querySelector('#start-quiz').addEventListener('click', startQuiz);
document.querySelector('.view-hi-score').addEventListener('click', showModal);
modal.addEventListener('click', handleModalClick);

loadHighScores();
