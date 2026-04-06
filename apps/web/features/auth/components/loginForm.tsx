// components/login-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { LoginBody } from "@repo/types";
import { useLoginMutation } from "../hooks/queries";
import { useAuth } from "../hooks/useAuth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { login } = useAuth();
  const { mutateAsync: loginMutation, isPending } = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError(null);
      const payload: LoginBody = { email, password };
      const data = await loginMutation(payload);
      
      if (data.access_token && data.refresh_token) {
        login(data.access_token, data.refresh_token);
        router.push("/dashboard/overview");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <svg
          className="absolute w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,400 C200,300 400,500 600,450 C800,400 1000,300 1200,350 C1400,400 1440,450 1440,450 L1440,800 L0,800 Z"
            fill="url(#gradient)"
            opacity="0.3"
          >
            <animate
              attributeName="d"
              dur="20s"
              values="
                M0,400 C200,300 400,500 600,450 C800,400 1000,300 1200,350 C1400,400 1440,450 1440,450 L1440,800 L0,800 Z;
                M0,450 C200,380 400,420 600,400 C800,380 1000,450 1200,430 C1400,410 1440,380 1440,380 L1440,800 L0,800 Z;
                M0,400 C200,300 400,500 600,450 C800,400 1000,300 1200,350 C1400,400 1440,450 1440,450 L1440,800 L0,800 Z
              "
              repeatCount="indefinite"
            />
          </path>
          
          <path
            d="M0,500 C250,420 450,580 650,520 C850,460 1050,380 1250,420 C1350,440 1440,480 1440,480 L1440,800 L0,800 Z"
            fill="url(#gradient2)"
            opacity="0.2"
          >
            <animate
              attributeName="d"
              dur="15s"
              values="
                M0,500 C250,420 450,580 650,520 C850,460 1050,380 1250,420 C1350,440 1440,480 1440,480 L1440,800 L0,800 Z;
                M0,480 C250,540 450,460 650,500 C850,540 1050,500 1250,480 C1350,460 1440,440 1440,440 L1440,800 L0,800 Z;
                M0,500 C250,420 450,580 650,520 C850,460 1050,380 1250,420 C1350,440 1440,480 1440,480 L1440,800 L0,800 Z
              "
              repeatCount="indefinite"
            />
          </path>
          
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#96e7f5" />
              <stop offset="50%" stopColor="#2596be" />
              <stop offset="100%" stopColor="#2596be" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        
        <svg
          className="absolute bottom-0 w-full h-48"
          preserveAspectRatio="none"
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 C300,80 600,40 900,60 C1200,80 1440,100 1440,100 L1440,120 L0,120 Z"
            fill="url(#gradient3)"
            opacity="0.15"
          />
          <defs>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#96e7f5" />
              <stop offset="100%" stopColor="#2596be" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-indigo-300 rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-pink-300 rounded-full animate-pulse delay-700" />
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-500" />
          <div className="absolute bottom-1/3 left-2/3 w-0.5 h-0.5 bg-indigo-300 rounded-full animate-pulse delay-1200" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl shadow-slate-200/50 p-8 border border-slate-100">
          <div className="flex justify-center mb-8">
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome back</h1>
            <p className="text-sm text-slate-500">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={18} className="shrink-0" />
              <p className="text-xs font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all bg-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isPending}
                  className="w-full pl-10 pr-12 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all bg-white placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}