"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nv_prefs");
      if (raw) {
        const prefs = JSON.parse(raw);
        if (prefs.hasOnboarded) {
          router.replace("/vault");
          return;
        }
      }
    } catch {
      // ignore
    }
    router.replace("/onboarding");
  }, [router]);

  return <div className="min-h-screen bg-cream" />;
}
