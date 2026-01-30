'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { signup } from '@/lib/services/auth';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'attendee',
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (!formData.termsAccepted) {
      setError('You must accept the Terms of Service');
      setLoading(false);
      return;
    }
    try {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role as 'attendee' | 'organizer',
        termsAccepted: formData.termsAccepted,
      });
      // Redirect to login after successful signup
      router.push('/login');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Signup failed';
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
            <h2 className="text-3xl font-bold mb-3 leading-tight">Join BuzzBee</h2>
            <p className="text-white/80 text-sm">Discover and host amazing events across Nepal.</p>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Sparkles size={18} />
              <span>Curated events tailored to your interests</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} />
              <span>Secure bookings and organizer verification</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} />
              <span>Stay updated with timely reminders</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 p-6 sm:p-8 md:p-10">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-600 text-sm mt-1">It takes less than a minute.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-coral bg-white text-gray-900 placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-coral bg-white text-gray-900 placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-coral bg-white text-gray-900"
              >
                <option value="attendee">Event Attendee</option>
                <option value="organizer">Event Organizer</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-coral bg-white text-gray-900 placeholder:text-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <input 
                type="checkbox" 
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 mt-1" 
              />
              <span className="text-sm text-gray-600 leading-snug">
                I agree to the{' '}
                <a href="#" className="text-brand-coral hover:opacity-80 font-semibold">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-brand-coral hover:opacity-80 font-semibold">
                  Privacy Policy
                </a>
              </span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-semibold px-6 py-3 text-base bg-brand-coral text-white hover:shadow-lg hover:scale-[1.01]"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-coral hover:opacity-80 font-semibold">
                Sign in here
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
