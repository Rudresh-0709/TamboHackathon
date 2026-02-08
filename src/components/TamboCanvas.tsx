import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import { useEffect, useRef, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Send, Sparkles, Paperclip, Share2, MoreVertical, MessageSquare } from "lucide-react";
import { components } from "@/tambo/registry";
import { Sidebar } from "./Sidebar";





interface TamboCanvasProps {
    initialPrompt?: string | string[];
    onPromptSent?: () => void;
}

export function TamboCanvas({ initialPrompt, onPromptSent }: TamboCanvasProps) {
    const { thread, streaming, generationStage, generationStatusMessage } = useTamboThread();
    const { value, setValue, submit } = useTamboThreadInput();
    const bottomRef = useRef<HTMLDivElement>(null);
    const autoSubmitted = useRef(false);
    const [partIdx, setPartIdx] = useState(0);
    const [totalPartCount, setTotalPartCount] = useState(0);
    const promptChunks = useRef<string[]>([]);

    // Debug prop changes
    useEffect(() => {
        console.log("[StudBud] initialPrompt prop changed:", {
            type: typeof initialPrompt,
            isArray: Array.isArray(initialPrompt),
            length: Array.isArray(initialPrompt) ? initialPrompt.length : 'N/A'
        });
    }, [initialPrompt]);

    // Auto-submit initial prompt (handles single or multi-part)
    useEffect(() => {
        if (!initialPrompt || !thread || thread.messages.length > 0 || autoSubmitted.current) return;

        autoSubmitted.current = true;
        const prompts = Array.isArray(initialPrompt) ? initialPrompt : [initialPrompt];
        promptChunks.current = prompts;
        setTotalPartCount(prompts.length);
        console.log("[StudBud] 🚀 Starting fresh sequential submission. Total Parts:", prompts.length);
        onPromptSent?.();

        const submitSequential = async (idx: number) => {
            if (idx >= prompts.length) {
                console.log("[Tambo] ✅ All parts submitted successfully.");
                return;
            }

            setPartIdx(idx + 1);
            console.log(`[StudBud] 📤 Uploading part ${idx + 1}/${prompts.length}...`);

            try {
                setValue(prompts[idx]);

                // EXTRA LOUD WAIT
                setTimeout(async () => {
                    try {
                        console.log(`[StudBud] 🔥 Firing submit() for part ${idx + 1}...`);
                        await submit();
                        console.log(`[StudBud] ✅ submit() call completed for part ${idx + 1}.`);
                    } catch (submitErr: any) {
                        console.error(`[StudBud] ❌ submit() ERROR for part ${idx + 1}:`, submitErr);
                    }
                }, 800);
            } catch (err: any) {
                console.error(`[StudBud] ❌ Logic Error in part ${idx + 1}:`, err);
            }
        };

        submitSequential(0);
    }, [initialPrompt, thread, setValue, submit, onPromptSent]);

    // NEW DIAGNOSTIC: Sync promptChunks Ref even if autoSubmitted is true
    // This helps if the component re-renders and needs the data for manual forcing
    useEffect(() => {
        if (initialPrompt && Array.isArray(initialPrompt)) {
            promptChunks.current = initialPrompt;
            if (totalPartCount === 0) setTotalPartCount(initialPrompt.length);
        } else if (initialPrompt && typeof initialPrompt === 'string') {
            promptChunks.current = [initialPrompt];
            if (totalPartCount === 0) setTotalPartCount(1);
        }
    }, [initialPrompt]);

    const forceNextPart = () => {
        const prompts = promptChunks.current;
        const nextIdx = partIdx;
        if (nextIdx < totalPartCount && prompts[nextIdx]) {
            console.log(`[StudBud] Manual advance to part ${nextIdx + 1}`);
            setPartIdx(nextIdx + 1);
            setValue(prompts[nextIdx]);
            setTimeout(() => {
                submit().catch(e => console.error("[StudBud] Manual submit error:", e));
            }, 300);
        } else {
            console.warn("[StudBud] Cannot force next: No prompts available or already at end.", {
                nextIdx,
                totalPartCount,
                promptsLength: prompts.length,
                propIsArray: Array.isArray(initialPrompt)
            });
        }
    };

    const resendCurrentPart = () => {
        const prompts = promptChunks.current;
        if (partIdx > 0 && prompts[partIdx - 1]) {
            console.log(`[StudBud] Manual resend of part ${partIdx}`);
            setValue(prompts[partIdx - 1]);
            setTimeout(() => {
                submit().catch(e => console.error("[StudBud] Manual resend error:", e));
            }, 300);
        }
    };

    // Handle subsequent parts once the previous one is done
    useEffect(() => {
        if (!autoSubmitted.current || !Array.isArray(initialPrompt)) return;

        // If we are currently streaming, we wait (unless user forces it).
        if (streaming) return;

        // If we just finished streaming a RECEIVING_PART message, trigger the next one
        const lastMsg = thread?.messages[thread.messages.length - 1];
        if (lastMsg && (lastMsg.role === 'assistant' || (lastMsg.role as any) === 'model')) {
            const text = getMessageText(lastMsg);

            // Check for both the technical tag and the index to ensure we don't double-trigger
            if (text.includes("RECEIVING_PART_") && partIdx < totalPartCount) {
                const finishedPart = partIdx;

                console.log(`[StudBud] ACK received for part ${finishedPart}. auto-advancing to ${finishedPart + 1}...`);

                const timer = setTimeout(async () => {
                    const prompts = promptChunks.current;
                    if (partIdx === finishedPart) { // Ensure we haven't already advanced manually
                        setPartIdx(finishedPart + 1);
                        setValue(prompts[finishedPart]);
                        setTimeout(() => {
                            submit().catch(e => console.error("[StudBud] Background submit error:", e));
                        }, 200);
                    }
                }, 800);
                return () => clearTimeout(timer);
            }
        }
    }, [streaming, thread, initialPrompt, setValue, submit, partIdx, totalPartCount]);

    // Watchdog to prevent permanent hangs
    useEffect(() => {
        if (!autoSubmitted.current || !Array.isArray(initialPrompt)) return;
        if (partIdx >= totalPartCount || partIdx === 0) return;

        const currentPart = partIdx;
        const watchdog = setTimeout(() => {
            if (partIdx === currentPart) {
                console.warn(`[StudBud] Watchdog: Part ${currentPart} hung for 20s. Auto-forcing next...`);
                forceNextPart();
            }
        }, 20000); // 20s safety hatch

        return () => clearTimeout(watchdog);
    }, [initialPrompt, streaming, partIdx, totalPartCount]); // Reset watchdog on streaming changes or part changes



    // UI Reactivity Helpers
    const displayPartIdx = partIdx;
    const displayTotalParts = totalPartCount;

    const isError = generationStage === "ERROR";

    // Helper to get text from message content
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getMessageText = (message: any) => {
        if (!message.content) return "";
        if (typeof message.content === 'string') return message.content;
        if (Array.isArray(message.content)) {
            return message.content
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((part: any) => part.type === 'text')
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((part: any) => part.text)
                .join('');
        }
        return "";
    };

    const messages = useMemo(() => {
        if (!thread) return [];
        return thread.messages.filter(
            (m) =>
                !m.metadata ||
                !(m.metadata as any).transient &&
                (m.metadata as any)?.type !== "status"
        );
    }, [thread]);


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streaming]);

    // Auto-clear JSON events from input bar (when components submit answers programmatically)
    useEffect(() => {
        if (value && /^\s*\{\s*"event"\s*:/.test(value)) {
            setValue('');
        }
    }, [value, setValue]);

    // Fix: Use reduce instead of filter to handle state (lastComponentWasStartAssessment) purely
    const visibleMessages = messages.reduce<{ visible: typeof messages; lastWasStartAssessment: boolean }>(
        (acc, message) => {
            const text = getMessageText(message);

            // 0. Global Filter: Hide JSON events and system messages
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const role = message.role as any;

            // Regex for {"event": ...} allowing for whitespace
            const isJsonEvent = /^\s*\{\s*"event"\s*:/.test(text) || text.includes('"event":"ANSWER_SUBMITTED"');

            if (isJsonEvent || role === 'system' || role === 'data') {
                return acc;
            }

            // 1. Hide programmatic user messages
            if (message.role === 'user') {
                // Legacy text patterns
                const isHiddenProgrammatic = text.match(/^(User answered (correctly|incorrectly)|I am ready)/);
                if (isHiddenProgrammatic) {
                    // If this is a valid user interaction, we clear the "StartAssessment" block
                    acc.lastWasStartAssessment = false;
                    return acc;
                }

                // Hide internal multi-part sync messages
                if (text.startsWith("INTERNAL_SYNC_PART_")) {
                    return acc;
                }

                // Hide the massive initial context prompt from the chat feed to keep it clean
                // Handles both "Context:\n- Topic:" and "Context:- Topic:"
                const isInitialPrompt = text.match(/^Context:?\s*- Topic:/) && text.includes("Please generate an assessment");
                if (isInitialPrompt) {
                    return acc;
                }

                // Any other user message also clears the block
                acc.lastWasStartAssessment = false;
                acc.visible.push(message);
                return acc;
            }

            // 2. AI Messages
            // Check for both 'assistant' and 'model' (common in Vercel AI SDK / diverse providers)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (message.role === 'assistant' || (message.role as any) === 'model') {

                // Hide internal "RECEIVING_PART" acknowledgments from the feed
                if (text.includes("RECEIVING_PART_")) {
                    return acc;
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const rawName = message.component?.componentName || (message.component as any)?.name;

                // Normalize name for check
                const normalizedName = rawName ? rawName.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
                const isStartAssessment = normalizedName === 'startassessment'; // "startassessment" matches "StartAssessment", "start-assessment", etc.

                // If this message IS the StartAssessment, mark it
                if (isStartAssessment) {
                    acc.lastWasStartAssessment = true;
                    acc.visible.push(message);
                    return acc;
                }

                // If the PREVIOUS relevant message was StartAssessment, and this is just text (the question), HIDE IT
                if (acc.lastWasStartAssessment && !message.component) {
                    return acc;
                }

                // If we are blocking, we generally block everything until user interaction
                if (acc.lastWasStartAssessment) {
                    return acc;
                }
            }

            acc.visible.push(message);
            return acc;
        },
        { visible: [], lastWasStartAssessment: false }
    ).visible;

    // Check if we are in the "initial thinking" phase (just submitted, waiting for AI)
    const hasAssistantMessage = visibleMessages.some(m => m.role === 'assistant' || (m.role as any) === 'model');
    const isInitialAssessmentPreparing = autoSubmitted.current && !hasAssistantMessage;

    // Derive the state from the last visible message
    const lastVisibleMessage = visibleMessages[visibleMessages.length - 1];
    let lastComponentWasStartAssessment = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (lastVisibleMessage && (lastVisibleMessage.role === 'assistant' || (lastVisibleMessage.role as any) === 'model')) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawName = lastVisibleMessage.component?.componentName || (lastVisibleMessage.component as any)?.name;
        const normalizedName = rawName ? rawName.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
        if (normalizedName === 'startassessment') {
            lastComponentWasStartAssessment = true;
        }
    }

    const lastMessage = visibleMessages[visibleMessages.length - 1];
    const isLastMessageAssistant = lastMessage?.role === 'assistant' || (lastMessage?.role as any) === 'model';
    const lastMessageHasContent = isLastMessageAssistant && (getMessageText(lastMessage).trim().length > 0 || !!lastMessage.component);

    // Fix for "Thinking" showing at start: only show if we have VISIBLE messages
    // This prevents the "Thinking..." ghost on the empty screen
    const showThinking = streaming && visibleMessages.length > 0 && !lastComponentWasStartAssessment && !lastMessageHasContent;

    return (
        <div className="flex h-screen w-full bg-white text-slate-900 font-sans overflow-hidden">
            <Sidebar />

            <main className="flex-1 flex flex-col relative bg-slate-50">
                {/* Header */}
                <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-blue-600 fill-blue-600" />
                        <span className="font-bold text-slate-900">Active Session</span>
                        {totalPartCount > 1 && (
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                                    Part {partIdx} / {totalPartCount}
                                </span>
                                <div className={`w-1.5 h-1.5 rounded-full ${streaming ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`} />
                            </div>
                        )}
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-500 text-sm font-medium">Photosynthesis Notes</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Share2 className="w-5 h-5" /></button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                </header>

                {/* Chat Feed */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent relative">
                    <AnimatePresence mode="popLayout">
                        {isInitialAssessmentPreparing && (
                            <motion.div
                                key="preparing-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-20 bg-slate-50/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                            >
                                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-blue-500/10 flex items-center justify-center mb-6 animate-pulse">
                                    <Sparkles className="w-10 h-10 text-blue-500 fill-blue-500" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 mb-2">Preparing Your Assessment</h2>
                                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed mb-4">
                                    StudBud AI is analyzing the provided material to generate a personalized learning experience for you...
                                </p>

                                <div className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                                    {displayTotalParts > 1 && displayPartIdx <= displayTotalParts
                                        ? `Uploading Part ${displayPartIdx} of ${displayTotalParts}...`
                                        : !thread || thread.messages.length === 0
                                            ? "Sending Material..."
                                            : streaming
                                                ? "AI is Thinking..."
                                                : "Initializing..."
                                    }
                                </div>

                                {displayTotalParts > 1 && (
                                    <div className="flex flex-col items-center gap-4 bg-white/50 p-4 rounded-2xl border border-slate-200 mb-6">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Emergency Controls</span>
                                            <div className="flex gap-3">
                                                {displayPartIdx < displayTotalParts && (
                                                    <button
                                                        onClick={forceNextPart}
                                                        className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg hover:bg-amber-200 transition-colors shadow-sm"
                                                    >
                                                        Force Next Part
                                                    </button>
                                                )}
                                                <button
                                                    onClick={resendCurrentPart}
                                                    className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg hover:bg-blue-200 transition-colors shadow-sm"
                                                >
                                                    Resend Current
                                                </button>
                                            </div>
                                        </div>
                                        {streaming && (
                                            <span className="text-[9px] text-slate-400 italic max-w-[200px]">
                                                (AI is still thinking. Only force if it's been several seconds without progress.)
                                            </span>
                                        )}
                                    </div>
                                )}

                                {!thread || thread.messages.length === 0 ? (
                                    <button
                                        onClick={async () => {
                                            try {
                                                await submit();
                                            } catch (err: any) {
                                                console.error("Submit Error:", err);
                                                alert(`Submission failed: ${err.message || "Please check your input size."}`);
                                            }
                                        }}
                                        className="text-[10px] font-bold text-slate-400 hover:text-blue-500 transition-colors underline underline-offset-4 mb-8"
                                    >
                                        Stuck? Click to semi-manual submit
                                    </button>
                                ) : (
                                    <div className="h-4 mb-8" />
                                )}

                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                                </div>
                            </motion.div>
                        )}

                        {visibleMessages.length === 0 && !showThinking && !isInitialAssessmentPreparing && (
                            <div key="empty-state" className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-blue-500" />
                                </div>
                                <p className="text-slate-400 font-medium">How can I help you learn today?</p>
                            </div>
                        )}
                        {visibleMessages.map((message, index) => {
                            // COMPONENT MATCHING LOGIC
                            let componentDef = null;
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const rawName = message.component?.componentName || (message.component as any)?.name;
                            // Ensure key is never empty - use id, index, or generate unique fallback
                            const messageKey = message.id && message.id.trim() !== ""
                                ? message.id
                                : `fallback-msg-${index}`;

                            if (message.component && rawName) {
                                componentDef = components.find(c => c.name === rawName);
                                if (!componentDef) {
                                    const normalizedIncoming = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');
                                    componentDef = components.find(c =>
                                        c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedIncoming
                                    );
                                }
                            }

                            const ComponentToRender = componentDef?.component;

                            // Text processing
                            const textContent = Array.isArray(message.content)
                                ? message.content.map((part, i) => {
                                    if (part.type === 'text') return <span key={i}>{part.text}</span>;
                                    return null;
                                })
                                : null;

                            // Robust check for empty text (whitespace only)
                            const hasText = textContent && textContent.some(t => {
                                if (!t || !t.props || typeof t.props.children !== 'string') return false;
                                return t.props.children.trim().length > 0;
                            });

                            if (!hasText && !ComponentToRender) {
                                if (message.component && !ComponentToRender && rawName) return (
                                    <div key={message.id} className="w-full flex justify-start my-4">
                                        <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl text-xs">
                                            Missing Component: {rawName}
                                        </div>
                                    </div>
                                );
                                return null;
                            }

                            return (
                                <motion.div
                                    key={messageKey}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "w-full flex",
                                        message.role === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {message.role === 'user' ? (
                                        <div className="bg-primary text-white px-6 py-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md shadow-blue-500/10 text-sm md:text-base leading-relaxed">
                                            {textContent}
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-4 max-w-3xl w-full">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex-shrink-0 flex items-center justify-center mt-1">
                                                <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-500" />
                                            </div>
                                            <div className="flex-1 space-y-6">
                                                {hasText && (
                                                    <div className="bg-slate-50 border border-slate-200 px-6 py-5 rounded-2xl rounded-tl-sm text-slate-700 text-sm md:text-base leading-relaxed shadow-sm">
                                                        {textContent}
                                                    </div>
                                                )}
                                                {ComponentToRender && message.component && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="w-full"
                                                    >
                                                        <ComponentToRender
                                                            {...message.component.props}
                                                            onSubmit={(isCorrect: boolean) => {
                                                                const msg = JSON.stringify({
                                                                    event: "ANSWER_SUBMITTED",
                                                                    correct: isCorrect
                                                                });

                                                                setValue(msg);
                                                                // Yield to event loop to allow value update
                                                                setTimeout(() => submit(), 0);
                                                            }}
                                                        />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}

                        {showThinking && (
                            <motion.div
                                key="thinking-indicator"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-4 pl-0"
                            >
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex-shrink-0 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-500" />
                                </div>
                                <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">StudBud AI is thinking</span>
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {isError && (
                            <div key="error-state" className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mx-auto max-w-md text-center text-sm">
                                <p className="font-bold">Generation Failed</p>
                                <p>{generationStatusMessage}</p>
                            </div>
                        )}
                        <div key="scroll-anchor" ref={bottomRef} className="h-4" />
                    </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="p-6 pt-2">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 p-2 flex items-center gap-2 pl-4">
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                placeholder="Ask StudBud AI to generate an assessment or explain a concept..."
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 h-10 font-medium"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && value.trim()) {
                                        submit();
                                        setValue('');
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    if (value.trim()) {
                                        submit();
                                        setValue('');
                                    }
                                }}
                                disabled={!value.trim()}
                                className={cn(
                                    "p-3 rounded-xl transition-all duration-200",
                                    value.trim()
                                        ? "bg-primary text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700"
                                        : "bg-slate-100 text-slate-300"
                                )}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="text-center mt-3">
                            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                                AI CAN MAKE MISTAKES. VERIFY IMPORTANT INFORMATION.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
