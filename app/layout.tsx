import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import CursorPixel from "@/components/CursorPixel";
import ThemePicker from "@/components/ThemePicker";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-inter" });

const description =
  "Forward Deployed / Solutions Engineer, Full Stack + AI. I ship products end to end and add LLM features where they actually help.";

export const metadata: Metadata = {
  metadataBase: new URL("https://viral-sachde.vercel.app"),
  title: { default: "Viral Sachde · Forward Deployed Engineer · Full Stack + AI", template: "%s · Viral Sachde" },
  description,
  applicationName: "Viral Sachde",
  authors: [{ name: "Viral Sachde", url: "https://github.com/Viral-Sachde" }],
  openGraph: { type: "website", title: "Viral Sachde · Full Stack + AI", description, siteName: "Viral Sachde" },
  twitter: { card: "summary_large_image", title: "Viral Sachde · Full Stack + AI", description, creator: "@viralpullls" },
  appleWebApp: { title: "Viral Sachde", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        <noscript>
          <style>{`.reveal,.board .cell{opacity:1;transform:none}`}</style>
        </noscript>
        {children}
        <CursorPixel />
        <ThemePicker />
      </body>
    </html>
  );
}
