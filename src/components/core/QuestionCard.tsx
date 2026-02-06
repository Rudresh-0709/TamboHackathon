import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface QuestionCardProps {
    children: ReactNode;
    className?: string;
    title?: string;
}

export function QuestionCard({ children, className, title }: QuestionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
                "w-full max-w-2xl mx-auto p-6 md:p-8 rounded-3xl bg-[#0F1420]/80 border border-white/5 shadow-2xl backdrop-blur-xl",
                className
            )}
        >
            {title && (
                <h2 className="text-xl font-semibold mb-6 text-white">{title}</h2>
            )}
            {children}
        </motion.div>
    );
}
