"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";

export default function PageTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Get a human-readable page name from the pathname
        const getPageName = (path: string): string => {
            // Remove locale prefix (e.g., /en, /es)
            const pathWithoutLocale = path.replace(/^\/[a-z]{2}(\/|$)/, "/");

            // Map routes to readable names
            const routeMap: Record<string, string> = {
                "/": "Home",
                "/search": "Search",
                "/genre": "Genre Browse",
                "/create-pitch": "Create Pitch",
                "/auth/signin": "Sign In",
                "/auth/signup": "Sign Up",
                "/dashboard": "Dashboard",
            };

            // Check for exact matches
            if (routeMap[pathWithoutLocale]) {
                return routeMap[pathWithoutLocale];
            }

            // Handle dynamic routes
            if (pathWithoutLocale.startsWith("/fund/")) {
                return "Fund Pitch";
            }
            if (pathWithoutLocale.startsWith("/pitches/")) {
                return "Pitch Details";
            }
            if (pathWithoutLocale.startsWith("/projects/")) {
                return "Pitch Details"; // Legacy route support
            }
            if (pathWithoutLocale.startsWith("/pitch/")) {
                return "Pitch Details";
            }

            // Default to pathname
            return pathWithoutLocale || "Unknown";
        };

        const pageName = getPageName(pathname);

        // Track page view with custom properties
        track("Page View", {
            page: pageName,
            path: pathname,
        });

        // Log for debugging (remove in production if needed)
        console.log(`[Analytics] Page View: ${pageName} (${pathname})`);
    }, [pathname]);

    return null; // This component doesn't render anything
}
