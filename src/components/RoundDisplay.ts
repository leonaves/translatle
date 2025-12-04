import type { Round } from '../types/game';

export function createRoundDisplay(round: Round): HTMLElement {
  const container = document.createElement('div');
  container.className = 'round-display';
  container.innerHTML = `
    <div class="round-display__emoji">${round.emoji}</div>
    <div class="round-display__label">"${round.label}"</div>
    <p class="round-display__instruction">What language is this?</p>
  `;
  return container;
}
