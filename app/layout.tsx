import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";
import OfflineBanner from "@/components/OfflineBanner";

const siteUrl = "https://actionflow-sand.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ActionFlow — Turn Meeting Notes Into Organized Action",
    template: "%s | ActionFlow",
  },
  description:
    "ActionFlow uses AI to turn messy meeting notes into clear summaries and action items, then tracks every task across every meeting in one dashboard.",
  keywords: ["meeting notes", "AI summary", "action items", "productivity", "meeting tool"],
  authors: [{ name: "ActionFlow" }],
  openGraph: {
    title: "ActionFlow — Turn Meeting Notes Into Organized Action",
    description:
      "AI-powered meeting notes summarizer and action item tracker. Paste your notes, get clarity, never lose a follow-up again.",
    url: siteUrl,
    siteName: "ActionFlow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ActionFlow — Turn Meeting Notes Into Organized Action",
    description:
      "AI-powered meeting notes summarizer and action item tracker.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col">
        <SkipLink />
        <OfflineBanner />
        <Navbar />
        <div id="main-content" className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}