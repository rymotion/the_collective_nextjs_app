"use client";

import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";

export default function Navigation() {
  const { isAuthenticated, user, signOut, loading, userProfile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await signOut();
      router.push('/');
    } else {
      router.push('/auth/signin');
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-t-0 border-x-0 rounded-none">
      <div className="container h-[var(--nav-height)] flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          THE <span className="text-primary">COLLECTIVE</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary' : 'hover:text-primary'}`}
          >
            {t('discover')}
          </Link>
          <Link
            href="/search"
            className={`text-sm font-medium transition-colors ${isActive('/search') ? 'text-primary' : 'hover:text-primary'}`}
          >
            {t('search')}
          </Link>
          <Link
            href="/genre"
            className={`text-sm font-medium transition-colors ${isActive('/genre') ? 'text-primary' : 'hover:text-primary'}`}
          >
            {t('genre')}
          </Link>

          {!loading && (
            <>
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center overflow-hidden">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-muted">
                          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface border border-white/10 rounded-lg shadow-xl py-1 animate-fade-in">
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-sm font-medium truncate">{userProfile?.displayName || user?.email}</p>
                      </div>
                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        {t('dashboard')}
                      </Link>
                      <button
                        onClick={() => {
                          handleAuthAction();
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/5 transition-colors"
                      >
                        {t('signOut')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/auth/signin"
                  className="btn btn-primary text-sm py-2 px-4"
                >
                  {t('signIn')}
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
