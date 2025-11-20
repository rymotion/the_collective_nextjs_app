"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { resetPassword } = useAuth();
  const t = useTranslations('Auth');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-24 flex items-center justify-center min-h-screen">
      <div className="glass-panel p-8 max-w-md w-full">
        <h1 className="text-h1 mb-2 text-center">{t('forgotPassword')}</h1>
        <p className="text-subtitle text-center mb-8">{t('forgotPasswordSubtitle')}</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-lg mb-6 text-sm">
            {t('resetEmailSent')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('sending') : t('sendResetLink')}
          </button>
        </form>

        <div className="text-center">
          <Link href="/auth/signin" className="text-sm text-primary hover:text-white transition-colors font-medium">
            &larr; {t('backToSignIn')}
          </Link>
        </div>
      </div>
    </div>
  );
}
