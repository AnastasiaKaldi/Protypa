"use client";

import { usePathname } from "next/navigation";

// Routes where the public marketing chrome (Header / Footer) should NOT render.
// Admin and account routes have their own headers; auth pages are full-bleed.
const HIDE_ON = ["/admin"];

export function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const hide = HIDE_ON.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (hide) return null;
  return <>{children}</>;
}
