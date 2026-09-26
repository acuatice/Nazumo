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
});
