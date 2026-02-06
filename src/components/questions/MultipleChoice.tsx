import { useState } from "react";
import { QuestionCard } from "../core/QuestionCard";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface MultipleChoiceProps {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
    onSubmit: (isCorrect: boolean) => void;
}

export function MultipleChoice({ question, options, correctAnswer, explanation, onSubmit }: MultipleChoiceProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (!selected || submitted) return;
        setSubmitted(true);
        onSubmit(selected === correctAnswer);
    };

    return (
        <QuestionCard title={question}>
            <div className="space-y-3">
                {options.map((option) => {
                    const isSelected = selected === option;
                    const isCorrect = option === correctAnswer;
                    const showCorrect = submitted && isCorrect;
                    const showIncorrect = submitted && isSelected && !isCorrect;

                    return (
                        <button
                            key={option}
                            onClick={() => !submitted && setSelected(option)}
                            disabled={submitted}
                            className={cn(
                                "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between",
                                !submitted && "hover:border-primary hover:bg-muted/50",
                                isSelected && !submitted && "border-primary bg-primary/10 ring-1 ring-primary",
                                showCorrect && "border-green-500 bg-green-500/10 text-green-500",
                                showIncorrect && "border-red-500 bg-red-500/10 text-red-500",
                                !isSelected && submitted && "opacity-50"
                            )}
                        >
                            <span>{option}</span>
                            {showCorrect && <Check className="w-5 h-5 text-green-500" />}
                            {showIncorrect && <X className="w-5 h-5 text-red-500" />}
                        </button>
                    );
                })}
            </div>

            {!submitted && (
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={!selected}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        Submit Answer
                    </button>
                </div>
            )}

            {submitted && explanation && (
                <div className="mt-6 p-4 rounded-lg bg-muted text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2">
                    <span className="font-semibold block mb-1">Explanation:</span>
                    {explanation}
                </div>
            )}
        </QuestionCard>
    );
}
