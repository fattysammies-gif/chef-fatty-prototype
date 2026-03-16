"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nv_prefs");
      if (raw) {
        const prefs = JSON.parse(raw);
        if (prefs.hasOnboarded) {
          const guideSeen = localStorage.getItem("nv_guide_seen");
          router.replace(guideSeen ? "/vault" : "/guide");
          return;
        }
      }
    } catch {
      // ignore
    }
    router.replace("/onboarding");
  }, [router]);

  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6" style={{ fontSize: 72 }}>🍜</div>
      <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-3">Chef Fatty</p>
      <h1 className="font-serif text-5xl text-charcoal leading-tight tracking-tight mb-6">
        The Noodle<br />Vault
      </h1>
      <p className="text-stone text-base mb-10">Loading your vault…</p>
      <Link href="/onboarding"
        className="text-sm text-stone-light underline underline-offset-4 hover:text-stone transition-colors">
        Tap here if nothing happens
      </Link>
    </div>
  );
}
