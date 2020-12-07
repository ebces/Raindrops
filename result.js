const equationsStatistic = document.querySelector('.statistic__number--equations');
const totalEquationsStatistic = document.querySelector('.statistic__number--total-equations');
const overallAccuracy = document.querySelector('.statistic__number--overall');
const totalScore = document.querySelector('.statistic__text--total-score');

equationsStatistic.textContent = sessionStorage.getItem('equationsPerMinute') || 0;
totalEquationsStatistic.textContent = sessionStorage.getItem('totalEquationsSolved') || 0;
overallAccuracy.textContent = sessionStorage.getItem('overallAccuracy') || 0;
totalScore.textContent = sessionStorage.getItem('scoreValue') || 0;
