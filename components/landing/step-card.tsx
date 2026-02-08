
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StepCardProps {
    number: string;
    title: string;
    description: string;
    align: "left" | "right";
}

export function StepCard({ number, title, description, align }: StepCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: align === "left" ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn(
                "flex flex-col md:flex-row gap-6 items-center",
                align === "right" ? "md:flex-row-reverse text-right" : "text-left"
            )}
        >
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white/50 backdrop-blur-md border border-white/60 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-slate-900">{number}</span>
            </div>
            <div className={cn(
                "max-w-md",
                align === "right" ? "md:text-right" : "md:text-left"
            )}>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-lg text-slate-600">{description}</p>
            </div>
        </motion.div>
    );
}
