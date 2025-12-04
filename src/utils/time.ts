export class GameTimer {
  private startTime: number | null = null;
  private intervalId: number | null = null;
  private onTick: (elapsed: number) => void;

  constructor(onTick: (elapsed: number) => void) {
    this.onTick = onTick;
  }

  start(fromTime?: number): void {
    this.startTime = fromTime ?? Date.now();
    this.intervalId = window.setInterval(() => {
      if (this.startTime) {
        this.onTick(Date.now() - this.startTime);
      }
    }, 100);
  }

  stop(): number {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.startTime) {
      return Date.now() - this.startTime;
    }
    return 0;
  }

  getElapsed(): number {
    if (!this.startTime) return 0;
    return Date.now() - this.startTime;
  }

  getStartTime(): number | null {
    return this.startTime;
  }
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function getTimeUntilMidnight(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

export function formatCountdown(time: { hours: number; minutes: number; seconds: number }): string {
  return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
}
