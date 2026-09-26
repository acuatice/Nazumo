"use client";
import type { HiraganaUnit } from "@/data/hiragana-curriculum";
import type { PracticeItem } from "@/lib/practice/types";
import { ProgressRepository, PROGRESS_EVENT, selectLearningSnapshot } from "@/lib/progress/repository";
import type { CharacterLearningStatus, PracticeExercise, ProgressState, StorageAdapter } from "@/lib/progress/types";

let repository: ProgressRepository | null = null;
const memoryValues = new Map<string, string>();
const memoryStorage: StorageAdapter = {
  getItem: (key) => memoryValues.get(key) ?? null,
  setItem: (key, value) => memoryValues.set(key, value),
  removeItem: (key) => memoryValues.delete(key),
};

function getBrowserStorage(): StorageAdapter {
  try {
    return window.localStorage ?? memoryStorage;
  } catch {
    return memoryStorage;
  }
}

export function getProgressRepository() { if (typeof window === "undefined") return null; repository ??= new ProgressRepository(getBrowserStorage()); return repository; }
function notify() { window.dispatchEvent(new Event(PROGRESS_EVENT)); }
export function loadProgress(): ProgressState | null { return getProgressRepository()?.loadProgress() ?? null; }
export function replaceProgress(progress: ProgressState) { const result = getProgressRepository()?.saveProgress(progress) ?? null; if (result) notify(); return result; }
export function updateCharacterProgress(item: PracticeItem, exercise: PracticeExercise, correct: boolean) { const result = getProgressRepository()?.updateCharacterProgress(item.id, { kind: exercise, correct }); if (result) notify(); return result; }
// Showing a prompt only updates a display counter, not the learning snapshot used by subscribers.
export function recordCharacterShown(item: PracticeItem) { return getProgressRepository()?.recordCharacterShown(item.id); }
export function introduceCharacter(character: string, unitId?: number) { const result = getProgressRepository()?.introduceCharacter(`hiragana:${character}`, unitId); if (result) notify(); return result; }
export function setCharacterStatus(id: string, status: CharacterLearningStatus) { const result = getProgressRepository()?.setCharacterStatus(id, status); if (result) notify(); return result; }
export function recordPracticeResult(unit: HiraganaUnit, recognitionCorrect: number, typingCorrect: number) { const result = getProgressRepository()?.recordPracticeResult(unit, recognitionCorrect, typingCorrect); if (result) notify(); return result; }
export function getLearningSnapshot() { const progress = loadProgress(); return progress ? selectLearningSnapshot(progress) : null; }
