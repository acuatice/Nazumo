import type { CharacterProgress, ProgressState, UnitAttempt, UnitProgress } from "@/lib/progress/types";

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const isCount = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
const isDateOrNull = (value: unknown) => value === null || typeof value === "string";

function isCharacter(value: unknown): value is CharacterProgress {
  if (!isRecord(value)) return false;
  return ["new", "learning", "learned", "review"].includes(String(value.status))
    && [value.recognitionAttempts, value.recognitionCorrect, value.typingAttempts, value.typingCorrect, value.drawingAttempts, value.drawingCorrect, value.timesShown].every(isCount)
    && isDateOrNull(value.lastPracticed)
    && typeof value.updatedAt === "string";
}

function isUnit(value: unknown): value is UnitProgress {
  return isRecord(value)
    && typeof value.unlocked === "boolean"
    && typeof value.completed === "boolean"
    && typeof value.bestAccuracy === "number" && Number.isFinite(value.bestAccuracy) && value.bestAccuracy >= 0 && value.bestAccuracy <= 1
    && isDateOrNull(value.completedAt);
}

function isAttempt(value: unknown): value is UnitAttempt {
  return isRecord(value)
    && isCount(value.unitId) && value.unitId > 0
    && typeof value.completedAt === "string"
    && isCount(value.recognitionCorrect) && isCount(value.typingCorrect) && isCount(value.totalQuestions)
    && typeof value.accuracy === "number" && Number.isFinite(value.accuracy) && value.accuracy >= 0 && value.accuracy <= 1
    && typeof value.passed === "boolean";
}

export function isSyncableProgressState(value: unknown): value is ProgressState {
  if (!isRecord(value) || value.schemaVersion !== 1 || !isRecord(value.profile) || !isRecord(value.characters) || !isRecord(value.units) || !Array.isArray(value.sessions)) return false;
  const profile = value.profile;
  return typeof profile.createdAt === "string"
    && isDateOrNull(profile.lastActivityAt)
    && isCount(profile.lastActiveUnitId) && profile.lastActiveUnitId > 0
    && Array.isArray(profile.activityDates) && profile.activityDates.length <= 10_000 && profile.activityDates.every((day) => typeof day === "string")
    && typeof profile.lastSavedAt === "string"
    && Object.values(value.characters).every(isCharacter)
    && Object.values(value.units).every(isUnit)
    && value.sessions.length <= 100 && value.sessions.every(isAttempt);
}
