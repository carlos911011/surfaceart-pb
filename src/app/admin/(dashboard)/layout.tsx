"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/quotes": "Quote Requests",
  "/admin/gallery": "Gallery",
  "/admin/reviews": "Reviews",
  "/admin/settings": "Settings",
};

function getTitle(pathname: string): string {
  for (const [prefix, label] of Object.entries(PAGE_TITLES)) {
    if (pathname === prefix || (prefix !== "/admin" && pathname.startsWith(prefix))) {
      return label;
    }
  }
  return "Admin";
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <div className="flex h-screen bg-warm-white overflow-hidden">
      {/* Sidebar — desktop: always visible, mobile: drawer */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:w-60">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-20 bg-carbon/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-30 w-60 lg:hidden">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          title={title}
          userEmail={session?.user?.email}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
