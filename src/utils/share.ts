import type { Answer } from '../types/game';

function isMobile(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export async function shareResults(
  dayNumber: number,
  score: number,
  answers: Answer[],
  totalTime: number
): Promise<boolean> {
  const grid = answers.map((a) => (a.correct ? '🟩' : '🟥')).join('');
  const minutes = Math.floor(totalTime / 60000);
  const seconds = Math.floor((totalTime % 60000) / 1000);

  const text = `Translatle Day ${dayNumber}
${score}/5 in ${minutes}:${seconds.toString().padStart(2, '0')}
${grid}

https://translatle.pages.dev`;

  // Try Web Share API first (mobile)
  if (navigator.share && isMobile()) {
    try {
      await navigator.share({
        title: 'Translatle',
        text: text,
      });
      return true;
    } catch {
      // User cancelled or error - fall through to clipboard
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
