export const PROGRESS_SCHEMA_VERSION = 1 as const;
export type CharacterLearningStatus = "new" | "learning" | "learned" | "review";
export type PracticeExercise = "recognition" | "typing" | "drawing";
export interface CharacterProgress { status: CharacterLearningStatus; recognitionAttempts: number; recognitionCorrect: number; typingAttempts: number; typingCorrect: number; drawingAttempts: number; drawingCorrect: number; timesShown: number; lastPracticed: string | null; updatedAt: string; }
export interface UnitProgress { unlocked: boolean; completed: boolean; bestAccuracy: number; completedAt: string | null; }
export interface UnitAttempt { unitId: number; completedAt: string; recognitionCorrect: number; typingCorrect: number; totalQuestions: number; accuracy: number; passed: boolean; }
export interface ProgressProfile { createdAt: string; lastActivityAt: string | null; lastActiveUnitId: number; activityDates: string[]; lastSavedAt: string; }
export interface VocabularyReviewItem { box: number; dueAt: string; lastSeenAt: string; lapses: number; }
export interface ProgressState { schemaVersion: typeof PROGRESS_SCHEMA_VERSION; profile: ProgressProfile; characters: Record<string, CharacterProgress>; units: Record<string, UnitProgress>; sessions: UnitAttempt[]; vocabularyReview?: Record<string, VocabularyReviewItem>; }
export interface LearningSnapshot { introducedIds: string[]; learnedIds: string[]; reviewIds: string[]; completedUnitIds: number[]; currentUnitId: number; recentAccuracy: number | null; streak: number; sessionCount: number; }
export interface StorageAdapter { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void; }
