import { createSeededRandom, seededShuffle } from '../utils/seeded-random';
import { LANGUAGE_CODES } from '../data/languages';
import { getCuratedEmojis, getEmojiLabel } from '../data/emoji-loader';
import type { Round } from '../types/game';
import type { CuratedEmoji } from '../types/emoji';

// Start date: December 4, 2024

export function getDayNumber(): number {
  const now = new Date();
  const utcNow = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );
  const utcStart = Date.UTC(2024, 11, 4, 0, 0, 0); // December is month 11

  const diffMs = utcNow - utcStart;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Allow negative days (past dates) to wrap around
  const emojis = getCuratedEmojis();
  const maxDays = Math.floor(emojis.length / 5);

  return ((diffDays % maxDays) + maxDays) % maxDays;
}

export function selectDailyEmojis(dayNumber: number): CuratedEmoji[] {
  const emojis = getCuratedEmojis();
  const random = createSeededRandom(dayNumber);

  // Shuffle with seeded random
  const shuffled = seededShuffle(emojis, random);

  // Take 5 emojis
  return shuffled.slice(0, 5);
}

export function selectLanguageOptions(
  correctLanguage: string,
  random: () => number
): string[] {
  // Get distractor languages (excluding English variants and the correct one)
  const availableLanguages = LANGUAGE_CODES.filter(
    (l) => l !== correctLanguage && l !== 'en' && l !== 'en-gb'
  );

  const shuffledLanguages = seededShuffle(availableLanguages, random);
  const distractors = shuffledLanguages.slice(0, 3);

  // Combine and shuffle options
  const options = [correctLanguage, ...distractors];
  return seededShuffle(options, random);
}

export async function generateDailyRounds(dayNumber: number): Promise<Round[]> {
  const emojis = selectDailyEmojis(dayNumber);
  const random = createSeededRandom(dayNumber + 1000); // Different seed for languages

  const rounds: Round[] = [];

  for (const emoji of emojis) {
    // Select a random language for this emoji
    const availableLanguages = LANGUAGE_CODES.filter(
      (l) => l !== 'en' && l !== 'en-gb'
    );
    const shuffledLangs = seededShuffle(availableLanguages, random);
    const correctLanguage = shuffledLangs[0];

    // Get the label in the target language
    const label = await getEmojiLabel(emoji.hexcode, correctLanguage);

    if (!label) {
      // Fallback if translation not found
      continue;
    }

    // Generate options
    const options = selectLanguageOptions(correctLanguage, random);

    rounds.push({
      emoji: emoji.emoji,
      hexcode: emoji.hexcode,
      correctLanguage,
      label,
      options,
    });
  }

  return rounds;
}
