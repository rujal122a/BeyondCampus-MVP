import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export function GlassCard({ children, className, onClick }: GlassCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-white rounded-3xl border border-slate-100 shadow-sm p-6",
                onClick && "cursor-pointer",
                className
            )}
        >
            {children}
        </div>
    );
}
