const soundRain = document.querySelector('.sound');
const dropSound = document.querySelector('.drop-sound');
const bubbleSound = document.querySelector('.bubble-sound');
const playingField = document.querySelector('.playing-field');
const wave = document.querySelector('.playing-field__wave--wave1');
const score = document.querySelector('.control__scoreText');
const calculator = document.querySelector('.control__calculator');
const displayCalculator = document.querySelector('.control__display');
const playButton = document.querySelector('.control__play-button');
const wrongAnswerString = document.querySelector('.playing-field__wrong-answer');

const getRamdomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const isNumberRegExp = /^[0-9]$/;
const generateElem = (tagName = 'div') => document.createElement(tagName);

const getSymbolsAndResults = (firstNum, secondNum) => ({
  0: {
    symbol: '+',
    result: firstNum + secondNum,
  },
  1: {
    symbol: '-',
    result: firstNum - secondNum,
  },
  2: {
    symbol: '*',
    result: firstNum * secondNum,
  },
});

soundRain.play();

const BONUS_DROP = 15;
const DROP_SIZE = 50;
let allDropsCount = 0;
let baseChange = 10;
let levelSea = 100;
let scoreValue = 0;
let tryCount = 0;
let totalEquationsSolved = 0;
let equationsPerMinute = 0;
let overallAccuracy = 0;
let gameSpeed = 50;
let gameLevel = 1;
let roundDuration = 0;
const start = new Date();

const changeDisplayValue = (number) => {
  const isNumber = isNumberRegExp.test(number);
  const isCorrectLength = displayCalculator.textContent.length < 5;

  if (!isNumber || !isCorrectLength) return;

  displayCalculator.textContent += number;
};

const wrongAnswerAnimation = () => {
  wrongAnswerString.classList.add('playing-field__wrong-answer--animation');
  wrongAnswerString.addEventListener('transitionend', () => wrongAnswerString.classList.remove('playing-field__wrong-answer--animation'));
  wrongAnswerString.textContent = `-${baseChange}`;
};

const changeScore = (isCorrectAnswer) => {
  if (isCorrectAnswer) {
    scoreValue += baseChange;
  } else {
    scoreValue -= baseChange;
    scoreValue = scoreValue < 0 ? 0 : scoreValue;
    wrongAnswerAnimation();
  }
};

const printScore = (scoreNumber) => {
  score.textContent = `Score: ${scoreNumber}`;
};

const playSplashAnimation = (splashElement) => {
  splashElement.classList.add('splash--animation');
  setTimeout(() => {
    splashElement.remove();
  }, 200);
  bubbleSound.play();
};

const removeElement = (element) => {
  clearInterval(element.timer);
  element.remove();
};

const removeAllElements = () => {
  const allDrops = document.querySelectorAll('.drop');
  const allSplashes = document.querySelectorAll('.splash');
  allDrops.forEach(removeElement);
  allSplashes.forEach(playSplashAnimation);
};

const makeNewDrop = (indent, bonusDrop) => {
  const newDrop = generateElem();
  const dropNumbers = generateElem();
  const dropFirstNumber = generateElem();
  const dropSecondNumber = generateElem();
  const firstNumber = getRamdomNumber(5 * gameLevel, 10 * gameLevel);
  const secondNumber = getRamdomNumber(1 * gameLevel, 5 * gameLevel);
  const operation = generateElem();
  const randomNumber = getRamdomNumber(0, 2);
  const symbolsAndResults = getSymbolsAndResults(firstNumber, secondNumber);
  const { symbol, result } = symbolsAndResults[randomNumber];

  operation.textContent = symbol;
  newDrop.result = result;

  dropFirstNumber.textContent = firstNumber;
  dropSecondNumber.textContent = secondNumber;

  dropFirstNumber.classList.add('drop__numbers--first');
  dropSecondNumber.classList.add('drop__numbers--second');

  dropNumbers.append(dropFirstNumber);
  dropNumbers.append(dropSecondNumber);

  newDrop.append(operation);
  newDrop.append(dropNumbers);

  if (allDropsCount % bonusDrop === 0) {
    newDrop.classList.add('drop--bonus');
  }

  newDrop.classList.add('drop');
  newDrop.style.left = `${indent}px`;

  return newDrop;
};

const makeNewSplash = (indent) => {
  const newSplash = generateElem('img');

  newSplash.classList.add('splash');
  newSplash.setAttribute('src', 'assets/images/splash.png');
  newSplash.style.left = `${indent}px`;

  return newSplash;
};

const increaseSeaLevel = () => {
  dropSound.currentTime = 0;
  dropSound.play();
  wave.style.height = `${levelSea += DROP_SIZE}px`;
};

const saveStatistic = () => {
  sessionStorage.setItem('equationsPerMinute', equationsPerMinute.toFixed());
  sessionStorage.setItem('totalEquationsSolved', totalEquationsSolved);
  sessionStorage.setItem('overallAccuracy', `${overallAccuracy.toFixed()}%`);
  sessionStorage.setItem('scoreValue', `${scoreValue} points`);
};

const finishGame = (timer) => {
  if (levelSea < 250) return;

  roundDuration = new Date(new Date().getTime() - start.getTime()).getMinutes();
  overallAccuracy = tryCount ? totalEquationsSolved / (tryCount / 100) : 0;
  equationsPerMinute = roundDuration >= 1
    ? totalEquationsSolved / roundDuration : totalEquationsSolved;

  saveStatistic();
  clearInterval(timer);

  document.location.href = './results.html';
};

const checkAnswer = () => {
  tryCount += 1;
  const firstDrop = document.querySelector('.drop');
  const firstSplash = document.querySelector('.splash');
  const isCorrectAnswer = displayCalculator.textContent === String(firstDrop.result);

  changeScore(isCorrectAnswer);
  printScore(scoreValue);

  if (isCorrectAnswer) {
    if (firstDrop.classList.contains('drop--bonus')) {
      removeAllElements();
    } else {
      playSplashAnimation(firstSplash);
      removeElement(firstDrop);
    }
    baseChange += 1;
    totalEquationsSolved += 1;
  }
  displayCalculator.textContent = '';
};

const addCalculatorControl = ({ target: button }) => {
  changeDisplayValue(button.textContent);
  if (button.textContent === 'Enter') {
    checkAnswer();
  }
  if (button.textContent === 'Del') {
    displayCalculator.textContent = displayCalculator.textContent.slice(0, -1);
  }
  if (button.textContent === 'Clear') {
    displayCalculator.textContent = '';
  }
};

const addKeyboardControl = (e) => {
  changeDisplayValue(e.key);
  if (e.key === 'Enter') {
    checkAnswer();
  }
};
window.addEventListener('keyup', addKeyboardControl);

const tutorialMode = () => {
  let dropHeight = 0;
  const leftIndent = getRamdomNumber(0, playingField.offsetWidth - DROP_SIZE);

  const newDrop = makeNewDrop(leftIndent);
  const newSplash = makeNewSplash(leftIndent);

  playingField.append(newDrop);
  playingField.append(newSplash);

  const timer = setInterval(() => {
    newDrop.timer = timer;
    dropHeight += 1;

    newSplash.style.top = `${dropHeight}px`;
    newDrop.style.top = `${dropHeight}px`;
  }, 10);
  setTimeout(() => {
    const firstDrop = document.querySelector('.drop');
    const firstSplash = document.querySelector('.splash');
    displayCalculator.textContent = firstDrop.result;
    setTimeout(() => {
      playSplashAnimation(firstSplash);
      removeElement(firstDrop);
    }, 1000);
  }, 2000);
};

const playMode = (game) => {
  allDropsCount += 1;
  let dropHeight = 0;
  const leftIndent = getRamdomNumber(0, playingField.offsetWidth - DROP_SIZE);

  const newDrop = makeNewDrop(leftIndent, BONUS_DROP);
  const newSplash = makeNewSplash(leftIndent, BONUS_DROP);

  playingField.append(newDrop);
  playingField.append(newSplash);

  const timer = setInterval(() => {
    newDrop.timer = timer;
    dropHeight += 1;

    newSplash.style.top = `${dropHeight}px`;
    newDrop.style.top = `${dropHeight}px`;

    if (dropHeight > wave.offsetTop - DROP_SIZE) {
      increaseSeaLevel();

      clearInterval(timer);

      removeAllElements();

      finishGame(game);
    }
  }, gameSpeed);
};

if (playButton) {
  setInterval(tutorialMode, 2000);
  calculator.style.marginTop = '-25px';
} else {
  calculator.addEventListener('click', addCalculatorControl);
  const game = setInterval(() => playMode(game), 3000);
  setInterval(() => {
    gameLevel += 1;
    gameSpeed -= 20;
  }, 60000);
}
