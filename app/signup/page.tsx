"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, UserPlus, Loader2, Sparkles, ShieldCheck, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });

        if (error) {
            toast.error(error.message);
            setLoading(false);
            return;
        }

        if (data.user && data.user.identities && data.user.identities.length === 0) {
            toast.error('An account with this email already exists. Please log in.');
            setLoading(false);
            return;
        }

        toast.success('Account created! Please check your email to verify.');
        if (!data.session) {
            router.push('/verify-email');
        } else {
            router.push('/onboarding');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel — Purple Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden aurora-bg">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-brand-black z-10">
                    <div className="max-w-md text-center">
                        <div className="flex items-center justify-center gap-2 mb-8">
                            <span className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple font-black text-lg">B</span>
                            <span className="font-black text-2xl tracking-tight">BeyondCampus</span>
                        </div>
                        <h2 className="text-4xl font-black mb-4 leading-tight">Join the community of student living.</h2>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10">
                            Free forever. No broker. No middleman. Just you and your ideal home.
                        </p>
                        <div className="space-y-4">
                            {[
                                { icon: Sparkles, text: "Free to join, always" },
                                { icon: ShieldCheck, text: "Secure & Verified" },
                                { icon: Users, text: "Thousands of students" },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-center gap-3 bg-brand-purple/10 rounded-2xl px-5 py-3">
                                    <Icon className="w-5 h-5 text-brand-purple shrink-0" />
                                    <span className="font-semibold text-brand-black">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-purple/5 rounded-full blur-[80px] translate-x-1/2 translate-y-1/3 pointer-events-none" />
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-brand-offwhite">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-brand-black mb-2">Create Account</h1>
                        <p className="text-slate-500 font-medium">Join the BeyondCampus community today</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-brand-black">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 outline-none transition-all placeholder:text-slate-400 font-medium"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-brand-black">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 outline-none transition-all placeholder:text-slate-400 font-medium"
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-black text-white font-bold py-4 rounded-2xl hover:opacity-80 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                            {loading ? 'Creating account...' : 'Sign up free'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm font-medium text-slate-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-brand-purple hover:opacity-70 font-bold transition">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
