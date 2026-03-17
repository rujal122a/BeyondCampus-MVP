import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    initialize: () => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            set({ session, user: session?.user ?? null, isLoading: false });
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            set({ session, user: session?.user ?? null, isLoading: false });
        });
    },
}));
