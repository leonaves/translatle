import type { GameState, Answer, Round } from '../types/game';
import { getDayNumber, generateDailyRounds } from './DailySelector';
import {
  loadGameState,
  saveGameState,
  clearGameState,
  loadStats,
  saveStats,
} from '../utils/storage';

type Listener = (state: GameState) => void;

export class GameEngine {
  private state: GameState;
  private listeners: Set<Listener> = new Set();
  private roundStartTime: number | null = null;

  constructor() {
    this.state = this.getDefaultState();
  }

  private getDefaultState(): GameState {
    return {
      dayNumber: getDayNumber(),
      currentRound: 0,
      rounds: [],
      answers: [],
      startTime: null,
      endTime: null,
      status: 'splash',
    };
  }

  initialize(): void {
    const dayNumber = getDayNumber();
    const saved = loadGameState();

    // Check if we have saved state for today
    if (saved && saved.dayNumber === dayNumber) {
      // Generate rounds first to restore state properly
      const rounds = generateDailyRounds(dayNumber);

      this.state = {
        dayNumber,
        currentRound: saved.currentRound,
        rounds,
        answers: saved.answers,
        startTime: saved.startTime,
        endTime: saved.endTime,
        status:
          saved.answers.length >= 5
            ? 'finished'
            : saved.startTime
              ? 'playing'
              : 'splash',
      };
    } else {
      // New day or no saved state
      clearGameState();
      const rounds = generateDailyRounds(dayNumber);
      this.state = {
        ...this.getDefaultState(),
        rounds,
      };
    }

    this.notify();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn(this.state));
  }

  private persistState(): void {
    saveGameState({
      version: 1,
      dayNumber: this.state.dayNumber,
      currentRound: this.state.currentRound,
      answers: this.state.answers,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
    });
  }

  getState(): GameState {
    return this.state;
  }

  startGame(): void {
    if (this.state.status !== 'splash') return;

    this.state.status = 'playing';
    this.state.startTime = Date.now();
    this.roundStartTime = Date.now();
    this.persistState();
    this.notify();
  }

  submitAnswer(languageCode: string): void {
    if (this.state.status !== 'playing') return;
    if (this.state.currentRound >= this.state.rounds.length) return;

    const round = this.state.rounds[this.state.currentRound];
    const correct = languageCode === round.correctLanguage;
    const timeMs = this.roundStartTime ? Date.now() - this.roundStartTime : 0;

    const answer: Answer = {
      roundIndex: this.state.currentRound,
      selectedLanguage: languageCode,
      correct,
      timeMs,
    };

    this.state.answers.push(answer);
    this.persistState();
    this.notify();
  }

  nextRound(): void {
    if (this.state.status !== 'playing') return;

    if (this.state.currentRound >= this.state.rounds.length - 1) {
      // Game finished
      this.state.endTime = Date.now();
      this.state.status = 'finished';
      this.updateStats();
    } else {
      // Move to next round
      this.state.currentRound++;
      this.roundStartTime = Date.now();
    }

    this.persistState();
    this.notify();
  }

  private updateStats(): void {
    const stats = loadStats();
    const score = this.state.answers.filter((a) => a.correct).length;
    const totalTime = this.state.endTime! - this.state.startTime!;

    stats.gamesPlayed++;
    stats.totalCorrect += score;

    if (score === 5) {
      stats.currentStreak++;
      stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    } else {
      stats.currentStreak = 0;
    }

    if (stats.bestTime === null || totalTime < stats.bestTime) {
      stats.bestTime = totalTime;
    }

    saveStats(stats);
  }

  getScore(): number {
    return this.state.answers.filter((a) => a.correct).length;
  }

  getTotalTime(): number {
    if (!this.state.startTime) return 0;
    const endTime = this.state.endTime || Date.now();
    return endTime - this.state.startTime;
  }

  getCurrentRound(): Round | null {
    if (this.state.currentRound >= this.state.rounds.length) return null;
    return this.state.rounds[this.state.currentRound];
  }

  getCurrentAnswer(): Answer | null {
    return this.state.answers[this.state.currentRound] || null;
  }

  isRoundAnswered(): boolean {
    return this.state.answers.length > this.state.currentRound;
  }
}
