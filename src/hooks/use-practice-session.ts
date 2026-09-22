"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { createPracticeSession, createRecognitionOptions, isAnswerCorrect, reshuffleSession } from "@/lib/practice/session";
import { recordCharacterShown, recordPracticeAnswer } from "@/lib/practice/storage";
import type { Feedback, InteractionState, PracticeItem, PracticeStage } from "@/lib/practice/types";

const CORRECT_FEEDBACK_DELAY_MS = 550;

export function usePracticeSession(
  availableItems: readonly PracticeItem[],
  sessionSize: number,
  inputRef: RefObject<HTMLInputElement | null>,
) {
  const availableItemsRef = useRef(availableItems);
  useEffect(() => {
    availableItemsRef.current = availableItems;
  }, [availableItems]);
  // Snapshot updates must not restart an active session; future sessions use the latest pool.
  const [session, setSession] = useState<PracticeItem[]>([]);
  const [phaseItems, setPhaseItems] = useState<PracticeItem[]>([]);
  const [stage, setStage] = useState<PracticeStage>("loading");
  const [interaction, setInteraction] = useState<InteractionState>("question");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [recognitionScore, setRecognitionScore] = useState(0);
  const [typingScore, setTypingScore] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [needsReviewIds, setNeedsReviewIds] = useState<string[]>([]);

  const startNewSession = useCallback(() => {
    const items = availableItemsRef.current;
    const nextSession = createPracticeSession(items, sessionSize);
    setSession(nextSession);
    setPhaseItems(nextSession);
    setCurrentIndex(0);
    setAnswer("");
    setRecognitionScore(0);
    setTypingScore(0);
    setFeedback(null);
    setNeedsReviewIds([]);
    setInteraction("question");
    if (nextSession.length === 0) {
      setStage("complete");
      return;
    }
    setOptions(createRecognitionOptions(nextSession[0], items));
    recordCharacterShown(nextSession[0]);
    setStage("recognition");
  }, [sessionSize]);

  useEffect(() => {
    const initialization = window.setTimeout(startNewSession, 0);
    return () => window.clearTimeout(initialization);
  }, [startNewSession]);

  useEffect(() => {
    if (stage !== "typing" || interaction !== "question" || !window.matchMedia("(min-width: 768px)").matches) return;
    const focusFrame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(focusFrame);
  }, [currentIndex, inputRef, interaction, stage]);

  const markForReview = (item: PracticeItem) => {
    setNeedsReviewIds((ids) => ids.includes(item.id) ? ids : [...ids, item.id]);
  };

  const moveNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= phaseItems.length) {
      setFeedback(null);
      setInteraction("question");
      setStage(stage === "recognition" ? "transition" : "complete");
      return;
    }

    const nextItem = phaseItems[nextIndex];
    setCurrentIndex(nextIndex);
    setAnswer("");
    setFeedback(null);
    setInteraction("question");
    if (stage === "recognition") setOptions(createRecognitionOptions(nextItem, availableItemsRef.current));
    recordCharacterShown(nextItem);
  }, [currentIndex, phaseItems, stage]);

  useEffect(() => {
    if (interaction !== "feedback" || !feedback?.isCorrect) return;
    const nextQuestion = window.setTimeout(moveNext, CORRECT_FEEDBACK_DELAY_MS);
    return () => window.clearTimeout(nextQuestion);
  }, [feedback, interaction, moveNext]);

  const selectOption = (selectedAnswer: string) => {
    const currentItem = phaseItems[currentIndex];
    if (!currentItem || stage !== "recognition" || interaction !== "question") return;
    const correct = isAnswerCorrect(selectedAnswer, currentItem.acceptedAnswers);
    recordPracticeAnswer(currentItem, "recognition", correct);
    if (correct) setRecognitionScore((score) => score + 1);
    else markForReview(currentItem);
    setFeedback({ isCorrect: correct, correctAnswer: currentItem.displayAnswer, selectedAnswer });
    setInteraction("feedback");
  };

  const submitTypingAnswer = () => {
    const currentItem = phaseItems[currentIndex];
    if (!currentItem || stage !== "typing" || interaction !== "question" || answer.trim() === "") return;
    const correct = isAnswerCorrect(answer, currentItem.acceptedAnswers);
    recordPracticeAnswer(currentItem, "typing", correct);
    if (correct) setTypingScore((score) => score + 1);
    else markForReview(currentItem);
    setFeedback({ isCorrect: correct, correctAnswer: currentItem.displayAnswer, selectedAnswer: answer });
    setInteraction("feedback");
  };

  const beginTypingPhase = () => {
    const typingItems = reshuffleSession(session);
    setPhaseItems(typingItems);
    setCurrentIndex(0);
    setAnswer("");
    setFeedback(null);
    setInteraction("question");
    if (typingItems.length === 0) {
      setStage("complete");
      return;
    }
    recordCharacterShown(typingItems[0]);
    setStage("typing");
  };

  return {
    session,
    phaseItems,
    stage,
    interaction,
    currentIndex,
    currentItem: phaseItems[currentIndex],
    options,
    answer,
    setAnswer,
    recognitionScore,
    typingScore,
    feedback,
    needsReview: session.filter((item) => needsReviewIds.includes(item.id)),
    selectOption,
    submitTypingAnswer,
    moveNext,
    beginTypingPhase,
    startNewSession,
  };
}
