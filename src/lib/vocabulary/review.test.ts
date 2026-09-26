import { describe, expect, it } from "vitest";
import { vocabulary } from "@/data/vocabulary";
import { createVocabularyReviewState, rateVocabularyItem, selectVocabularyRound } from "@/lib/vocabulary/review";

describe("vocabulary review", () => {
  it("prioritizes overdue words, then adds unseen words up to the round limit", () => {
    const now = new Date("2026-09-26T10:00:00.000Z");
    const state = {
      items: {
        [vocabulary[0].japanese]: { box: 0, dueAt: "2026-09-25T10:00:00.000Z", lastSeenAt: "2026-09-24T10:00:00.000Z", lapses: 1 },
        [vocabulary[1].japanese]: { box: 2, dueAt: "2026-09-26T09:00:00.000Z", lastSeenAt: "2026-09-19T10:00:00.000Z", lapses: 0 },
        [vocabulary[2].japanese]: { box: 3, dueAt: "2026-09-27T10:00:00.000Z", lastSeenAt: "2026-09-20T10:00:00.000Z", lapses: 0 },
      },
    };

    const round = selectVocabularyRound(vocabulary, state, now, 3);

    expect(round.map((entry) => entry.japanese)).toEqual([vocabulary[0].japanese, vocabulary[1].japanese, vocabulary[3].japanese]);
  });

  it("spaces remembered words and brings difficult ones back soon", () => {
    const now = new Date("2026-09-26T10:00:00.000Z");
    const first = rateVocabularyItem(createVocabularyReviewState(), vocabulary[0], "remembered", now);
    expect(first.items[vocabulary[0].japanese].box).toBe(1);
    expect(first.items[vocabulary[0].japanese].dueAt).toBe("2026-09-27T10:00:00.000Z");

    const second = rateVocabularyItem(first, vocabulary[0], "remembered", now);
    expect(second.items[vocabulary[0].japanese].box).toBe(2);
    expect(second.items[vocabulary[0].japanese].dueAt).toBe("2026-09-29T10:00:00.000Z");

    const forgotten = rateVocabularyItem(second, vocabulary[0], "forgot", now);
    expect(forgotten.items[vocabulary[0].japanese].box).toBe(0);
    expect(forgotten.items[vocabulary[0].japanese].dueAt).toBe("2026-09-26T10:10:00.000Z");
    expect(forgotten.items[vocabulary[0].japanese].lapses).toBe(1);
  });
});
