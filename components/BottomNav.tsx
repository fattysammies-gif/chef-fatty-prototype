"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function GuideIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#C85C0A" : "#A09890"} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      <line x1="9" y1="7" x2="15" y2="7" />
      <line x1="9" y1="11" x2="15" y2="11" />
    </svg>
  );
}

function VaultIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#C85C0A" : "#A09890"} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function BagIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#C85C0A" : "#A09890"} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function SlidersIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#C85C0A" : "#A09890"} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

const TABS = [
  { href: "/fundamentals", label: "Guide", Icon: GuideIcon, matchPrefixes: ["/guide", "/fundamentals"] },
  { href: "/vault", label: "Vault", Icon: VaultIcon, matchPrefixes: ["/vault"] },
  { href: "/shopping-list", label: "Shopping", Icon: BagIcon, matchPrefixes: ["/shopping-list"] },
  { href: "/settings", label: "Settings", Icon: SlidersIcon, matchPrefixes: ["/settings"] },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/onboarding" || pathname === "/" || pathname === "/guide") return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-ivory/95 backdrop-blur-md border-t border-ivory-border no-print"
      style={{
        boxShadow: "0 -1px 0 rgba(226, 217, 204, 0.8), 0 -8px 24px rgba(26, 23, 20, 0.04)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="max-w-lg mx-auto h-16 flex items-center">
        {TABS.map(({ href, label, Icon, matchPrefixes }) => {
          const active = matchPrefixes.some((prefix) =>
            pathname === prefix || pathname.startsWith(prefix + "/")
          );
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1 h-full min-h-[44px]"
            >
              <Icon active={active} />
              <span
                className={`text-[10px] font-medium tracking-wider uppercase ${
                  active ? "text-sienna" : "text-stone-light"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
