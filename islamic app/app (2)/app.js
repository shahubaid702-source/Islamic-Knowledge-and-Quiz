
function speak(text) {
  if (!text) return;
  speechSynthesis.cancel(); // stop previous speech
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-EN";
  utter.rate = 1;
  speechSynthesis.speak(utter);
}
// Unlock status
let unlockNormal = localStorage.getItem("unlockNormal") === "true";
let unlockHard = localStorage.getItem("unlockHard") === "true";

let totalTime = 60;
let quizTimer;

function startMainTimer() {
  document.getElementById("timer").style.display = "block";

  clearInterval(quizTimer);
  quizTimer = setInterval(() => {
    totalTime--;
    document.getElementById("timer").textContent = "Time: " + totalTime + "s";

    if (totalTime <= 0) {
      clearInterval(quizTimer);
      nextBtn.disabled = true;
      endGame();
    }
  }, 1000);
}



function endGame() {
  clearInterval(quizTimer);

  // Quiz hide
  document.getElementById("quizCard").style.display = "none";

  // Game over show
  document.getElementById("gameOver").style.display = "block";

  speak("Time is up. Game over.");
}




function resetTimer() {
  clearInterval(quizTimer); 
  totalTime = 60; 
  document.getElementById("timer").textContent = "Time: 60s";
  startMainTimer();
}

document.getElementById("againStartBtn").addEventListener("click", () => {

  // Hide game over, show quiz
  document.getElementById("gameOver").style.display = "none";
  document.getElementById("quizCard").style.display = "block";

  // Reset timer
  totalTime = 60;
  clearInterval(quizTimer);
  

  // Reset quiz data
  index = 0;
  score = 0;
  correct = 0;
  wrong = 0;

  // Load first question again
  loadQuestion();
});



// Islamic Quiz Questions (English)
const simpleQuestions = [
  { q: "How many obligatory (Fard) prayers are there in a day?", choices: ["3", "5", "6", "2"], answer: 1, explanation: "There are five obligatory prayers in a day: Fajr, Dhuhr, Asr, Maghrib, and Isha." },
  { q: "What is the first Surah of the Quran?", choices: ["Al-Baqarah", "Al-Falaq", "Al-Fatihah", "Al-Mulk"], answer: 2, explanation: "The first Surah of the Quran is Al-Fatihah, also known as The Opening."},
  { q: "Which month do Muslims fast?", choices: ["Rajab", "Muharram", "Ramadan", "Safar"], answer: 2, explanation:"Ramadan is the 9th month of the Islamic lunar calendar." },
  { q: "What is the holy book of Islam?", choices: ["Torah", "Bible", "Quran", "injeel"], answer: 2, explanation:"The Quran is the holy book of Islam, revealed to Prophet Muhammad (PBUH) over 23 years." },
  { q: "Who is the last Prophet in Islam?", choices: ["Prophet Isa (AS)", "Prophet Musa (AS)", "Prophet Ibrahim (AS)", "Prophet Muhammad (PBUH)"], answer: 3, explanation:"Prophet Muhammad (Peace Be Upon Him) is considered the last and final prophet in Islam." },
  { q: "What is the Arabic word for God?", choices: ["Allah", "God", "Jesus", "Khuda"], answer: 0, explanation:"Allah is the Arabic word for God, representing the one and only creator in Islam."},
  { q: "What is the second pillar of Islam?", choices: ["Imaan", "Zakat", "Salah", "Hajj"], answer: 2, explanation:"The second pillar of Islam is Salah, the five daily prayers obligatory for every adult Muslim" },
  { q: "Where is Masjid al-Aqsa located?", choices: ["Makkah", "Madinah", "Jerusalem", "Iran"], answer: 2,explanation:"It is the third holiest site in Islam, after Masjid al-Haram (Makkah) and Masjid an-Nabawi (Madinah)." },
  { q: "Where was Prophet Muhammad (S.A.W) born?", choices: ["Makkah", "Madinah", "Jerusalem", "Iran"], answer: 0, explanation:"Prophet Muhammad (PBUH) was born in Makkah, the holiest city in Islam, in the year 570 CE" },
  { q: "Which Surah is called the Heart of the Quran?", choices: ["Surah Baqarah", "Surah Taha", "Surah Yaseen", "Surah Imran"], answer: 2,explanation:"Surah Yaseen (Chapter 36 of the Quran) is often called the “Heart of the Quran”." },
  { q: "What is the name of the longest Surah in the Quran?", choices: ["Surah Baqarah", "Surah Taha", "Surah Yaseen", "Surah Imran"], answer: 0,explanation:"Surah Al-Baqarah is the longest chapter (Surah) in the Quran, with 286 verses (Ayats" },
  { q: "What is the name of the shortest Surah?", choices: ["Surah Baqarah", "Surah Taha", "Surah Kawthar", "Surah Imran"], answer: 2, explanation:"Surah Al-Kawthar is the shortest chapter in the Quran, with only 3 verses." },
];
//normal question
const normalQuestions = [
  { q: "How many Surahs are in the Qur’an?", choices: ["111", "112", "114", "113"], answer: 2, explanation: "There are 114 Surahs in the Qur’an." },
  { q: "What is the name of the Prophet’s father?", choices: ["Ibrahim", "Abdu", "Abdullah", "Abdul rehman"], answer: 2, explanation: "Prophet Muhammad’s (ﷺ) father was Abdullah. He passed away before the Prophet (ﷺ) was born." },
  { q: "Who was the first Caliph of Islam?", choices: ["Ibrahim ra", "Abu bakr ra", "Umar ra", "Usman ra"], answer: 1, explanation: "After Prophet Muhammad (ﷺ) passed away, Hazrat Abu Bakr (RA) became the first leader (Caliph) of the Muslims." },
  { q: "Which Prophet was swallowed by a whale?", choices: ["Hazrat Musa AS", "Hazrat Yousuf AS", "Hazrat Younis AS", "Hazrat Ibrahim AS"], answer: 2, explanation: "Prophet Yunus (AS) was swallowed by a big fish (whale) after he left his people. He prayed to Allah inside the belly, and Allah saved him" },
  { q: "How many Makki Surahs are there?", choices: ["84", "83", "85", "86"], answer: 3, explanation: "Most Surahs revealed in Makkah are called Makki Surahs. Their number is 86. They mostly talk about faith, tawheed, and good character." },
  { q: "How many Madani Surahs are there?", choices: ["27", "28", "29", "30"], answer: 1, explanation: "Madani Surahs were revealed after the Prophet (ﷺ) moved to Madinah. Their number is 28. They explain Islamic rules and guidance for the Muslim community." },
  { q: "Which battle was the first in Islam?", choices: ["JUNG E OHAD", "JUNG E BADR", "JUNG E KHANDAK", "JUNG E KHYBER"], answer: 1, explanation: "The first battle in Islam was the Battle of Badr." },
  { q: "Which Surah has no Bismillah at the beginning?", choices: ["Surah Toba", "Surah nisa", "Surah naml", "Surah taha"], answer: 0, explanation: "It starts without Bismillah because it came as a declaration against the enemies of Islam" }
];
// HARD QUESTIONS
const hardQuestions = [
  { q: "How many years did Prophet Nuh (AS) preach?", choices: ["940", "950", "960", "980"], answer: 1, explanation: "" },
  { q: "What was the name of Prophet Musa’s (AS) brother?", choices: ["Hazrat haroon AS", "Hazrat Yousuf AS", "Hazrat Younis AS", "Hazrat Ibrahim AS"], answer: 0, explanation: "Allah made him a helper and supporter for Musa (AS)." },
  { q: "How many prophets are mentioned by name in the Qur’an?", choices: ["20", "24", "25", "28"], answer: 2, explanation: "These are the prophets whose names appear clearly in the Qur’an." },
  { q: "Who was the first person to accept Islam after Prophet Muhammad (ﷺ)?", choices: ["Hazrat abu bakr ra", "Hazrat ali", "Hazrat Khadijah (RA)", "Hazrat amaar bin yasir ra"], answer: 2, explanation: "She was the first believer and supported the Prophet (ﷺ) from the beginning." },
  { q: "Which Surah has two Bismillahs?", choices: ["Surah Toba", "Surah nisa", "Surah naml", "Surah taha"], answer: 2, explanation: "One at the start, and another in verse 30 in the letter of Prophet Sulaiman (AS)." }
];
// EMPTY VARIABLE (mode ke baad fill hoga)
let questions = [];
// DOM Elements
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const quizCard = document.getElementById("quizCard");
const resultCard = document.getElementById("resultCard");

const progressBar = document.getElementById("progressBar");
const questionEl = document.getElementById("question");
const qIndexEl = document.getElementById("qIndex");
const choicesEl = document.getElementById("choices");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const playAgain = document.getElementById("playAgain");

const scoreEl = document.getElementById("score");
const totalEl = document.getElementById("total");
const correctEl = document.getElementById("correct");
const wrongEl = document.getElementById("wrong");
const modeSelect = document.getElementById("modeSelect");

// Update mode lock based on stored progress
function updateModeLock() {
  modeSelect.options[1].disabled = !unlockNormal;  
  modeSelect.options[1].textContent = unlockNormal ? "Normal" : "Normal (Locked)";

  modeSelect.options[2].disabled = !unlockHard;
  modeSelect.options[2].textContent = unlockHard ? "Hard" : "Hard (Locked)";
}

updateModeLock();

// State
let index = 0;
let score = 0;
let correct = 0;
let wrong = 0;

// Start quiz



function startQuiz() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("quizBox").style.display = "block";

  startMainTimer();  // ⏳ IMPORTANT — Yahan lagana hai
  loadQuestion();
}



startBtn.addEventListener("click", () => {
  const mode = document.getElementById("modeSelect").value;

  if (mode === "simple") questions = simpleQuestions;
  else if (mode === "normal") questions = normalQuestions;
  else if (mode === "hard") questions = hardQuestions;

  index = 0;
  score = 0;
  correct = 0;
  wrong = 0;

  startScreen.classList.add("hidden");
  quizCard.classList.remove("hidden");

  // 🔥 TIMER START YAHAN
  document.getElementById("timer").style.display = "block";
  totalTime = 60;
startMainTimer();

  // speech unlock
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(" "));

  loadQuestion();


  // SET QUESTION LIST BASED ON MODE
  if (mode === "simple") questions = simpleQuestions;
  else if (mode === "normal") questions = normalQuestions;
  else if (mode === "hard") questions = hardQuestions;

  // Reset index & scores before starting
  index = 0;
  score = 0;
  correct = 0;
  wrong = 0;

  startScreen.classList.add("hidden");
  quizCard.classList.remove("hidden");

  // Unlock speech
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(" "));

  loadQuestion();
});


function showExplanation(text){
  const box = document.getElementById("explanation");
  box.innerHTML = text;
  box.style.display = "block";
}


// Load question with TTS


function loadQuestion() {
  const current = questions[index];

  qIndexEl.textContent = `Question ${index + 1}/${questions.length}`;
  questionEl.textContent = current.q;

  choicesEl.innerHTML = "";
  current.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = choice;
    btn.onclick = () => selectAnswer(i);
    choicesEl.appendChild(btn);
  });

  nextBtn.disabled = true;
  progressBar.style.width = `${(index / questions.length) * 100}%`;

  // Hide explanation for new question
  const explanationBox = document.getElementById("explanation");
  explanationBox.style.display = "none";
  explanationBox.textContent = "";

  // 🔊 Speak question + options
  let speakText = `Question ${index + 1}: ${current.q}. `;
  current.choices.forEach((c, i) => {
    speakText += `Option ${i + 1}: ${c}. `;
  });
  speak(speakText);
}

// Select answer with TTS for explanation
function selectAnswer(i) {
  const correctAns = questions[index].answer;
  const buttons = document.querySelectorAll(".choice");
  buttons.forEach(b => b.disabled = true);

  if (i === correctAns) {
    buttons[i].classList.add("correct");
    score += 10;
    correct++;
  } else {
    buttons[i].classList.add("wrong");
    buttons[correctAns].classList.add("correct");
    wrong++;
  }

  // Show explanation on screen
  const explanationBox = document.getElementById("explanation");
  explanationBox.style.display = "block";
  explanationBox.textContent = questions[index].explanation;

  // 🔊 Speak correct answer + explanation
  speak("Correct answer is: " + questions[index].choices[correctAns] + ". " + questions[index].explanation);

  nextBtn.disabled = false;
}






// Next question
nextBtn.addEventListener("click", () => {
  index++;
  if (index >= questions.length) {
    showResult();
  } else {
    loadQuestion();
  }
});

// Show result
function showResult() {
  quizCard.classList.add("hidden");
  resultCard.classList.remove("hidden");

  scoreEl.textContent = score;
  totalEl.textContent = questions.length;
  correctEl.textContent = correct;
  wrongEl.textContent = wrong;
  speak(`Quiz completed. Your score is ${score} out of ${questions.length*10}. You answered ${correct} correctly and ${wrong} incorrectly.`);

}
function showResult() {
  quizCard.classList.add("hidden");
  resultCard.classList.remove("hidden");

  scoreEl.textContent = score;
  totalEl.textContent = questions.length;
  correctEl.textContent = correct;
  wrongEl.textContent = wrong;

  speak(`Quiz completed. Your score is ${score}.`);

  // 🌟 Unlock next mode
  if (modeSelect.value === "simple" && correct === questions.length) {
    unlockNormal = true;
    localStorage.setItem("unlockNormal", "true");
  }

  if (modeSelect.value === "normal" && correct === questions.length) {
    unlockHard = true;
    localStorage.setItem("unlockHard", "true");
  }

  // Update dropdown
  updateModeLock();
}

// Restart
function resetQuiz() {
  index = 0;
  score = 0;
  correct = 0;
  wrong = 0;

  resultCard.classList.add("hidden");
  quizCard.classList.remove("hidden");

  loadQuestion();
}

restartBtn.addEventListener("click", resetQuiz);
playAgain.addEventListener("click", resetQuiz);