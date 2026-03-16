"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/vault", label: "Vault" },
  { href: "/shopping-list", label: "Shopping List" },
  { href: "/settings", label: "Settings" },
];

export default function TopNav() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/onboarding") return null;

  return (
    <header
      className="hidden md:flex sticky top-0 z-50 bg-ivory/95 backdrop-blur-md border-b border-ivory-border"
      style={{ boxShadow: "0 1px 0 rgba(226,217,204,0.8)" }}
    >
      <div className="max-w-7xl mx-auto w-full px-8 lg:px-12 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <span className="text-xl">🍜</span>
          <div>
            <p className="text-sm font-semibold text-charcoal group-hover:text-sienna transition-colors leading-tight">
              The Noodle Vault
            </p>
            <p className="text-[10px] uppercase tracking-label text-stone-light">Chef Fatty</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {LINKS.map(({ href, label }) => {
            const active =
              pathname === href ||
              (href === "/vault" && pathname.startsWith("/vault/")) ||
              (href !== "/vault" && pathname.startsWith(href + "/"));
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-sienna/10 text-sienna"
                    : "text-stone hover:text-charcoal hover:bg-ivory-card"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
