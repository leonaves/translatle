import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface EmojibaseEmoji {
  label: string;
  hexcode: string;
  emoji: string;
  group?: number;
  subgroup?: number;
  skins?: unknown[];
  version?: number;
}

interface CuratedEmoji {
  hexcode: string;
  emoji: string;
  englishLabel: string;
}

interface ExclusionList {
  hexcodes: string[];
}

// Emoji groups from emojibase (correct mapping)
// 0 = Smileys & Emotion
// 1 = People & Body
// 2 = Component (skin tones, etc - skip)
// 3 = Animals & Nature
// 4 = Food & Drink
// 5 = Travel & Places
// 6 = Activities
// 7 = Objects
// 8 = Symbols (skip)
// 9 = Flags (skip)

const INCLUDED_GROUPS = [0, 1, 3, 4, 5, 6, 7];
// Excluded: 2 (Component), 8 (Symbols), 9 (Flags)

async function main() {
  const dataPath = join(
    __dirname,
    '../node_modules/emojibase-data/en/data.json'
  );
  const excludedPath = join(__dirname, '../src/data/excluded-emojis.json');
  const outputPath = join(__dirname, '../src/data/curated-emojis.json');

  // Load English emoji data
  const emojiData: EmojibaseEmoji[] = JSON.parse(
    readFileSync(dataPath, 'utf-8')
  );

  // Load exclusion list if it exists
  let excluded: ExclusionList = { hexcodes: [] };
  if (existsSync(excludedPath)) {
    excluded = JSON.parse(readFileSync(excludedPath, 'utf-8'));
  } else {
    // Create empty exclusion file
    writeFileSync(excludedPath, JSON.stringify({ hexcodes: [] }, null, 2));
  }

  const excludedSet = new Set(excluded.hexcodes);

  // Filter emojis
  const curated: CuratedEmoji[] = emojiData
    .filter((emoji) => {
      // Must have a group
      if (emoji.group === undefined) return false;

      // Must be in included groups
      if (!INCLUDED_GROUPS.includes(emoji.group)) return false;

      // Skip if explicitly excluded
      if (excludedSet.has(emoji.hexcode)) return false;

      // Skip skin tone variants
      if (emoji.hexcode.includes('-1F3F')) return false;

      // Skip ZWJ sequences that are very long (complex combinations)
      if (emoji.hexcode.split('-').length > 3) return false;

      return true;
    })
    .map((emoji) => ({
      hexcode: emoji.hexcode,
      emoji: emoji.emoji,
      englishLabel: emoji.label,
    }));

  // Write output
  writeFileSync(outputPath, JSON.stringify(curated, null, 2));

  console.log(`Generated ${curated.length} curated emojis`);
  console.log(`Excluded ${excludedSet.size} emojis from exclusion list`);
  console.log(`Output written to: ${outputPath}`);

  // Show breakdown by group
  const groupCounts: Record<number, number> = {};
  emojiData.forEach((e) => {
    if (e.group !== undefined && INCLUDED_GROUPS.includes(e.group)) {
      groupCounts[e.group] = (groupCounts[e.group] || 0) + 1;
    }
  });

  console.log('\nEmoji counts by group (before filtering):');
  const groupNames: Record<number, string> = {
    0: 'Smileys & Emotion',
    1: 'People & Body',
    3: 'Animals & Nature',
    4: 'Food & Drink',
    5: 'Travel & Places',
    6: 'Activities',
    7: 'Objects',
  };
  INCLUDED_GROUPS.forEach((g) => {
    console.log(`  ${groupNames[g]}: ${groupCounts[g] || 0}`);
  });
}

main().catch(console.error);
