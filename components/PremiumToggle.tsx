"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface PremiumToggleProps {
  isPremium: boolean;
}

export default function PremiumToggle({ isPremium }: PremiumToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggle = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (isPremium) {
      params.delete("premium");
    } else {
      params.set("premium", "true");
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggle}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-sm font-semibold border transition-all ${
          isPremium
            ? "bg-orange text-white border-orange shadow-orange/30"
            : "bg-white text-charcoal border-cream-border shadow-charcoal/10"
        }`}
      >
        <span className="text-base">{isPremium ? "🔓" : "🔒"}</span>
        <span>{isPremium ? "Premium ON" : "Premium OFF"}</span>
        <span className="text-xs opacity-60 ml-1">prototype</span>
      </button>
    </div>
  );
}
