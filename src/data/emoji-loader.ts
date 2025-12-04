import type { CuratedEmoji } from '../types/emoji';
import curatedEmojis from './curated-emojis.json';
import emojiTranslations from './emoji-translations.json';

// Type for the translations map
type TranslationsMap = Record<string, Record<string, string>>;

const translations = emojiTranslations as TranslationsMap;

export function getCuratedEmojis(): CuratedEmoji[] {
  return curatedEmojis as CuratedEmoji[];
}

export function getEmojiLabel(
  hexcode: string,
  locale: string
): string | null {
  const emojiTranslations = translations[hexcode];
  if (!emojiTranslations) return null;
  return emojiTranslations[locale] ?? null;
}
