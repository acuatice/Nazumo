import type { VocabularyEntry } from "@/data/vocabulary";

export const VOCABULARY_ROUND_SIZE = 5;
const KEY = "nazumo:vocabulary-review";
const INTERVAL_DAYS = [1, 3, 7, 14, 30] as const;
const FORGOT_DELAY_MINUTES = 10;

export type VocabularyReviewItem = {
  box: number;
  dueAt: string;
  lastSeenAt: string;
  lapses: number;
};

export type VocabularyReviewState = {
  items: Record<string, VocabularyReviewItem>;
};

export type VocabularyRating = "remembered" | "forgot";

export function createVocabularyReviewState(): VocabularyReviewState {
  return { items: {} };
}

export function readVocabularyReviewState(storage: Pick<Storage, "getItem">): VocabularyReviewState {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return createVocabularyReviewState();
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null || !("items" in value) || typeof value.items !== "object" || value.items === null || Array.isArray(value.items)) return createVocabularyReviewState();
    const items: Record<string, VocabularyReviewItem> = {};
    for (const [id, item] of Object.entries(value.items)) {
      if (typeof item !== "object" || item === null || !("box" in item) || !("dueAt" in item) || !("lastSeenAt" in item) || !("lapses" in item)) continue;
      if (typeof item.box !== "number" || !Number.isInteger(item.box) || item.box < 0 || item.box > INTERVAL_DAYS.length - 1 || typeof item.dueAt !== "string" || typeof item.lastSeenAt !== "string" || typeof item.lapses !== "number" || !Number.isInteger(item.lapses) || item.lapses < 0) continue;
      items[id] = { box: item.box, dueAt: item.dueAt, lastSeenAt: item.lastSeenAt, lapses: item.lapses };
    }
    return { items };
  } catch {
    return createVocabularyReviewState();
  }
}

export function writeVocabularyReviewState(storage: Pick<Storage, "setItem">, state: VocabularyReviewState) {
  try { storage.setItem(KEY, JSON.stringify(state)); return true; }
  catch { return false; }
}

export function selectVocabularyRound(
  entries: readonly VocabularyEntry[],
  state: VocabularyReviewState,
  now = new Date(),
  limit = VOCABULARY_ROUND_SIZE,
) {
  if (limit <= 0) return [];
  const nowTime = now.getTime();
  const due = entries
    .filter((entry) => state.items[entry.japanese] && Date.parse(state.items[entry.japanese].dueAt) <= nowTime)
    .sort((left, right) => Date.parse(state.items[left.japanese].dueAt) - Date.parse(state.items[right.japanese].dueAt));
  const unseen = entries.filter((entry) => !state.items[entry.japanese]);
  return [...due, ...unseen].slice(0, limit);
}

export function rateVocabularyItem(
  state: VocabularyReviewState,
  entry: VocabularyEntry,
  rating: VocabularyRating,
  now = new Date(),
): VocabularyReviewState {
  const previous = state.items[entry.japanese];
  const box = rating === "remembered" ? Math.min((previous?.box ?? 0) + 1, INTERVAL_DAYS.length - 1) : 0;
  const due = new Date(now);
  if (rating === "remembered") due.setDate(due.getDate() + INTERVAL_DAYS[Math.max(0, box - 1)]);
  else due.setMinutes(due.getMinutes() + FORGOT_DELAY_MINUTES);
  return {
    items: {
      ...state.items,
      [entry.japanese]: {
        box,
        dueAt: due.toISOString(),
        lastSeenAt: now.toISOString(),
        lapses: (previous?.lapses ?? 0) + (rating === "forgot" ? 1 : 0),
      },
    },
  };
}

export function countDueVocabulary(state: VocabularyReviewState, now = new Date()) {
  return Object.values(state.items).filter((item) => Date.parse(item.dueAt) <= now.getTime()).length;
}

export function countKnownVocabulary(state: VocabularyReviewState) {
  return Object.values(state.items).filter((item) => item.box >= 2).length;
}
