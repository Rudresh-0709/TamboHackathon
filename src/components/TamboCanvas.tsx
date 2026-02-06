import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Send, Sparkles, Paperclip, Share2, MoreVertical, MessageSquare } from "lucide-react";
import { components } from "@/tambo/registry";
import { Sidebar } from "./Sidebar";

export function TamboCanvas() {
    const { thread, streaming, generationStage, generationStatusMessage } = useTamboThread();
    const { value, setValue, submit } = useTamboThreadInput();
    const bottomRef = useRef<HTMLDivElement>(null);

    const isError = generationStage === "ERROR";

    // Helper to get text from message content
    const getMessageText = (message: any) => {
        if (!message.content) return "";
        if (typeof message.content === 'string') return message.content;
        if (Array.isArray(message.content)) {
            return message.content
                .filter((part: any) => part.type === 'text')
                .map((part: any) => part.text)
                .join('');
        }
        return "";
    };

    const messages = thread?.messages || [];

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streaming]);

    // Filter logic to hide programmatic messages and auto-generated AI follow-ups
    let lastComponentWasStartAssessment = false;

    // Remove 'index' as it is unused
    const visibleMessages = messages.filter((message) => {
        const text = getMessageText(message);

        // 1. Hide programmatic user messages
        if (message.role === 'user') {
            const isHiddenProgrammatic = text.match(/^(User answered (correctly|incorrectly)|I am ready)/);
            if (isHiddenProgrammatic) {
                // If this is a valid user interaction, we clear the "StartAssessment" block
                lastComponentWasStartAssessment = false;
                return false;
            }
            // Any other user message also clears the block
            lastComponentWasStartAssessment = false;
            return true;
        }

        // 2. AI Messages
        // Check for both 'assistant' and 'model' (common in Vercel AI SDK / diverse providers)
        if (message.role === 'assistant' || (message.role as any) === 'model') {
            const rawName = message.component?.componentName || (message.component as any)?.name;

            // Normalize name for check
            const normalizedName = rawName ? rawName.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
            const isStartAssessment = normalizedName === 'startassessment'; // "startassessment" matches "StartAssessment", "start-assessment", etc.

            // If this message IS the StartAssessment, mark it
            if (isStartAssessment) {
                lastComponentWasStartAssessment = true;
                return true;
            }

            // If the PREVIOUS relevant message was StartAssessment, and this is just text (the question), HIDE IT
            if (lastComponentWasStartAssessment && !message.component) {
                return false;
            }

            // If we are blocking, we generally block everything until user interaction
            if (lastComponentWasStartAssessment) {
                return false;
            }
        }

        return true;
    });

    // Fix for "Thinking" showing at start: only show if we have VISIBLE messages
    // This prevents the "Thinking..." ghost on the empty screen
    const showThinking = streaming && visibleMessages.length > 0 && !lastComponentWasStartAssessment;

    return (
        <div className="flex h-screen w-full bg-white text-slate-900 font-sans overflow-hidden">
            <Sidebar />

            <main className="flex-1 flex flex-col relative bg-slate-50">
                {/* Header */}
                <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-blue-600 fill-blue-600" />
                        <span className="font-bold text-slate-900">Active Session</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-500 text-sm font-medium">Photosynthesis Notes</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Share2 className="w-5 h-5" /></button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                </header>

                {/* Chat Feed */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    <AnimatePresence mode="popLayout">
                        {visibleMessages.length === 0 && !showThinking && (
                            <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-blue-500" />
                                </div>
                                <p className="text-slate-400 font-medium">How can I help you learn today?</p>
                            </div>
                        )}
                        {visibleMessages.map((message, index) => {
                            // COMPONENT MATCHING LOGIC
                            let componentDef = null;
                            const rawName = message.component?.componentName || (message.component as any)?.name;
                            const messageKey = (message.id && message.id !== "") ? message.id : `msg-${index}-${Date.now()}`;

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
                                                    <div className="bg-white border border-slate-200 px-6 py-5 rounded-2xl rounded-tl-sm text-slate-700 text-sm md:text-base leading-relaxed shadow-sm">
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
                                                                const msg = isCorrect
                                                                    ? "User answered correctly. Please provide the next question."
                                                                    : "User answered incorrectly. Please provide feedback and the next question.";

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
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-4 pl-0"
                            >
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex-shrink-0 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-500" />
                                </div>
                                <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tambo AI is thinking</span>
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {isError && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mx-auto max-w-md text-center text-sm">
                                <p className="font-bold">Generation Failed</p>
                                <p>{generationStatusMessage}</p>
                            </div>
                        )}
                        <div ref={bottomRef} className="h-4" />
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
                                placeholder="Ask Tambo AI to generate an assessment or explain a concept..."
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 h-10 font-medium"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && value.trim()) submit();
                                }}
                            />
                            <button
                                onClick={() => value.trim() && submit()}
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
