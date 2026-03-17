"use client";

import { MailCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 sm:p-12 text-center"
            >
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MailCheck className="w-10 h-10 text-indigo-600" />
                </div>
                
                <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Check your inbox</h1>
                
                <p className="text-slate-500 font-medium mb-8 text-lg">
                    We've sent a confirmation link to your email address. Please click the link to verify your account and complete your registration.
                </p>
                
                <div className="space-y-4">
                    <Link 
                        href="/login"
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
                    >
                        Go to Login <ArrowRight className="w-5 h-5" />
                    </Link>
                    
                    <p className="text-sm text-slate-400 font-medium pt-4">
                        Didn't receive the email? Check your spam folder.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
