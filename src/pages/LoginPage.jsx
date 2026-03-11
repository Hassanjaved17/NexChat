// ============================================================
//  NEXCHAT — LoginPage.jsx
//  Author  : Hassan Javed
//  GitHub  : https://github.com/Hassanjaved17
//  Built   : March 2026
//  © 2026 Hassan Javed — All Rights Reserved
// ============================================================

import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    Mail, Lock, User, Eye, EyeOff,
    MessageSquare, Loader2, ArrowRight,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";

// ── Friendly error messages ───────────────────────────────────
const getFriendlyError = (code) => {
    switch (code) {
        case "auth/invalid-email": return "Please enter a valid email address.";
        case "auth/user-not-found": return "No account found with this email.";
        case "auth/wrong-password": return "Incorrect password. Please try again.";
        case "auth/email-already-in-use": return "An account with this email already exists.";
        case "auth/weak-password": return "Password must be at least 6 characters.";
        case "auth/too-many-requests": return "Too many attempts. Please try again later.";
        case "auth/popup-closed-by-user": return "Google sign-in was cancelled.";
        case "auth/invalid-credential": return "Invalid email or password.";
        default: return "Something went wrong. Please try again.";
    }
};

const LoginPage = () => {
    const { user, login, signup, loginWithGoogle } = useAuth();

    const [tab, setTab] = useState("signin");
    const [displayName, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogle] = useState(false);
    const [error, setError] = useState("");

    // ── All hooks before early return ─────────────────────────
    if (user) return <Navigate to="/chat" replace />;

    const handleTabChange = (newTab) => {
        setTab(newTab);
        setError("");
        setEmail("");
        setPassword("");
        setName("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            if (tab === "signup") {
                if (!displayName.trim()) {
                    setError("Please enter your name.");
                    setLoading(false);
                    return;
                }
                await signup(email, password, displayName.trim());
            } else {
                await login(email, password);
            }
        } catch (err) {
            setError(getFriendlyError(err.code));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError("");
        setGoogle(true);
        try {
            await loginWithGoogle();
        } catch (err) {
            setError(getFriendlyError(err.code));
        } finally {
            setGoogle(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0812] flex items-start justify-center px-4 pt-16 pb-16">

            {/* Background glow */}
            <div className="fixed top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="w-full max-w-md flex flex-col gap-8">

                {/* Brand */}
                <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                        <MessageSquare size={26} className="text-violet-400" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-white text-2xl font-bold tracking-tight">NexChat</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {tab === "signin"
                                ? "Welcome back! Sign in to continue."
                                : "Create your account to get started."}
                        </p>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-[#110d1a] border border-violet-900/40 rounded-2xl shadow-2xl shadow-black/50 transition-all duration-300">

                    {/* Tabs */}
                    <div className="flex border-b border-violet-900/30">
                        {["signin", "signup"].map((t) => (
                            <button
                                key={t}
                                onClick={() => handleTabChange(t)}
                                className={`flex-1 py-4 text-sm font-medium transition-all duration-300 ${tab === t
                                    ? "text-violet-400 border-b-2 border-violet-500"
                                    : "text-gray-600 hover:text-gray-400"
                                    }`}
                            >
                                {t === "signin" ? "Sign In" : "Sign Up"}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-4">

                        {/* Display name — signup only */}
                        <div className={`grid transition-all duration-300 ease-in-out ${tab === "signup" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            }`}>
                            <div className="overflow-hidden">
                                <div className="flex flex-col gap-1.5 pb-0">
                                    <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                                        Your Name
                                    </label>
                                    <div className="relative">
                                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Hassan Javed"
                                            required={tab === "signup"}
                                            className="w-full bg-[#0a0812] border border-violet-900/40 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/20 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                                Email
                            </label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full bg-[#0a0812] border border-violet-900/40 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-[#0a0812] border border-violet-900/40 rounded-xl pl-10 pr-10 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass((p) => !p)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-violet-900 disabled:text-violet-700 text-white text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 mt-1"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" />
                                    {tab === "signin" ? "Signing in…" : "Creating account…"}
                                </>
                            ) : (
                                <>
                                    {tab === "signin" ? "Sign In" : "Create Account"}
                                    <ArrowRight size={15} />
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-violet-900/30" />
                            <span className="text-gray-600 text-xs">or</span>
                            <div className="flex-1 h-px bg-violet-900/30" />
                        </div>

                        {/* Google */}
                        <button
                            type="button"
                            onClick={handleGoogle}
                            disabled={googleLoading}
                            className="w-full py-3 rounded-xl border border-violet-900/40 hover:border-violet-700/40 hover:bg-violet-500/5 text-white text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {googleLoading ? (
                                <Loader2 size={15} className="animate-spin text-violet-400" />
                            ) : (
                                <FcGoogle size={18} />
                            )}
                            Continue with Google
                        </button>

                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-700 text-xs">
                    © 2026 Hassan Javed — All Rights Reserved
                </p>

            </div>
        </div>
    );
};

export default LoginPage;

// © 2026 Hassan Javed — All Rights Reserved