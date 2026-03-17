"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading, initialize } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}
