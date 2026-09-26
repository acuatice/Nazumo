import { describe, expect, it } from "vitest";
import { createCharacterProgress, createInitialProgress } from "@/lib/progress/migrations";
import { isSyncableProgressState } from "@/lib/progress/sync-validation";

describe("isSyncableProgressState", () => {
  it("accepts a complete current snapshot", () => {
    const state = createInitialProgress("2026-09-26T09:00:00.000Z");
    state.characters["hiragana:あ"] = createCharacterProgress("2026-09-26T09:00:00.000Z");
    expect(isSyncableProgressState(state)).toBe(true);
  });

  it("rejects malformed nested data before it can enter cloud storage", () => {
    const state = createInitialProgress("2026-09-26T09:00:00.000Z");
    const malformed = { ...state, profile: { ...state.profile, activityDates: null } };
    expect(isSyncableProgressState(malformed)).toBe(false);
    expect(isSyncableProgressState({ schemaVersion: 1, profile: {}, characters: {}, units: {}, sessions: [] })).toBe(false);
  });

  it("validates synced spaced-review entries and their timestamps", () => {
    const valid = createInitialProgress("2026-09-26T09:00:00.000Z");
    valid.vocabularyReview = { 水: { box: 2, dueAt: "2026-09-29T09:00:00.000Z", lastSeenAt: "2026-09-26T09:00:00.000Z", lapses: 1 } };
    expect(isSyncableProgressState(valid)).toBe(true);
    expect(isSyncableProgressState({ ...valid, vocabularyReview: { 水: { ...valid.vocabularyReview.水, dueAt: "mañana" } } })).toBe(false);
  });
});
