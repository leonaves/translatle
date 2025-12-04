import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface CuratedEmoji {
  hexcode: string;
  emoji: string;
  englishLabel: string;
}

interface EmojibaseEmoji {
  label: string;
  hexcode: string;
  emoji: string;
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
  const curated: CuratedEmoji[] = JSON.parse(
    readFileSync(curatedPath, 'utf-8')
  );

  // Parse command line args
  const args = process.argv.slice(2);
  const searchTerm = args[0];
  const limit = parseInt(args[1]) || 20;

  if (!searchTerm) {
    console.log('Usage: npm run review:emojis <search-term> [limit]');
    console.log('Example: npm run review:emojis dog 10');
    console.log(
      '\nThis will show the emoji and its translations in all languages.'
    );
    return;
  }

  // Find matching emojis
  const matches = curated.filter(
    (e) =>
      e.englishLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.emoji === searchTerm
  );

  if (matches.length === 0) {
    console.log(`No emojis found matching "${searchTerm}"`);
    return;
  }

  console.log(`Found ${matches.length} matches (showing up to ${limit}):\n`);

  // Load all locale data
  const localeData: Record<string, Map<string, string>> = {};
  for (const locale of LOCALES) {
    const localePath = join(
      __dirname,
      `../node_modules/emojibase-data/${locale}/data.json`
    );
    try {
      const data: EmojibaseEmoji[] = JSON.parse(
        readFileSync(localePath, 'utf-8')
      );
      localeData[locale] = new Map(data.map((e) => [e.hexcode, e.label]));
    } catch {
      console.warn(`Could not load locale: ${locale}`);
    }
  }

  // Display matches with translations
  for (const emoji of matches.slice(0, limit)) {
    console.log(`${'='.repeat(60)}`);
    console.log(`${emoji.emoji}  ${emoji.englishLabel}`);
    console.log(`Hexcode: ${emoji.hexcode}`);
    console.log(`\nTranslations:`);

    for (const locale of LOCALES) {
      const label = localeData[locale]?.get(emoji.hexcode);
      if (label) {
        console.log(`  ${locale.padEnd(8)} ${label}`);
      }
    }
    console.log();
  }
}

main().catch(console.error);
