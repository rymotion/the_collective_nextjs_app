import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "The Collective | Screenplay Proposals",
  description: "Discover and fund the next big movie hit.",
};

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Providers } from "@/components/Providers";
import OfflineIndicator from "@/components/OfflineIndicator";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navigation />
            <main className="pt-[var(--nav-height)] min-h-screen flex flex-col">
              {children}
            </main>
            <Footer />
            <OfflineIndicator />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
