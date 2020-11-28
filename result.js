const equationsStatistic = document.querySelector('.statistic__number--equations');
const totalEquationsStatistic = document.querySelector('.statistic__number--total-equations');
const overallAccuracy = document.querySelector('.statistic__number--overall');
const totalScore = document.querySelector('.statistic__text--total-score');

equationsStatistic.textContent = sessionStorage.getItem('equationsPerMinute');
totalEquationsStatistic.textContent = sessionStorage.getItem('totalEquationsSolved');
overallAccuracy.textContent = `${sessionStorage.getItem('overallAccuracy')}%`;
totalScore.textContent = `${sessionStorage.getItem('scoreValue')} points`;
