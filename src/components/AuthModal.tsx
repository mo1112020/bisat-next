'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  onClose: () => void;
  redirectTo?: string;
}

type Tab = 'signin' | 'register';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const inputCls = 'w-full border border-bisat-black/[0.1] bg-[#fafafa] py-3.5 pl-10 pr-4 text-[13px] text-bisat-black placeholder:text-bisat-black/30 focus:border-bisat-black/30 focus:outline-none transition-colors';

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, redirectTo = '/checkout' }) => {
  const [tab, setTab] = useState<Tab>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleGoogle = async () => {
    setLoading(true);
    await signInWithGoogle(redirectTo);
    // Browser will navigate to /auth/callback — no need to setLoading(false)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    let result: { error: string | null };

    if (tab === 'signin') {
      result = await signInWithEmail(form.email, form.password);
    } else {
      if (!form.fullName.trim()) {
        setError('Please enter your full name.');
        setLoading(false);
        return;
      }
      result = await signUpWithEmail(form.email, form.password, form.fullName);
      if (!result.error) {
        setSuccess('Account created! Check your email to confirm, then sign in.');
        setTab('signin');
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onClose();
      router.push(redirectTo);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.22 }}
          className="w-full max-w-[420px] bg-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-bisat-black/[0.07] px-8 py-6">
            <h2 className="font-rh text-[1.5rem] font-light text-bisat-black">
              {tab === 'signin' ? 'Sign in to continue' : 'Create your account'}
            </h2>
            <button onClick={onClose} className="text-bisat-black/35 transition-colors hover:text-bisat-black">
              <X size={18} />
            </button>
          </div>

          <div className="px-8 py-7">
            {/* Tabs */}
            <div className="mb-7 flex border-b border-bisat-black/[0.07]">
              {(['signin', 'register'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(null); setSuccess(null); }}
                  className={`mr-8 pb-3 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors ${
                    tab === t
                      ? '-mb-px border-b-2 border-bisat-black text-bisat-black'
                      : 'text-bisat-black/35 hover:text-bisat-black'
                  }`}
                >
                  {t === 'signin' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="mb-5 flex w-full items-center justify-center gap-3 border border-bisat-black/[0.12] bg-white py-3 text-[12px] font-medium text-bisat-black transition-colors hover:bg-[#f7f5f2] disabled:opacity-50"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-bisat-black/[0.07]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-bisat-black/30">or</span>
              <div className="h-px flex-1 bg-bisat-black/[0.07]" />
            </div>

            {/* Success message */}
            {success && (
              <p className="mb-4 rounded bg-green-50 px-4 py-3 text-[12px] text-green-700">{success}</p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {tab === 'register' && (
                <div className="relative">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-bisat-black/25" />
                  <input
                    name="fullName"
                    type="text"
                    placeholder="Full name"
                    value={form.fullName}
                    onChange={handleField}
                    required
                    className={inputCls}
                  />
                </div>
              )}

              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-bisat-black/25" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleField}
                  required
                  className={inputCls}
                />
              </div>

              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-bisat-black/25" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleField}
                  required
                  minLength={6}
                  className="w-full border border-bisat-black/[0.1] bg-[#fafafa] py-3.5 pl-10 pr-10 text-[13px] text-bisat-black placeholder:text-bisat-black/30 focus:border-bisat-black/30 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-bisat-black/25 transition-colors hover:text-bisat-black"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {error && (
                <p className="text-[11px] text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 bg-bisat-black py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:bg-bisat-charcoal disabled:opacity-60"
              >
                {loading ? 'Please wait…' : tab === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
