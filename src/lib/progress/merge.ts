import type { CharacterProgress, ProgressState, UnitAttempt, UnitProgress } from "@/lib/progress/types";

function latest(left: string | null, right: string | null) {
  if (!left) return right;
  if (!right) return left;
  return left > right ? left : right;
}

function earlier(left: string | null, right: string | null) {
  if (!left) return right;
  if (!right) return left;
  return left < right ? left : right;
}

function mergeCharacter(left: CharacterProgress | undefined, right: CharacterProgress | undefined): CharacterProgress {
  if (!left) return right!;
  if (!right) return left;
  const recent = left.updatedAt >= right.updatedAt ? left : right;
  return {
    ...recent,
    recognitionAttempts: Math.max(left.recognitionAttempts, right.recognitionAttempts),
    recognitionCorrect: Math.max(left.recognitionCorrect, right.recognitionCorrect),
    typingAttempts: Math.max(left.typingAttempts, right.typingAttempts),
    typingCorrect: Math.max(left.typingCorrect, right.typingCorrect),
    drawingAttempts: Math.max(left.drawingAttempts, right.drawingAttempts),
    drawingCorrect: Math.max(left.drawingCorrect, right.drawingCorrect),
    timesShown: Math.max(left.timesShown, right.timesShown),
    lastPracticed: latest(left.lastPracticed, right.lastPracticed),
  };
}

function mergeUnit(left: UnitProgress | undefined, right: UnitProgress | undefined): UnitProgress {
  if (!left) return right!;
  if (!right) return left;
  return {
    unlocked: left.unlocked || right.unlocked,
    completed: left.completed || right.completed,
    bestAccuracy: Math.max(left.bestAccuracy, right.bestAccuracy),
    completedAt: earlier(left.completedAt, right.completedAt),
  };
}

function attemptKey(attempt: UnitAttempt) {
  return `${attempt.unitId}:${attempt.completedAt}`;
}

export function mergeProgressStates(local: ProgressState, cloud: ProgressState): ProgressState {
  const sessions = new Map<string, UnitAttempt>();
  [...local.sessions, ...cloud.sessions].forEach((attempt) => sessions.set(attemptKey(attempt), attempt));
  const activities = [...new Set([...local.profile.activityDates, ...cloud.profile.activityDates])].sort();
  return {
    schemaVersion: local.schemaVersion,
    profile: {
      createdAt: earlier(local.profile.createdAt, cloud.profile.createdAt) ?? local.profile.createdAt,
      lastActivityAt: latest(local.profile.lastActivityAt, cloud.profile.lastActivityAt),
      lastActiveUnitId: Math.max(local.profile.lastActiveUnitId, cloud.profile.lastActiveUnitId),
      activityDates: activities,
      lastSavedAt: latest(local.profile.lastSavedAt, cloud.profile.lastSavedAt) ?? local.profile.lastSavedAt,
    },
    characters: Object.fromEntries(Array.from(new Set([...Object.keys(local.characters), ...Object.keys(cloud.characters)]), (id) => [id, mergeCharacter(local.characters[id], cloud.characters[id])] as const)),
    units: Object.fromEntries(Array.from(new Set([...Object.keys(local.units), ...Object.keys(cloud.units)]), (id) => [id, mergeUnit(local.units[id], cloud.units[id])] as const)),
    sessions: [...sessions.values()].sort((left, right) => left.completedAt.localeCompare(right.completedAt)).slice(-100),
  };
}
