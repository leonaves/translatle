import { formatTime } from '../utils/time';

export function createTimer(elapsedMs: number): HTMLElement {
  const timer = document.createElement('span');
  timer.className = 'header__timer';
  timer.textContent = formatTime(elapsedMs);
  return timer;
}

export function updateTimer(element: HTMLElement, elapsedMs: number): void {
  element.textContent = formatTime(elapsedMs);
}
