import type { Answer } from '../types/game';

export function createProgressBar(
  currentRound: number,
  answers: Answer[]
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'progress';

  for (let i = 0; i < 5; i++) {
    const dot = document.createElement('div');
    dot.className = 'progress__dot';

    if (i < answers.length) {
      // Answered round
      dot.classList.add(
        answers[i].correct
          ? 'progress__dot--correct'
          : 'progress__dot--incorrect'
      );
    } else if (i === currentRound) {
      // Current round
      dot.classList.add('progress__dot--current');
    }

    container.appendChild(dot);
  }

  return container;
}
