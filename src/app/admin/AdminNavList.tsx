"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type AdminNavItem = { href: string; label: string };

export function AdminNavList({
  items,
  onSelect,
}: {
  items: AdminNavItem[];
  onSelect?: () => void;
}) {
  const pathname = usePathname();
  return (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/admin" && pathname?.startsWith(item.href + "/"));
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onSelect}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? "!text-white bg-white/10"
                  : "!text-white/70 hover:!text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
