
"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    delay?: number;
    color: "purple" | "orange" | "blue";
}

export function FeatureCard({ icon: Icon, title, description, delay = 0, color }: FeatureCardProps) {
    const colors = {
        purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
        orange: "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
        blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="h-full"
        >
            <GlassCard className="h-full group hover:border-white/80 transition-colors">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600 leading-relaxed">
                    {description}
                </p>
            </GlassCard>
        </motion.div>
    );
}
