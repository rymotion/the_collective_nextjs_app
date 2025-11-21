"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Input from "@/components/Input";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const router = useRouter();
  const t = useTranslations('Auth');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container py-24 flex items-center justify-center min-h-screen">
      <div className="glass-panel p-8 max-w-md w-full">
        <h1 className="text-h1 mb-2 text-center">{t('welcome')}</h1>
        <p className="text-subtitle text-center mb-8">{t('signInSubtitle')}</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
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

          <div>
            <Input
              label={t('password')}
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
              disabled={loading}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
              }
            />
            <div className="flex justify-end mt-2">
              <Link href="/auth/forgot-password" className="text-xs text-primary hover:text-white transition-colors">
                {t('forgotPasswordLink')}
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('signingIn') : t('signIn')}
          </button>
        </form>


        <p className="text-center text-sm text-muted mt-6">
          {t('noAccount')}{" "}
          <Link href="/auth/signup" className="text-primary hover:text-white transition-colors font-medium">
            {t('signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
}
