// -----------------------
// GLOBAL VARIABLES
// -----------------------
const main = document.querySelector('.content');
const time = document.querySelector('.time');
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
  if (parseInt(currentTime) > 0 && availableQuestions.length > 0) {
    // Get a random question from the available questions
    let num = Math.floor(Math.random() * availableQuestions.length);
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
    // Remove the question from the array so we don't get it again
    console.log(num, availableQuestions, availableQuestions.indexOf(num));
    availableQuestions.splice(availableQuestions.indexOf(num), 1);
    console.log(availableQuestions);
  } else {
    return endGame();
  }
};

let answerHandler = function (event) {
  let key = event.target.dataset['key'];
  let answer = event.target.textContent
    .substring(event.target.textContent.indexOf('. ') + 1)
    .trim();
  let response = document.createElement('div');
  response.className = 'response';
  console.log(response);
  if (answer == questions[key].answer) {
    response.textContent = 'Correct!';
  } else {
    response.textContent = 'Wrong!';
    currentTime = Math.max(currentTime - 10, 0);
    time.textContent = currentTime;
  }
  console.log(main);
  setTimeout(() => {
    response.remove();
  }, 2000);
  showQuestion();
  main.appendChild(response);
};

let endGame = function () {
  if (currentTime === 0) {
    alert("Time's up!");
  } else {
    alert('You won!');
    hiScore = currentTime;
    currentTime = 0;
  }
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
  highScores.push({ initials: event.target[0].value, score: hiScore });
  console.log(highScores);
  localStorage.setItem('highScores', JSON.stringify(highScores));
  event.target.reset();
  document.querySelector('#submit').disabled = true;
};

let loadHighScores = function () {
  if (!highScores) {
    return false;
  }
  highScores = JSON.parse(localStorage.getItem('highScores'));
};

// -----------------------
// EVENT HANDLERS
// -----------------------
document.querySelector('#start-quiz').addEventListener('click', startQuiz);

loadHighScores();
