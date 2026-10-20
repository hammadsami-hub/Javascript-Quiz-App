// ---------- Quiz data ----------
const questions = [
  {
    question: "Which keyword declares a variable that cannot be reassigned?",
    options: ["var", "let", "const", "static"],
    answer: 2
  },
  {
    question: "What does typeof null return?",
    options: ["'null'", "'object'", "'undefined'", "'number'"],
    answer: 1
  },
  {
    question: "Which method adds an item to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: 0
  },
  {
    question: "What is the result of '5' + 3 in JavaScript?",
    options: ["8", "'53'", "NaN", "Error"],
    answer: 1
  },
  {
    question: "Which operator checks both value and type?",
    options: ["==", "=", "===", "!="],
    answer: 2
  },
  {
    question: "Which method converts a JSON string into an object?",
    options: ["JSON.stringify()", "JSON.parse()", "JSON.convert()", "JSON.object()"],
    answer: 1
  },
  {
    question: "What does the map() method return?",
    options: ["A single value", "Nothing", "A new array", "The original array"],
    answer: 2
  },
  {
    question: "Which keyword pauses an async function until a Promise settles?",
    options: ["yield", "await", "pause", "defer"],
    answer: 1
  },
  {
    question: "How do you select an element with id 'box'?",
    options: [
      "document.getElementById('box')",
      "document.query('box')",
      "document.getElement('#box')",
      "document.id('box')"
    ],
    answer: 0
  },
  {
    question: "What is a closure?",
    options: [
      "A way to close the browser tab",
      "A function that remembers variables from its outer scope",
      "A loop that never ends",
      "A method to close a file"
    ],
    answer: 1
  }
];

const TIME_PER_QUESTION = 15; // seconds

// ---------- State ----------
let currentIndex = 0;
let score = 0;
let timeLeft = TIME_PER_QUESTION;
let timerId = null;
let answered = false;

// ---------- Elements ----------
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionCount = document.getElementById("question-count");
const questionText = document.getElementById("question-text");
const optionsBox = document.getElementById("options");
const timerEl = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const scoreLive = document.getElementById("score-live");
const resultScore = document.getElementById("result-score");
const resultMessage = document.getElementById("result-message");

// ---------- Screen helpers ----------
function showScreen(screen) {
  [startScreen, quizScreen, resultScreen].forEach(s => s.classList.add("d-none"));
  screen.classList.remove("d-none");
}

// ---------- Quiz flow ----------
function startQuiz() {
  currentIndex = 0;
  score = 0;
  showScreen(quizScreen);
  loadQuestion();
}

function loadQuestion() {
  answered = false;
  nextBtn.disabled = true;

  const q = questions[currentIndex];
  questionCount.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  questionText.textContent = q.question;
  scoreLive.textContent = `Score: ${score}`;
  progressBar.style.width = `${(currentIndex / questions.length) * 100}%`;
  nextBtn.textContent = currentIndex === questions.length - 1 ? "See result" : "Next question";

  optionsBox.innerHTML = "";
  q.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = text;
    btn.addEventListener("click", () => selectAnswer(i));
    optionsBox.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = TIME_PER_QUESTION;
  updateTimerUI();

  timerId = setInterval(() => {
    timeLeft--;
    updateTimerUI();
    if (timeLeft <= 0) {
      clearInterval(timerId);
      selectAnswer(-1); // time is up, no answer chosen
    }
  }, 1000);
}

function updateTimerUI() {
  timerEl.textContent = `${timeLeft}s`;
  timerEl.classList.toggle("low", timeLeft <= 5);
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  clearInterval(timerId);

  const correctIndex = questions[currentIndex].answer;
  const buttons = optionsBox.querySelectorAll(".option-btn");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIndex) btn.classList.add("correct");
    if (i === selectedIndex && i !== correctIndex) btn.classList.add("wrong");
  });

  if (selectedIndex === correctIndex) {
    score++;
    scoreLive.textContent = `Score: ${score}`;
  }

  nextBtn.disabled = false;
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  clearInterval(timerId);
  progressBar.style.width = "100%";
  showScreen(resultScreen);

  const total = questions.length;
  const percent = Math.round((score / total) * 100);
  resultScore.textContent = `${score} / ${total}`;

  if (percent >= 80) resultMessage.textContent = `${percent}%. Excellent work.`;
  else if (percent >= 50) resultMessage.textContent = `${percent}%. Good effort. Try again to beat it.`;
  else resultMessage.textContent = `${percent}%. Review the basics and try again.`;
}

// ---------- Events ----------
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", startQuiz);
