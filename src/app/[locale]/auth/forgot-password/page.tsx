"use client";

import { useState } from "react";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Input from "@/components/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { resetPassword } = useSupabaseAuth();
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

        <form onSubmit={handleSubmit} className="space-y-6 mb-6">
          <Input
            label={t('email')}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            required
            disabled={loading}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
              </svg>
            }
          />

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
