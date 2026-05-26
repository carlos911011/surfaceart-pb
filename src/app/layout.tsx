import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import RevealObserver from "@/components/public/RevealObserver";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SurfaceArt Palm Beach | Interior Vinyl Wraps · Palm Beach County",
  description:
    "Transform your kitchen, bathroom, TV wall or furniture with premium architectural vinyl wraps. No demolition. No dust. 80% less than renovation. Serving all of Palm Beach County.",
  openGraph: {
    title: "SurfaceArt Palm Beach | Interior Vinyl Wraps",
    description:
      "Premium interior vinyl wraps for Palm Beach County homes & businesses. 3M DI-NOC certified installer.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${outfit.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <RevealObserver />
        {children}
      </body>
    </html>
  );
}
