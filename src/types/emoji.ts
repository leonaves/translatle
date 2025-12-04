export interface Emoji {
  label: string;
  hexcode: string;
  emoji: string;
  tags?: string[];
  group?: number;
  subgroup?: number;
  version?: number;
}

export interface CuratedEmoji {
  hexcode: string;
  emoji: string;
  englishLabel: string;
}
