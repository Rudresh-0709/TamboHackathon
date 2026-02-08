import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { QuestionCard } from "../core/QuestionCard";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface MatchFollowingProps {
    pairs?: { left?: string; right?: string }[];
    onSubmit: (isCorrect: boolean) => void;
}

interface ConnectionLine {
    leftIndex: number;
    rightIndex: number;
    color: string;
}

export function MatchFollowing({ pairs = [], onSubmit }: MatchFollowingProps) {
    // Filter out invalid pairs
    const validPairs = useMemo(() =>
        pairs.filter(p => p.left && p.right) as { left: string; right: string }[],
        [pairs]
    );

    // Use useMemo with a stable shuffle based on pairs content
    const { leftItems, rightItems } = useMemo(() => {
        if (validPairs.length === 0) {
            return { leftItems: [], rightItems: [] };
        }
        const left = [...validPairs.map(p => p.left)].sort(() => Math.random() - 0.5);
        const right = [...validPairs.map(p => p.right)].sort(() => Math.random() - 0.5);
        return { leftItems: left, rightItems: right };
    }, [JSON.stringify(validPairs)]);

    const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
    const [matches, setMatches] = useState<Record<number, number>>({}); // leftIndex -> rightIndex
    const [submitted, setSubmitted] = useState(false);

    // Refs for measuring positions
    const containerRef = useRef<HTMLDivElement>(null);
    const leftRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const rightRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [lines, setLines] = useState<ConnectionLine[]>([]);

    // Colors for different connections
    const connectionColors = [
        "#3b82f6", // blue
        "#8b5cf6", // violet
        "#ec4899", // pink
        "#f97316", // orange
        "#10b981", // emerald
        "#6366f1", // indigo
    ];

    // Calculate line positions
    const updateLines = useCallback(() => {
        if (!containerRef.current) return;


        const newLines: ConnectionLine[] = [];

        Object.entries(matches).forEach(([leftIdx, rightIdx], matchIndex) => {
            const leftEl = leftRefs.current[parseInt(leftIdx)];
            const rightEl = rightRefs.current[rightIdx];

            if (leftEl && rightEl) {
                newLines.push({
                    leftIndex: parseInt(leftIdx),
                    rightIndex: rightIdx,
                    color: connectionColors[matchIndex % connectionColors.length],
                });
            }
        });

        setLines(newLines);
    }, [matches]);

    useEffect(() => {
        updateLines();
        window.addEventListener('resize', updateLines);
        return () => window.removeEventListener('resize', updateLines);
    }, [updateLines]);

    const handleLeftClick = (index: number) => {
        if (submitted) return;
        // If already matched, allow removing the match
        if (matches[index] !== undefined) {
            removeMatch(index);
            return;
        }
        setSelectedLeft(selectedLeft === index ? null : index);
    };

    const handleRightClick = (index: number) => {
        if (submitted || selectedLeft === null) return;
        // Check if this right item is already matched
        if (Object.values(matches).includes(index)) return;

        setMatches(prev => ({ ...prev, [selectedLeft]: index }));
        setSelectedLeft(null);
    };

    const removeMatch = (leftIndex: number) => {
        if (submitted) return;
        setMatches(prev => {
            const newMatches = { ...prev };
            delete newMatches[leftIndex];
            return newMatches;
        });
    };

    const handleSubmit = () => {
        setSubmitted(true);
        const isCorrect = leftItems.every((leftItem, leftIdx) => {
            const rightIdx = matches[leftIdx];
            if (rightIdx === undefined) return false;
            const rightItem = rightItems[rightIdx];
            return validPairs.some(p => p.left === leftItem && p.right === rightItem);
        });
        onSubmit(isCorrect);
    };

    // Get line coordinates
    const getLineCoords = (leftIndex: number, rightIndex: number) => {
        const leftEl = leftRefs.current[leftIndex];
        const rightEl = rightRefs.current[rightIndex];
        const container = containerRef.current;

        if (!leftEl || !rightEl || !container) return null;

        const containerRect = container.getBoundingClientRect();
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();

        return {
            x1: leftRect.right - containerRect.left,
            y1: leftRect.top + leftRect.height / 2 - containerRect.top,
            x2: rightRect.left - containerRect.left,
            y2: rightRect.top + rightRect.height / 2 - containerRect.top,
        };
    };

    // Show loading state if no pairs
    if (leftItems.length === 0) {
        return (
            <QuestionCard title="Match the following pairs">
                <div className="text-center text-muted-foreground py-8">
                    Loading matching pairs...
                </div>
            </QuestionCard>
        );
    }

    return (
        <QuestionCard title="Match the following pairs">
            <p className="text-sm text-muted-foreground mb-4">
                Click an item on the left, then click its match on the right. Click a matched item to remove the connection.
            </p>

            <div ref={containerRef} className="relative">
                {/* SVG Layer for Connection Lines */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-0"
                    style={{ overflow: 'visible' }}
                >
                    {lines.map((line) => {
                        const coords = getLineCoords(line.leftIndex, line.rightIndex);
                        if (!coords) return null;

                        const isCorrect = submitted && validPairs.some(p =>
                            p.left === leftItems[line.leftIndex] &&
                            p.right === rightItems[line.rightIndex]
                        );
                        const isWrong = submitted && !isCorrect;

                        return (
                            <g key={`line-${line.leftIndex}-${line.rightIndex}`}>
                                {/* Shadow/glow effect */}
                                <line
                                    x1={coords.x1}
                                    y1={coords.y1}
                                    x2={coords.x2}
                                    y2={coords.y2}
                                    stroke={isCorrect ? "#22c55e" : isWrong ? "#ef4444" : line.color}
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    opacity="0.3"
                                />
                                {/* Main line */}
                                <line
                                    x1={coords.x1}
                                    y1={coords.y1}
                                    x2={coords.x2}
                                    y2={coords.y2}
                                    stroke={isCorrect ? "#22c55e" : isWrong ? "#ef4444" : line.color}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    className="transition-all duration-300"
                                />
                                {/* Connection dots */}
                                <circle
                                    cx={coords.x1}
                                    cy={coords.y1}
                                    r="6"
                                    fill={isCorrect ? "#22c55e" : isWrong ? "#ef4444" : line.color}
                                />
                                <circle
                                    cx={coords.x2}
                                    cy={coords.y2}
                                    r="6"
                                    fill={isCorrect ? "#22c55e" : isWrong ? "#ef4444" : line.color}
                                />
                            </g>
                        );
                    })}
                </svg>

                <div className="flex gap-12 justify-between relative z-10">
                    {/* Left Column */}
                    <div className="flex-1 space-y-3">
                        {leftItems.map((item, index) => {
                            const isMatched = matches[index] !== undefined;
                            const isSelected = selectedLeft === index;
                            const matchColor = isMatched
                                ? connectionColors[Object.keys(matches).indexOf(String(index)) % connectionColors.length]
                                : undefined;

                            const isCorrect = submitted && isMatched && validPairs.some(p =>
                                p.left === item && p.right === rightItems[matches[index]]
                            );
                            const isWrong = submitted && isMatched && !isCorrect;

                            return (
                                <button
                                    key={`left-${index}-${item}`}
                                    ref={el => { leftRefs.current[index] = el; }}
                                    onClick={() => handleLeftClick(index)}
                                    className={cn(
                                        "w-full p-4 rounded-xl border text-left transition-all relative group",
                                        "hover:shadow-md",
                                        isSelected && "border-primary ring-2 ring-primary bg-primary/10 shadow-lg",
                                        isMatched && !submitted && "bg-white shadow-sm",
                                        isCorrect && "border-green-500 ring-1 ring-green-500 bg-green-50",
                                        isWrong && "border-red-500 ring-1 ring-red-500 bg-red-50",
                                        !isMatched && !isSelected && "bg-card hover:border-primary/50 border-border"
                                    )}
                                    style={isMatched && !submitted ? { borderColor: matchColor, borderWidth: 2 } : undefined}
                                >
                                    <span className={cn(
                                        isCorrect && "text-green-700",
                                        isWrong && "text-red-700"
                                    )}>
                                        {item}
                                    </span>

                                    {/* Remove match button */}
                                    {isMatched && !submitted && (
                                        <div
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeMatch(index);
                                            }}
                                        >
                                            <X className="w-3 h-3 text-white" />
                                        </div>
                                    )}

                                    {/* Connection indicator dot */}
                                    {isMatched && (
                                        <div
                                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                                            style={{ backgroundColor: isCorrect ? "#22c55e" : isWrong ? "#ef4444" : matchColor }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Column */}
                    <div className="flex-1 space-y-3">
                        {rightItems.map((item, index) => {
                            const matchedLeftIndex = Object.keys(matches).find(key => matches[parseInt(key)] === index);
                            const isMatched = matchedLeftIndex !== undefined;
                            const matchColor = isMatched
                                ? connectionColors[Object.keys(matches).indexOf(matchedLeftIndex) % connectionColors.length]
                                : undefined;

                            const isCorrect = submitted && isMatched && validPairs.some(p =>
                                p.left === leftItems[parseInt(matchedLeftIndex!)] && p.right === item
                            );
                            const isWrong = submitted && isMatched && !isCorrect;

                            return (
                                <button
                                    key={`right-${index}-${item}`}
                                    ref={el => { rightRefs.current[index] = el; }}
                                    onClick={() => handleRightClick(index)}
                                    disabled={isMatched || submitted}
                                    className={cn(
                                        "w-full p-4 rounded-xl border text-left transition-all relative",
                                        "hover:shadow-md",
                                        selectedLeft !== null && !isMatched && "hover:border-primary hover:bg-primary/5",
                                        isMatched && !submitted && "bg-white shadow-sm",
                                        isCorrect && "border-green-500 ring-1 ring-green-500 bg-green-50",
                                        isWrong && "border-red-500 ring-1 ring-red-500 bg-red-50",
                                        !isMatched && "bg-card border-border",
                                        isMatched && "cursor-default"
                                    )}
                                    style={isMatched && !submitted ? { borderColor: matchColor, borderWidth: 2 } : undefined}
                                >
                                    <span className={cn(
                                        isCorrect && "text-green-700",
                                        isWrong && "text-red-700"
                                    )}>
                                        {item}
                                    </span>

                                    {/* Connection indicator dot */}
                                    {isMatched && (
                                        <div
                                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                                            style={{ backgroundColor: isCorrect ? "#22c55e" : isWrong ? "#ef4444" : matchColor }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                    {Object.keys(matches).length} of {leftItems.length} pairs matched
                </span>

                {!submitted && Object.keys(matches).length === leftItems.length && (
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                        Check Answers
                    </button>
                )}
            </div>

            {/* Instant Analysis Section */}
            {submitted && (() => {
                // Calculate results
                const results = leftItems.map((leftItem, leftIdx) => {
                    const rightIdx = matches[leftIdx];
                    const userAnswer = rightIdx !== undefined ? rightItems[rightIdx] : null;
                    const correctAnswer = validPairs.find(p => p.left === leftItem)?.right || '';
                    const isCorrect = userAnswer === correctAnswer;
                    return { leftItem, userAnswer, correctAnswer, isCorrect };
                });

                const correctCount = results.filter(r => r.isCorrect).length;
                const wrongResults = results.filter(r => !r.isCorrect);
                const allCorrect = wrongResults.length === 0;

                return (
                    <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Score Summary */}
                        <div className={`p-4 rounded-xl border ${allCorrect ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${allCorrect ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
                                    {correctCount}/{leftItems.length}
                                </div>
                                <div>
                                    <p className={`font-semibold ${allCorrect ? 'text-green-700' : 'text-amber-700'}`}>
                                        {allCorrect ? '🎉 Perfect Score!' : `${correctCount} correct, ${wrongResults.length} incorrect`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {allCorrect ? 'You matched all pairs correctly!' : 'Here are the corrections:'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Wrong Answers Corrections */}
                        {wrongResults.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">Corrections:</h4>
                                {wrongResults.map((result, idx) => (
                                    <div key={idx} className="p-3 rounded-lg bg-red-50 border border-red-100">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-medium text-slate-700">{result.leftItem}</span>
                                            <span className="text-muted-foreground">→</span>
                                            {result.userAnswer && (
                                                <>
                                                    <span className="line-through text-red-400">{result.userAnswer}</span>
                                                    <span className="text-muted-foreground">→</span>
                                                </>
                                            )}
                                            <span className="font-medium text-green-600">{result.correctAnswer}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })()}
        </QuestionCard>
    );
}
