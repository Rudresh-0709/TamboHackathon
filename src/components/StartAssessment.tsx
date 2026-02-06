import { Play } from "lucide-react";
import { QuestionCard } from "./core/QuestionCard";
import { useTamboThreadInput } from "@tambo-ai/react";

export function StartAssessment({ topic = "your chosen topic" }: { topic?: string }) {
    const { submit } = useTamboThreadInput();

    return (
        <QuestionCard title={`Ready for ${topic}?`}>
            <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 fill-current" />
                </div>

                <p className="text-muted-foreground">
                    I've prepared a quick adaptive assessment to test your knowledge on
                    <span className="font-semibold text-foreground"> {topic}</span>.
                </p>

                <button
                    onClick={() => submit({ additionalContext: { message: "I am ready. Please give me the first question." } })}
                    className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25"
                >
                    Start Assessment
                </button>
            </div>
        </QuestionCard>
    );
}
