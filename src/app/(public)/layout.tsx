import type { Metadata } from "next";
import Navbar from "@/components/public/Navbar";

export const metadata: Metadata = {
  title: "SurfaceArt Palm Beach | Interior Vinyl Wraps · Palm Beach County",
  description:
    "Transform your kitchen, bathroom, TV wall or furniture with premium architectural vinyl wraps. No demolition. No dust. 80% less than renovation. 3M DI-NOC certified installer serving all of Palm Beach County.",
  openGraph: {
    title: "SurfaceArt Palm Beach | Interior Vinyl Wraps",
    description:
      "Premium interior vinyl wraps for Palm Beach County homes & businesses. 3M DI-NOC certified installer. No demolition. Free quote.",
    type: "website",
    locale: "en_US",
    siteName: "SurfaceArt Palm Beach",
  },
  twitter: {
    card: "summary_large_image",
    title: "SurfaceArt Palm Beach | Interior Vinyl Wraps",
    description: "Transform your interiors in 3-5 days. No demolition. No dust. Palm Beach County.",
  },
  robots: { index: true, follow: true },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
