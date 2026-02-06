import { QuestionCard } from "./core/QuestionCard";
import { Trophy, RefreshCcw } from "lucide-react";
import { useTambo } from "@tambo-ai/react";

interface AssessmentResultProps {
    score?: number;
    total?: number;
    summary?: string;
}

export function AssessmentResult({ score = 0, total = 0, summary = "Assessment completed." }: AssessmentResultProps) {
    const { speak } = useTambo();
    const percentage = Math.round((score / total) * 100);

    return (
        <QuestionCard className="text-center">
            <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-bounce">
                    <Trophy className="w-12 h-12 text-primary" />
                </div>
            </div>

            <h2 className="text-3xl font-bold mb-2">Assessment Complete!</h2>
            <p className="text-muted-foreground mb-8">Here is how you performed</p>

            <div className="text-6xl font-black text-foreground mb-4 tabular-nums">
                {percentage}%
            </div>

            <p className="text-lg mb-8 max-w-md mx-auto text-muted-foreground">
                You scored <span className="font-bold text-foreground">{score}</span> out of <span className="font-bold text-foreground">{total}</span>.
            </p>

            <div className="p-6 rounded-xl bg-muted/30 text-left mb-8">
                <h3 className="font-semibold mb-2">Summary</h3>
                <p className="text-muted-foreground leading-relaxed">
                    {summary}
                </p>
            </div>

            <button
                onClick={() => speak("Start a new assessment about a different topic")}
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all hover:scale-105 active:scale-95"
            >
                <RefreshCcw className="w-4 h-4" />
                Start New Assessment
            </button>
        </QuestionCard>
    );
}
