import type { StoredGameState, PlayerStats } from '../types/storage';

const STORAGE_KEY = 'translatle-state';
const STATS_KEY = 'translatle-stats';
const STORAGE_VERSION = 1;

export function saveGameState(state: StoredGameState): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, version: STORAGE_VERSION })
    );
  } catch {
    // localStorage might be unavailable or full
  }
}

export function loadGameState(): StoredGameState | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data) as StoredGameState;
    if (parsed.version !== STORAGE_VERSION) {
      // Version mismatch, clear old data
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}

export function loadStats(): PlayerStats {
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (!data) return getDefaultStats();
    return JSON.parse(data) as PlayerStats;
  } catch {
    return getDefaultStats();
  }
}

export function saveStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore errors
  }
}

function getDefaultStats(): PlayerStats {
  return {
    gamesPlayed: 0,
    totalCorrect: 0,
    currentStreak: 0,
    maxStreak: 0,
    bestTime: null,
  };
}
