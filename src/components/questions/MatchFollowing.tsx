import { useState } from "react";
import { QuestionCard } from "../core/QuestionCard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MatchFollowingProps {
    pairs?: { left: string; right: string }[];
    onSubmit: (isCorrect: boolean) => void;
}

export function MatchFollowing({ pairs = [], onSubmit }: MatchFollowingProps) {
    const [leftItems] = useState(() => pairs.map(p => p.left).sort(() => Math.random() - 0.5));
    const [rightItems] = useState(() => pairs.map(p => p.right).sort(() => Math.random() - 0.5));

    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [matches, setMatches] = useState<Record<string, string>>({}); // left -> right
    const [submitted, setSubmitted] = useState(false);

    const handleLeftClick = (item: string) => {
        if (submitted || matches[item]) return;
        setSelectedLeft(item);
    };

    const handleRightClick = (rightItem: string) => {
        if (submitted || !selectedLeft) return;
        // Check if this right item is already matched
        if (Object.values(matches).includes(rightItem)) return;

        setMatches(prev => ({ ...prev, [selectedLeft]: rightItem }));
        setSelectedLeft(null);
    };

    const handleSubmit = () => {
        setSubmitted(true);
        const isCorrect = pairs.every(p => matches[p.left] === p.right);
        onSubmit(isCorrect);
    };

    return (
        <QuestionCard title="Match the following pairs">
            <div className="flex gap-8 justify-between relative">
                {/* Left Column */}
                <div className="flex-1 space-y-4">
                    {leftItems.map(item => {
                        const isMatched = !!matches[item];
                        const isSelected = selectedLeft === item;

                        return (
                            <motion.button
                                key={item}
                                layoutId={`left-${item}`}
                                onClick={() => handleLeftClick(item)}
                                disabled={isMatched || submitted}
                                className={cn(
                                    "w-full p-4 rounded-xl border text-left transition-all relative z-10",
                                    isSelected ? "border-primary ring-1 ring-primary bg-primary/10" : "bg-card hover:border-primary/50",
                                    isMatched ? "border-muted-foreground/50 opacity-80" : "border-border"
                                )}
                            >
                                {item}
                                {isMatched && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full translate-x-1/2" />}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Right Column */}
                <div className="flex-1 space-y-4">
                    {rightItems.map(item => {
                        const isMatched = Object.values(matches).includes(item);
                        // find which left item matched this
                        const matchedLeft = Object.keys(matches).find(key => matches[key] === item);
                        const isCorrect = submitted && matchedLeft && pairs.find(p => p.left === matchedLeft)?.right === item;
                        const isWrong = submitted && matchedLeft && !isCorrect;

                        return (
                            <button
                                key={item}
                                onClick={() => handleRightClick(item)}
                                disabled={isMatched || submitted}
                                className={cn(
                                    "w-full p-4 rounded-xl border text-left transition-all",
                                    isMatched ? "bg-muted" : "bg-card hover:border-primary/50",
                                    isCorrect ? "border-green-500 ring-1 ring-green-500 bg-green-500/10" : "",
                                    isWrong ? "border-red-500 ring-1 ring-red-500 bg-red-500/10" : ""
                                )}
                            >
                                {item}
                            </button>
                        );
                    })}
                </div>

                {/* Connection Lines (Simulated purely visually for now or using SVG later if complex) */}
                {/* For MVP, we just highlight matches. A robust implementation would draw SVG lines. */}
            </div>

            {!submitted && Object.keys(matches).length === pairs.length && (
                <div className="mt-8 flex justify-end">
                    <button onClick={handleSubmit} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
                        Finish Matching
                    </button>
                </div>
            )}
        </QuestionCard>
    );
}
