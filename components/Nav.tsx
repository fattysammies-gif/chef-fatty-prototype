"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const path = usePathname();
  const link = (href: string, label: string) => (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        path.startsWith(href) && href !== "/"
          ? "text-orange"
          : "text-muted hover:text-charcoal"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-cream-border">
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-charcoal tracking-tight">
          Chef Fatty
        </Link>
        <div className="flex items-center gap-7">
          {link("/recipes", "Recipes")}
          {link("/collections", "Collections")}
          <Link
            href="/collections/the-essentials"
            className="text-sm font-semibold bg-orange text-white px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Get The Essentials
          </Link>
        </div>
      </div>
    </nav>
  );
}
