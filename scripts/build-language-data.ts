import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface EmojibaseEmoji {
  label: string;
  hexcode: string;
  emoji: string;
}

interface CuratedEmoji {
  hexcode: string;
  emoji: string;
  englishLabel: string;
}

const LOCALES = [
  'bn',
  'zh',
  'zh-hant',
  'da',
  'nl',
  'et',
  'fi',
  'fr',
  'de',
  'hi',
  'hu',
  'it',
  'ja',
  'ko',
  'lt',
  'ms',
  'nb',
  'pl',
  'pt',
  'ru',
  'es',
  'es-mx',
  'sv',
  'th',
  'uk',
];

async function main() {
  const curatedPath = join(__dirname, '../src/data/curated-emojis.json');
  const outputPath = join(__dirname, '../src/data/emoji-translations.json');

  // Load curated emojis
  const curated: CuratedEmoji[] = JSON.parse(
    readFileSync(curatedPath, 'utf-8')
  );
  const curatedHexcodes = new Set(curated.map((e) => e.hexcode));

  // Build translations map: { hexcode: { locale: label } }
  const translations: Record<string, Record<string, string>> = {};

  for (const locale of LOCALES) {
    const localePath = join(
      __dirname,
      `../node_modules/emojibase-data/${locale}/data.json`
    );

    try {
      const data: EmojibaseEmoji[] = JSON.parse(
        readFileSync(localePath, 'utf-8')
      );

      for (const emoji of data) {
        if (curatedHexcodes.has(emoji.hexcode)) {
          if (!translations[emoji.hexcode]) {
            translations[emoji.hexcode] = {};
          }
          translations[emoji.hexcode][locale] = emoji.label;
        }
      }

      console.log(`Loaded ${locale}: ${data.length} emojis`);
    } catch (err) {
      console.error(`Failed to load ${locale}:`, err);
    }
  }

  // Write output
  writeFileSync(outputPath, JSON.stringify(translations, null, 2));

  console.log(`\nGenerated translations for ${Object.keys(translations).length} emojis`);
  console.log(`Output written to: ${outputPath}`);
}

main().catch(console.error);
