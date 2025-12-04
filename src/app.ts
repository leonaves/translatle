import { GameEngine } from './game/GameEngine';
import { GameTimer } from './utils/time';
import { createSplashScreen } from './components/SplashScreen';
import {
  createGameScreen,
  updateGameScreenTimer,
} from './components/GameScreen';
import { createResultScreen } from './components/ResultScreen';
import type { GameState } from './types/game';

export class App {
  private engine: GameEngine;
  private timer: GameTimer;
  private container: HTMLElement;
  private currentScreen: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.engine = new GameEngine();
    this.timer = new GameTimer((elapsed) => this.onTimerTick(elapsed));
  }

  initialize(): void {
    this.engine.initialize();

    // Subscribe to state changes
    this.engine.subscribe((state) => this.render(state));

    // If game was in progress, resume timer
    const state = this.engine.getState();
    if (state.status === 'playing' && state.startTime) {
      this.timer.start(state.startTime);
    }
  }

  private render(state: GameState): void {
    // Remove current screen
    if (this.currentScreen) {
      this.currentScreen.remove();
    }

    // Render appropriate screen
    switch (state.status) {
      case 'splash':
        this.currentScreen = this.renderSplash();
        break;
      case 'playing':
        this.currentScreen = this.renderGame(state);
        break;
      case 'finished':
        this.currentScreen = this.renderResult(state);
        break;
    }

    if (this.currentScreen) {
      this.container.appendChild(this.currentScreen);
    }
  }

  private renderSplash(): HTMLElement {
    return createSplashScreen(() => {
      this.engine.startGame();
      this.timer.start();
    });
  }

  private renderGame(state: GameState): HTMLElement {
    return createGameScreen({
      state,
      elapsedMs: this.timer.getElapsed(),
      onAnswer: (code) => {
        this.engine.submitAnswer(code);
      },
      onNext: () => {
        this.engine.nextRound();
      },
    });
  }

  private renderResult(state: GameState): HTMLElement {
    this.timer.stop();
    return createResultScreen({
      dayNumber: state.dayNumber,
      score: this.engine.getScore(),
      totalTime: this.engine.getTotalTime(),
      answers: state.answers,
      rounds: state.rounds,
    });
  }

  private onTimerTick(elapsed: number): void {
    if (this.currentScreen && this.engine.getState().status === 'playing') {
      updateGameScreenTimer(this.currentScreen, elapsed);
    }
  }
}
