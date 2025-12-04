import type { Answer } from '../types/game';
import { formatTime, getTimeUntilMidnight } from '../utils/time';
import { shareResults } from '../utils/share';

interface ResultScreenOptions {
  dayNumber: number;
  score: number;
  totalTime: number;
  answers: Answer[];
}

export function createResultScreen(options: ResultScreenOptions): HTMLElement {
  const { dayNumber, score, totalTime, answers } = options;

  const container = document.createElement('div');
  container.className = 'result';

  const grid = answers.map((a) => (a.correct ? '🟩' : '🟥')).join('');

  container.innerHTML = `
    <h1 class="result__title">Game Complete!</h1>

    <div class="result__score">
      <span class="result__score-value">${score}/5</span>
      <span class="result__score-label">correct</span>
    </div>

    <p class="result__time">${formatTime(totalTime)}</p>

    <div class="result__grid">${grid}</div>

    <button class="share-button">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
        <polyline points="16 6 12 2 8 6"></polyline>
        <line x1="12" y1="2" x2="12" y2="15"></line>
      </svg>
      Share Results
    </button>

    <p class="result__next-game">Next game in ${getTimeUntilMidnight()}</p>
  `;

  // Toast element
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = 'Copied to clipboard!';
  container.appendChild(toast);

  container
    .querySelector('.share-button')!
    .addEventListener('click', async () => {
      const success = await shareResults(dayNumber, score, answers, totalTime);
      if (success) {
        toast.classList.add('toast--visible');
        setTimeout(() => {
          toast.classList.remove('toast--visible');
        }, 2000);
      }
    });

  return container;
}
