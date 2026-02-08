"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true, ...props }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hoverEffect ? { y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" } : {}}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
                "backdrop-blur-xl bg-white/40 border border-white/50 rounded-3xl p-6 shadow-sm",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
