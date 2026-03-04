"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { authService } from "@/features/auth/services";
const { login } = authService;

import { useAuth } from "@/app/providers/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      await refreshUser();
      // Redirect after successful login
      router.push("/");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-5">
        <div className="hidden md:flex md:col-span-2 bg-brand-coral text-white flex-col justify-between p-8">
          <div>
            <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl font-bold">B</span>
            </div>
            <h2 className="text-3xl font-bold mb-3 leading-tight">
              Welcome back
            </h2>
            <p className="text-white/80 text-sm">
              Sign in to manage your events and tickets.
            </p>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Sparkles size={18} />
              <span>Personalized recommendations</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} />
              <span>Secure checkouts and access</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 p-6 sm:p-8 md:p-10">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Sign in</h1>
            <p className="text-gray-600 text-sm mt-1">
              Continue where you left off.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-coral bg-white text-gray-900 placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-coral bg-white text-gray-900 placeholder:text-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                />
                Remember me
              </label>
              <Link
                href="#"
                className="text-sm text-brand-coral hover:opacity-80 font-semibold"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-semibold px-6 py-3 text-base bg-brand-coral text-white hover:shadow-lg hover:scale-[1.01]"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              New to BuzzBee?{" "}
              <Link
                href="/signup"
                className="text-brand-coral hover:opacity-80 font-semibold"
              >
                Create an account
              </Link>
            </p>
          </div>

          <div className="mt-5 flex gap-3">
            <button className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              Continue with Google
            </button>
            <button className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              Continue with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
