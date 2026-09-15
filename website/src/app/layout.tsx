import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const SITE_URL = "https://sethear.com";
const DEFAULT_DESCRIPTION =
  "SetHear is an AI phone companion for seniors who live alone — daily check-in calls, medication reminders, and family updates, in English, French, Spanish, Hindi, Punjabi, or Mandarin.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SetHear — A Friendly Daily Call for Seniors",
    template: "%s | SetHear",
  },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "SetHear",
    title: "SetHear — A Friendly Daily Call for Seniors",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    images: ["/icon-512.png"],
  },
  twitter: {
    card: "summary",
    title: "SetHear — A Friendly Daily Call for Seniors",
    description: DEFAULT_DESCRIPTION,
    images: ["/icon-512.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SetHear",
  },
  icons: {
    apple: "/apple-touch-icon.png",
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport = {
  themeColor: "#d97706",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-800">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
