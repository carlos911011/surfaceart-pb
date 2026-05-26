import { redirect } from "next/navigation";

// Root page is served from src/app/page.tsx
// This file keeps the (public) route group valid for /gallery and sub-pages
export default function PublicIndex() {
  redirect("/");
}
