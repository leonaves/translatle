import type { Answer, Round } from '../types/game';
import { formatTime, getTimeUntilMidnight, formatCountdown } from '../utils/time';
import { shareResults } from '../utils/share';
import { LANGUAGE_NAMES } from '../data/languages';

interface ResultScreenOptions {
  dayNumber: number;
  score: number;
  totalTime: number;
  answers: Answer[];
  rounds: Round[];
}

export function createResultScreen(options: ResultScreenOptions): HTMLElement {
  const { dayNumber, score, totalTime, answers, rounds } = options;

  const container = document.createElement('div');
  container.className = 'result';

  const grid = answers.map((a) => (a.correct ? '🟩' : '🟥')).join('');

  // Build review HTML
  const reviewHtml = rounds
    .map((round, i) => {
      const answer = answers[i];
      const isCorrect = answer?.correct;
      const selectedLang = answer?.selectedLanguage;
      const correctLang = round.correctLanguage;

      return `
      <div class="review-item ${isCorrect ? 'review-item--correct' : 'review-item--incorrect'}">
        <div class="review-item__emoji">${round.emoji}</div>
        <div class="review-item__details">
          <div class="review-item__label">"${round.label}"</div>
          <div class="review-item__answer">
            ${isCorrect ? '✓' : '✗'}
            ${isCorrect ? LANGUAGE_NAMES[correctLang] : `${LANGUAGE_NAMES[selectedLang]} → ${LANGUAGE_NAMES[correctLang]}`}
          </div>
        </div>
      </div>
    `;
    })
    .join('');

  const time = getTimeUntilMidnight();

  container.innerHTML = `
    <h1 class="result__title">${score === 5 ? 'Perfect! 🎉' : score >= 3 ? 'Nice! 👍' : 'Game Complete!'}</h1>

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

    <div class="result__countdown">
      <span class="result__countdown-label">Next game in</span>
      <span class="result__countdown-time">${formatCountdown(time)}</span>
    </div>

    <div class="review">
      <h2 class="review__title">Review Answers</h2>
      <div class="review__list">
        ${reviewHtml}
      </div>
    </div>
  `;

  // Toast element
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = 'Copied to clipboard!';
  container.appendChild(toast);

  // Share button handler
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

  // Live countdown timer
  const countdownEl = container.querySelector('.result__countdown-time')!;
  setInterval(() => {
    const newTime = getTimeUntilMidnight();
    countdownEl.textContent = formatCountdown(newTime);
  }, 1000);

  return container;
}
