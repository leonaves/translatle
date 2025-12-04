import type { Answer } from './game';

export interface StoredGameState {
  version: number;
  dayNumber: number;
  currentRound: number;
  answers: Answer[];
  startTime: number | null;
  endTime: number | null;
}

export interface PlayerStats {
  gamesPlayed: number;
  totalCorrect: number;
  currentStreak: number;
  maxStreak: number;
  bestTime: number | null;
}
