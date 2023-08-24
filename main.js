let questionsCount = document.querySelector(".count span");
let bulletsContianer = document.querySelector(".bullets")
let bulletsSpans = document.querySelector(".bullets .spans");
let quizApp = document.querySelector(".quiz-app");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

let currentData = 0;
let rightA = 0;
let deurationAnswer = 60;
let countdownInterval;

function grtQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.status === 200 && this.readyState === 4) {
      let questionsObject = JSON.parse(this.responseText);
      let questionsObjectCount = questionsObject.length;
      countBullets(questionsObjectCount);
      addData(questionsObject[currentData], questionsObjectCount);
      countdown(deurationAnswer, questionsObjectCount);
      submitButton.onclick = () => {
        let rightAnswer = questionsObject[currentData].right_answer;
        currentData++;
        finallAnswer(rightAnswer, questionsObjectCount);
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";
        addData(questionsObject[currentData], questionsObjectCount);
        handelBullets();
        clearInterval(countdownInterval);
        countdown(deurationAnswer, questionsObjectCount);
        showResults(questionsObjectCount);
      };
    }
  }
  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
};

grtQuestions();

function countBullets(num) {
  questionsCount.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let bullets = document.createElement("span");
    bulletsSpans.appendChild(bullets);
    if (i === 0) {
      bullets.className = "on";
    }
  }
};

function addData(obj, count) {
  if (currentData < count) {
    // Create Question Title
    let qHead = document.createElement("h2");
    qHead.textContent = obj.title;
    quizArea.appendChild(qHead);

    // Create Answers
    for (let i = 1; i <= 4; i++) {
      let answer = document.createElement("div");
      answer.className = "answer";

      let answerInput = document.createElement("input");
      answerInput.name = "question";
      answerInput.type = "radio";
      answerInput.id = `answer_${i}`;
      answerInput.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        answerInput.checked = true;
      }

      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      theLabel.textContent = obj[`answer_${i}`];

      answer.appendChild(answerInput);
      answer.appendChild(theLabel);
      answerArea.appendChild(answer);
    }
  }
};

function finallAnswer(rAnswer, answerCount) {
  let answers = document.getElementsByName("question");
  let choosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }
  if (choosenAnswer === rAnswer) {
    rightA++;
  }
};

function handelBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayBullets = Array.from(bulletsSpans);

  arrayBullets.forEach((e, i) => {
    if (i === currentData) {
      e.className = "on";
    }
  }) 
};

function showResults(count) {
  let theResults;
  if (currentData === count) {
    quizArea.remove();
    answerArea.remove();
    submitButton.remove();
    bulletsContianer.remove();

    if (rightA > (count / 2) && rightA < count) {
      theResults = `<span class="good">Good</span>, ${rightA} From ${count}`;
    } else if (rightA === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightA} From ${count}`;
    }

    resultsContainer.innerHTML = theResults;
  }
};

function countdown(duration, count) {
  if (currentData < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes} : ${seconds}`

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000)
  }
};