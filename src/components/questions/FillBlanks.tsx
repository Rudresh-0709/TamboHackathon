import { useState } from "react";
import { QuestionCard } from "../core/QuestionCard";
import { cn } from "@/lib/utils";

interface FillBlanksProps {
    sentence: string;
    blanks: string[];
    onSubmit: (isCorrect: boolean) => void;
}

export function FillBlanks({ sentence, blanks, onSubmit }: FillBlanksProps) {
    const [inputs, setInputs] = useState<string[]>(new Array(blanks.length).fill(""));
    const [submitted, setSubmitted] = useState(false);

    // Split sentence by placeholders (assuming specific format like ___ or just handle logical splitting?)
    // For simplicity, let's assume the component will just render inputs. 
    // Wait, the "sentence" usually contains the context. Let's assume the sentence has `___` for blanks.

    const parts = sentence.split("___");

    const handleSubmit = () => {
        if (submitted) return;
        setSubmitted(true);
        const isCorrect = inputs.every((input, i) => input.toLowerCase().trim() === blanks[i].toLowerCase().trim());
        onSubmit(isCorrect);
    };

    return (
        <QuestionCard title="Fill in the blanks">
            <div className="text-lg leading-loose">
                {parts.map((part, index) => (
                    <span key={index}>
                        {part}
                        {index < parts.length - 1 && (
                            <span className="relative inline-block mx-1">
                                <input
                                    type="text"
                                    value={inputs[index]}
                                    onChange={(e) => {
                                        const newInputs = [...inputs];
                                        newInputs[index] = e.target.value;
                                        setInputs(newInputs);
                                    }}
                                    disabled={submitted}
                                    className={cn(
                                        "w-32 border-b-2 bg-transparent text-center focus:outline-none focus:border-primary px-1",
                                        submitted && inputs[index].toLowerCase().trim() === blanks[index].toLowerCase().trim()
                                            ? "border-green-500 text-green-500"
                                            : submitted
                                                ? "border-red-500 text-red-500"
                                                : "border-muted-foreground"
                                    )}
                                />
                                {submitted && inputs[index].toLowerCase().trim() !== blanks[index].toLowerCase().trim() && (
                                    <div className="absolute top-full left-0 w-full text-center text-xs text-green-500 mt-1">
                                        {blanks[index]}
                                    </div>
                                )}
                            </span>
                        )}
                    </span>
                ))}
            </div>

            {!submitted && (
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={inputs.some(i => !i)}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        Check Answers
                    </button>
                </div>
            )}
        </QuestionCard>
    );
}
