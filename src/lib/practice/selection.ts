import { getHiraganaUnit } from "@/data/hiragana-curriculum";
import type { KanaCharacter } from "@/lib/types";
import type { LearningSnapshot } from "@/lib/progress/types";

export const QUICK_PRACTICE_SIZE = 5;

function characterId(character: KanaCharacter): string {
  return `hiragana:${character.character}`;
}

export function selectProgressiveCharacters(
  snapshot: LearningSnapshot,
  characters: readonly KanaCharacter[],
  limit = QUICK_PRACTICE_SIZE,
): KanaCharacter[] {
  if (limit <= 0) return [];

  const currentUnitIds = new Set(
    (getHiraganaUnit(snapshot.currentUnitId)?.characters ?? []).map(characterId),
  );
  const reviewIds = new Set(snapshot.reviewIds);
  const learnedIds = new Set(snapshot.learnedIds);
  const introducedIds = new Set(snapshot.introducedIds);

  const priorities = [
    (kana: KanaCharacter) => currentUnitIds.has(characterId(kana)) && reviewIds.has(characterId(kana)),
    (kana: KanaCharacter) => reviewIds.has(characterId(kana)),
    (kana: KanaCharacter) => currentUnitIds.has(characterId(kana)) && learnedIds.has(characterId(kana)),
    (kana: KanaCharacter) => currentUnitIds.has(characterId(kana)) && introducedIds.has(characterId(kana)),
    (kana: KanaCharacter) => learnedIds.has(characterId(kana)),
    (kana: KanaCharacter) => introducedIds.has(characterId(kana)),
  ];

  const selected: KanaCharacter[] = [];
  const selectedIds = new Set<string>();
  for (const matches of priorities) {
    for (const kana of characters) {
      const id = characterId(kana);
      if (selectedIds.has(id) || !matches(kana)) continue;
      selected.push(kana);
      selectedIds.add(id);
      if (selected.length === limit) return selected;
    }
  }
  return selected;
}
