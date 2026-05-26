import type { Metadata } from "next";
import SessionProvider from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "Admin — SurfaceArt Palm Beach",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
