import type { GameState } from '../types/game';
import { createProgressBar } from './ProgressBar';
import { createTimer, updateTimer } from './Timer';
import { createRoundDisplay } from './RoundDisplay';
import { createAnswerOptions, revealAnswer } from './AnswerOptions';
import { LANGUAGE_NAMES } from '../data/languages';

interface GameScreenOptions {
  state: GameState;
  onAnswer: (languageCode: string) => void;
  onNext: () => void;
  elapsedMs: number;
}

export function createGameScreen(options: GameScreenOptions): HTMLElement {
  const { state, onAnswer, onNext, elapsedMs } = options;
  const round = state.rounds[state.currentRound];
  const answer = state.answers[state.currentRound];
  const isAnswered = !!answer;

  const container = document.createElement('div');
  container.className = 'game';

  // Header with timer
  const header = document.createElement('header');
  header.className = 'header';
  header.innerHTML = `
    <span class="header__title">Translatle</span>
  `;
  const timer = createTimer(elapsedMs);
  header.appendChild(timer);
  container.appendChild(header);

  // Store timer reference for updates
  (container as unknown as { timerElement: HTMLElement }).timerElement = timer;

  // Progress bar
  const progress = createProgressBar(state.currentRound, state.answers);
  container.appendChild(progress);

  // Round display
  const roundDisplay = createRoundDisplay(round);
  container.appendChild(roundDisplay);

  // Answer options
  const answerOptions = createAnswerOptions(
    round.options,
    (code) => {
      onAnswer(code);
    },
    isAnswered
  );
  container.appendChild(answerOptions);

  // If answered, reveal the answer and show feedback + next button
  if (isAnswered) {
    revealAnswer(answerOptions, round.correctLanguage, answer.selectedLanguage);

    // Feedback banner
    const feedback = document.createElement('div');
    feedback.className = `feedback-banner ${answer.correct ? 'feedback-banner--correct' : 'feedback-banner--incorrect'}`;
    feedback.innerHTML = answer.correct
      ? `✓ Correct!`
      : `✗ It was ${LANGUAGE_NAMES[round.correctLanguage]}`;
    container.appendChild(feedback);

    // Auto-hide feedback after delay
    setTimeout(() => {
      feedback.style.opacity = '0';
      feedback.style.transition = 'opacity 0.3s';
    }, 1500);

    const nextButton = document.createElement('button');
    nextButton.className = 'next-button';
    nextButton.textContent =
      state.currentRound >= 4 ? 'See Results' : 'Next Round';
    nextButton.addEventListener('click', onNext);
    container.appendChild(nextButton);
  }

  return container;
}

export function updateGameScreenTimer(
  container: HTMLElement,
  elapsedMs: number
): void {
  const timer = (container as HTMLElement & { timerElement?: HTMLElement })
    .timerElement;
  if (timer) {
    updateTimer(timer, elapsedMs);
  }
}
