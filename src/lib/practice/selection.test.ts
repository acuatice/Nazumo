import { describe, expect, it } from "vitest";
import { hiraganaCharacters } from "@/data/hiragana";
import type { LearningSnapshot } from "@/lib/progress/types";
import { selectProgressiveCharacters } from "@/lib/practice/selection";

function snapshot(overrides: Partial<LearningSnapshot> = {}): LearningSnapshot {
  return { introducedIds: [], learnedIds: [], reviewIds: [], completedUnitIds: [], currentUnitId: 1, recentAccuracy: null, streak: 0, sessionCount: 0, ...overrides };
}

describe("selectProgressiveCharacters", () => {
  it("never introduces characters that have not been studied", () => {
    const result = selectProgressiveCharacters(snapshot({ introducedIds: ["hiragana:あ", "hiragana:い"] }), hiraganaCharacters);
    expect(result.map((kana) => kana.character)).toEqual(["あ", "い"]);
  });

  it("limits a legacy profile with many introduced characters to five", () => {
    const introducedIds = hiraganaCharacters.map((kana) => `hiragana:${kana.character}`);
    const result = selectProgressiveCharacters(snapshot({ introducedIds }), hiraganaCharacters);
    expect(result).toHaveLength(5);
    expect(result.map((kana) => kana.character)).toEqual(["あ", "い", "う", "え", "お"]);
  });

  it("prioritizes review characters from the current unit", () => {
    const result = selectProgressiveCharacters(snapshot({ currentUnitId: 2, introducedIds: ["hiragana:あ", "hiragana:か", "hiragana:き", "hiragana:く"], learnedIds: ["hiragana:あ", "hiragana:か"], reviewIds: ["hiragana:あ", "hiragana:き"] }), hiraganaCharacters, 2);
    expect(result.map((kana) => kana.character)).toEqual(["き", "あ"]);
  });
});
