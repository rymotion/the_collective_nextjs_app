"use client";

import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const { isAuthenticated, user, signOut, loading, profile } =
    useSupabaseAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle scroll behavior
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          setIsScrolled(currentScrollY > 50);

          if (currentScrollY < lastScrollY) {
            setIsScrollingUp(true);
          } else {
            setIsScrollingUp(false);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await signOut();
      router.push("/");
    } else {
      const pathWithoutLocale =
        pathname.replace(/^\/(en|es)(?=\/|$)/, "") || "/";
      router.push(
        `/auth/signin?redirect=${encodeURIComponent(pathWithoutLocale)}`
      );
    }
  };

  const isActive = (path: string) => pathname === path;

  const shouldExpand = !isScrolled || isHovered || isScrollingUp;
  const navHeight = shouldExpand ? 200 : 80;

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--nav-height",
      `${navHeight}px`
    );
  }, [navHeight]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass-panel border-t-0 border-x-0 rounded-none transition-all duration-300 ease-in-out"
      style={{ height: navHeight }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="container flex items-center justify-between transition-all duration-300"
        style={{ height: navHeight }}
      >
        <Link
          href="/"
          className={`font-bold tracking-tighter transition-all duration-300 ${
            shouldExpand ? "text-h1" : "text-h3"
          }`}
        >
          <span className="text-primary">CineBayan</span>
        </Link>

        <div
          className={`flex items-center transition-all duration-300 ${
            shouldExpand ? "gap-8" : "gap-6"
          }`}
        >
          <Link
            href="/"
            className={`font-medium transition-all duration-300 ${
              shouldExpand ? "text-body" : "text-caption"
            } ${isActive("/") ? "text-primary" : "hover:text-primary"}`}
          >
            {t("discover")}
          </Link>

          {!loading && (
            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div
                      className={`${styles.profileButton} ${
                        shouldExpand ? "w-12 h-12" : "w-8 h-8"
                      }`}
                    >
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className={`${styles.profileIcon} ${
                            shouldExpand ? "w-7 h-7" : "w-5 h-5"
                          }`}
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                        </svg>
                      )}
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface border border-white/10 rounded-lg shadow-xl py-1 animate-fade-in">
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-sm font-medium truncate">
                          {profile?.display_name || user?.email}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        {t("dashboard")}
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleAuthAction}
                className={`font-semibold transition-all duration-300 ${
                  isAuthenticated
                    ? "text-red-500 hover:text-red-400"
                    : "btn btn-primary"
                } ${
                  shouldExpand ? "text-base py-3 px-6" : "text-sm py-2 px-4"
                }`}
              >
                {isAuthenticated ? "Logout" : "Login"}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
