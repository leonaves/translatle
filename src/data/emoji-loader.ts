import type { Emoji, CuratedEmoji } from '../types/emoji';
import curatedEmojis from './curated-emojis.json';

const languageCache = new Map<string, Map<string, Emoji>>();

export function getCuratedEmojis(): CuratedEmoji[] {
  return curatedEmojis as CuratedEmoji[];
}

export async function loadLanguageData(
  locale: string
): Promise<Map<string, Emoji>> {
  if (languageCache.has(locale)) {
    return languageCache.get(locale)!;
  }

  // Dynamic import from emojibase-data
  const data = (await import(`emojibase-data/${locale}/data.json`))
    .default as Emoji[];
  const emojiMap = new Map(data.map((e) => [e.hexcode, e]));
  languageCache.set(locale, emojiMap);
  return emojiMap;
}

export async function getEmojiLabel(
  hexcode: string,
  locale: string
): Promise<string | null> {
  const data = await loadLanguageData(locale);
  const emoji = data.get(hexcode);
  return emoji?.label ?? null;
}
