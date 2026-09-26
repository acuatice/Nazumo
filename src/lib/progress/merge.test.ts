import { describe, expect, it } from "vitest";
import { createInitialProgress } from "@/lib/progress/migrations";
import { mergeProgressStates } from "@/lib/progress/merge";

describe("mergeProgressStates", () => {
  it("preserves progress from both devices and de-duplicates a shared session", () => {
    const local = createInitialProgress("2026-09-26T09:00:00.000Z");
    const cloud = createInitialProgress("2026-09-25T09:00:00.000Z");
    local.profile.activityDates = ["2026-09-26"];
    cloud.profile.activityDates = ["2026-09-25", "2026-09-26"];
    local.profile.lastActiveUnitId = 2;
    cloud.profile.lastActiveUnitId = 3;
    local.units["2"] = { unlocked: true, completed: true, bestAccuracy: 0.9, completedAt: "2026-09-26T08:00:00.000Z" };
    cloud.units["3"] = { unlocked: true, completed: false, bestAccuracy: 0.5, completedAt: null };
    local.characters["hiragana:あ"] = { status: "learned", recognitionAttempts: 2, recognitionCorrect: 2, typingAttempts: 1, typingCorrect: 1, drawingAttempts: 0, drawingCorrect: 0, timesShown: 4, lastPracticed: "2026-09-26T08:00:00.000Z", updatedAt: "2026-09-26T08:00:00.000Z" };
    cloud.characters["hiragana:い"] = { ...local.characters["hiragana:あ"], status: "learning", updatedAt: "2026-09-25T08:00:00.000Z" };
    const attempt = { unitId: 1, completedAt: "2026-09-26T08:00:00.000Z", recognitionCorrect: 4, typingCorrect: 3, totalQuestions: 10, accuracy: 0.7, passed: false };
    local.sessions = [attempt];
    cloud.sessions = [attempt];

    const merged = mergeProgressStates(local, cloud);

    expect(merged.profile.lastActiveUnitId).toBe(3);
    expect(merged.profile.activityDates).toEqual(["2026-09-25", "2026-09-26"]);
    expect(merged.units["2"].completed).toBe(true);
    expect(merged.units["3"].unlocked).toBe(true);
    expect(merged.characters["hiragana:あ"].status).toBe("learned");
    expect(merged.characters["hiragana:い"]).toBeDefined();
    expect(merged.sessions).toEqual([attempt]);
  });

  it("keeps the newer character status while taking the highest attempt counters", () => {
    const local = createInitialProgress("2026-09-26T09:00:00.000Z");
    const cloud = createInitialProgress("2026-09-26T09:00:00.000Z");
    local.characters.a = { status: "review", recognitionAttempts: 3, recognitionCorrect: 2, typingAttempts: 0, typingCorrect: 0, drawingAttempts: 0, drawingCorrect: 0, timesShown: 4, lastPracticed: "2026-09-26T09:00:00.000Z", updatedAt: "2026-09-26T09:00:00.000Z" };
    cloud.characters.a = { ...local.characters.a, status: "learning", recognitionAttempts: 2, recognitionCorrect: 2, timesShown: 8, updatedAt: "2026-09-26T08:00:00.000Z" };

    const merged = mergeProgressStates(local, cloud);

    expect(merged.characters.a.status).toBe("review");
    expect(merged.characters.a.recognitionAttempts).toBe(3);
    expect(merged.characters.a.timesShown).toBe(8);
  });

  it("keeps the latest spaced-review schedule from either device and the highest lapse count", () => {
    const local = createInitialProgress("2026-09-26T09:00:00.000Z");
    const cloud = createInitialProgress("2026-09-26T09:00:00.000Z");
    local.vocabularyReview = { 水: { box: 0, dueAt: "2026-09-26T09:10:00.000Z", lastSeenAt: "2026-09-26T09:00:00.000Z", lapses: 2 } };
    cloud.vocabularyReview = { 水: { box: 2, dueAt: "2026-09-29T09:00:00.000Z", lastSeenAt: "2026-09-26T09:05:00.000Z", lapses: 1 }, 火: { box: 1, dueAt: "2026-09-27T09:05:00.000Z", lastSeenAt: "2026-09-26T09:05:00.000Z", lapses: 0 } };

    const merged = mergeProgressStates(local, cloud);

    expect(merged.vocabularyReview).toEqual({
      水: { box: 2, dueAt: "2026-09-29T09:00:00.000Z", lastSeenAt: "2026-09-26T09:05:00.000Z", lapses: 2 },
      火: cloud.vocabularyReview.火,
    });
  });
});
