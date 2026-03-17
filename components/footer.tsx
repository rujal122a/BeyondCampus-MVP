import Link from "next/link";
import { BedDouble, UtensilsCrossed, Home, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-brand-black text-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center text-white text-sm font-black">B</span>
                            <span className="font-black text-xl tracking-tight">BeyondCampus</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed max-w-xs font-medium">
                            The community living OS for students. Find your stay, your food, your people.
                        </p>
                        <div className="flex items-center gap-3 mt-6">
                            <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Platform</h4>
                        <ul className="space-y-3">
                            <li><Link href="/" className="text-slate-300 hover:text-white transition font-medium flex items-center gap-2"><Home className="w-4 h-4" />Home</Link></li>
                            <li><Link href="/stays" className="text-slate-300 hover:text-white transition font-medium flex items-center gap-2"><BedDouble className="w-4 h-4" />Stays</Link></li>
                            <li><Link href="/eats" className="text-slate-300 hover:text-white transition font-medium flex items-center gap-2"><UtensilsCrossed className="w-4 h-4" />Eats</Link></li>
                        </ul>
                    </div>

                    {/* Account Links */}
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Account</h4>
                        <ul className="space-y-3">
                            <li><Link href="/login" className="text-slate-300 hover:text-white transition font-medium">Log in</Link></li>
                            <li><Link href="/signup" className="text-slate-300 hover:text-white transition font-medium">Sign up</Link></li>
                            <li><Link href="/list-your-property" className="text-slate-300 hover:text-white transition font-medium">List Property</Link></li>
                            <li><Link href="/dashboard" className="text-slate-300 hover:text-white transition font-medium">Dashboard</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm font-medium">© 2025 BeyondCampus. All rights reserved.</p>
                    <div className="flex items-center gap-1">
                        <span className="text-slate-500 text-sm">Made with</span>
                        <span className="text-brand-green text-sm font-bold mx-1">♥</span>
                        <span className="text-slate-500 text-sm">for students</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
