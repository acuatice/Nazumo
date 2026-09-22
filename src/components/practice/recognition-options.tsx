import type { Feedback } from "@/lib/practice/types";
import { ExerciseOption, type ExerciseOptionState } from "@/components/ui/exercise-option";

interface RecognitionOptionsProps {
  options: readonly string[];
  feedback: Feedback | null;
  onSelect: (answer: string) => void;
}

export function RecognitionOptions({ options, feedback, onSelect }: RecognitionOptionsProps) {
  return (
    <div key={options.join(":")} className="grid grid-cols-2 gap-3">
      {options.map((option, index) => {
        const isCorrect = feedback?.correctAnswer === option;
        const isSelectedWrong = feedback && !feedback.isCorrect && feedback.selectedAnswer === option;
        const state: ExerciseOptionState = isCorrect ? "correct" : isSelectedWrong ? "incorrect" : feedback ? "disabled" : "idle";

        return (
          <ExerciseOption key={option} state={state} style={{ animationDelay: `${index * 55}ms` }} onClick={() => onSelect(option)} disabled={Boolean(feedback)}>
            {option}
          </ExerciseOption>
        );
      })}
    </div>
  );
}
