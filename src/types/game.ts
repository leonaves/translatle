export type GameStatus = 'splash' | 'playing' | 'finished';

export interface Round {
  emoji: string;
  hexcode: string;
  correctLanguage: string;
  label: string;
  options: string[];
}

export interface Answer {
  roundIndex: number;
  selectedLanguage: string;
  correct: boolean;
  timeMs: number;
}

export interface GameState {
  dayNumber: number;
  currentRound: number;
  rounds: Round[];
  answers: Answer[];
  startTime: number | null;
  endTime: number | null;
  status: GameStatus;
}
