"use client";

import { useState, useEffect, useRef } from "react";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import Input from "@/components/Input";
import Toast from "@/components/Toast";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, isAuthenticated, loading: authLoading } = useSupabaseAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations('Auth');

  // Track if we've already redirected to prevent double redirects
  const hasRedirected = useRef(false);

  // Get redirect parameter from URL
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  // Handle redirect after successful authentication
  useEffect(() => {
    // Only redirect if:
    // 1. User is authenticated
    // 2. Auth is not loading
    // 3. We haven't already redirected
    if (isAuthenticated && !authLoading && !hasRedirected.current) {
      hasRedirected.current = true;

      // Use the redirect parameter or default to dashboard
      const finalPath = redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`;

      // Small delay to ensure auth state is fully propagated
      setTimeout(() => {
        router.push(finalPath);
      }, 100);
    }
  }, [isAuthenticated, authLoading, redirectPath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      // Don't redirect here - let the useEffect handle it after auth state updates
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
      setLoading(false);
    }
  };


  return (
    <>
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError("")}
        />
      )}

      <div className="container py-24 flex items-center justify-center min-h-screen">
        <div className="glass-panel p-8 max-w-md w-full">
          <h1 className="text-h1 mb-2 text-center">{t('welcome')}</h1>
          <p className="text-subtitle text-center mb-8">{t('signInSubtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-6 mb-6">
            <Input
              label={t('email')}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              required
              disabled={loading}
            // icon={
            //   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            //     <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
            //     <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
            //   </svg>
            // }
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
              // icon={
              //   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              //     <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              //   </svg>
              // }
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
            <Link
              href={`/auth/signup${redirectPath !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
              className="text-primary hover:text-white transition-colors font-medium"
            >
              {t('signUp')}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
