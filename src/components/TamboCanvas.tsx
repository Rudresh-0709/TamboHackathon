import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Send, Sparkles, Bot } from "lucide-react";
import { components } from "@/tambo/registry";

export function TamboCanvas() {
    const { thread, streaming, generationStage, generationStatusMessage } = useTamboThread();
    const { value, setValue, submit } = useTamboThreadInput();
    const bottomRef = useRef<HTMLDivElement>(null);

    const isError = generationStage === "ERROR";

    const messages = thread?.messages || [];

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streaming]);

    return (
        <div className="flex flex-col h-screen w-full bg-[#050A14] text-foreground relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 z-10 border-b border-white/5 backdrop-blur-sm bg-[#050A14]/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-primary/20 border border-white/10 flex items-center justify-center shadow-inner">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-white">Tambo Assessment</h1>
                        <p className="text-xs text-indigo-300 font-medium">Adaptive AI Tutor</p>
                    </div>
                </div>
                <div className="text-xs font-mono text-white/30 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                    v1.0
                </div>
            </header>

            {/* Main Feed */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pb-36">
                <AnimatePresence mode="popLayout">
                    {messages.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-50">
                            <Bot className="w-16 h-16 mb-4 text-white/20" />
                            <p className="text-white/40 font-light">Start a topic to begin assessment</p>
                        </div>
                    )}
                    {messages.map((message) => {
                        // ULTRA-ROBUST MATCHING
                        // 1. Try exact match
                        // 2. Try normalizing both to alphanumeric lowercase (ignores case, dashes, underscores)
                        let componentDef = null;

                        // Check if component exists and has a name property (handle both name and componentName just in case)
                        const rawName = message.component?.componentName || (message.component as any)?.name;

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

                        const textContent = Array.isArray(message.content)
                            ? message.content.map((part, i) => {
                                if (part.type === 'text') return <span key={i}>{part.text}</span>;
                                return null;
                            })
                            : null;

                        const hasText = textContent && textContent.some(t => t);

                        // If we have a component-call but no component def found
                        if (message.component && !ComponentToRender) {
                            // Ignore empty component names (often transient or malformed thinking steps)
                            if (!rawName) return null;

                            return (
                                <div key={message.id} className="w-full flex justify-start my-4 max-w-full">
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-xs overflow-hidden w-full">
                                        <p className="font-bold mb-2 text-red-100">System Error: Missing UI Component</p>
                                        <p className="mb-2">
                                            Attempted to render: <code className="bg-black/30 px-1 py-0.5 rounded text-red-300">{rawName}</code>
                                        </p>
                                        <p className="mb-2 text-white/50">Debug Data:</p>
                                        <pre className="bg-black/50 p-2 rounded text-[10px] whitespace-pre-wrap overflow-x-auto text-white/70 font-mono">
                                            {JSON.stringify(message.component, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            );
                        }

                        if (!hasText && !ComponentToRender) return null;

                        return (
                            <motion.div
                                key={message.id || Math.random().toString()}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20
                                }}
                                className={cn(
                                    "w-full flex",
                                    message.role === 'user' ? "justify-end" : "justify-start"
                                )}
                            >
                                {message.role === 'user' ? (
                                    <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-lg shadow-primary/20 text-sm md:text-base">
                                        {textContent}
                                    </div>
                                ) : (
                                    <div className="space-y-4 max-w-2xl w-full">
                                        {textContent && textContent.length > 0 && (
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0 flex items-center justify-center mt-1">
                                                    <Bot className="w-4 h-4 text-indigo-400" />
                                                </div>
                                                <div className="text-indigo-100/90 leading-relaxed bg-[#0F1420] border border-white/5 px-6 py-4 rounded-2xl rounded-tl-sm text-sm md:text-base">
                                                    {textContent}
                                                </div>
                                            </div>
                                        )}
                                        {ComponentToRender && message.component && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="pl-12"
                                            >
                                                <ComponentToRender {...message.component.props} />
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}

                    {streaming && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 text-indigo-400/50 p-4 pl-12"
                        >
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {isError && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mx-auto max-w-md bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-200"
                    >
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="font-bold">!</span>
                        </div>
                        <div>
                            <p className="font-medium text-red-100">Generation Failed</p>
                            <p className="text-sm opacity-80">{generationStatusMessage || "Check your API key or connection."}</p>
                        </div>
                    </motion.div>
                )}

                <div ref={bottomRef} />
            </main>

            {/* Input Area */}
            <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-50 pointer-events-none">
                <div className="w-full max-w-3xl pointer-events-auto">
                    <div className="relative group rounded-3xl p-[1px] bg-gradient-to-r from-white/10 via-white/20 to-white/10 shadow-2xl shadow-black/50">
                        <div className="relative flex items-center bg-[#0F1420]/90 backdrop-blur-xl rounded-3xl overflow-hidden">
                            <input
                                type="text"
                                placeholder="Type a topic (e.g., 'Molecular Biology')..."
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full py-4 pl-6 pr-14 bg-transparent text-white placeholder:text-white/30 focus:outline-none font-medium h-14"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && value.trim()) {
                                        submit();
                                    }
                                }}
                            />
                            <button
                                className={cn(
                                    "absolute right-2 p-2 rounded-full transition-all duration-300",
                                    value.trim()
                                        ? "bg-primary text-primary-foreground hover:scale-110 hover:shadow-lg hover:shadow-primary/50"
                                        : "bg-white/5 text-white/20"
                                )}
                                onClick={() => {
                                    if (value.trim()) {
                                        submit();
                                    }
                                }}
                                disabled={!value.trim()}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
