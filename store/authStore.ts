import { create } from "zustand";
import { type AuthChangeEvent, type Session, type Subscription, type User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  initialize: () => Promise<void>;
}

let authSubscription: Subscription | null = null;
let initializePromise: Promise<void> | null = null;

function applySession(set: (partial: Partial<AuthState>) => void, session: Session | null) {
  set({
    session,
    user: session?.user ?? null,
    isLoading: false,
    initialized: true,
  });
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  initialized: false,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  initialize: async () => {
    if (get().initialized) {
      return;
    }

    if (initializePromise) {
      return initializePromise;
    }

    initializePromise = (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      applySession(set, session);

      if (!authSubscription) {
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(
          (_event: AuthChangeEvent, nextSession: Session | null) => {
            applySession(set, nextSession);
          }
        );

        authSubscription = subscription;
      }
    })().finally(() => {
      initializePromise = null;
    });

    return initializePromise;
  },
}));
