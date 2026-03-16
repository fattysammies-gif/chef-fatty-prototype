"use client";

import { useState } from "react";
import Link from "next/link";

const LEVERS = [
  { key: "salt", label: "Salt", emoji: "🧂", examples: "soy sauce, fish sauce, miso" },
  { key: "umami", label: "Umami", emoji: "🍄", examples: "msg, doubanjiang, oyster sauce" },
  { key: "fat", label: "Fat", emoji: "🫙", examples: "sesame oil, chili oil, butter" },
  { key: "acid", label: "Acid", emoji: "🍋", examples: "black vinegar, lime, rice vinegar" },
  { key: "heat", label: "Heat", emoji: "🌶️", examples: "gochujang, chili flakes, white pepper" },
  { key: "sweet", label: "Sweet", emoji: "🍯", examples: "sugar, mirin, coconut sugar" },
] as const;

type LeverKey = (typeof LEVERS)[number]["key"];

const SAUCE_COMBOS: {
  name: string;
  levers: LeverKey[];
  recipe?: string;
  recipeSlug?: string;
}[] = [
  { name: "Gochujang Butter", levers: ["salt", "fat", "heat", "sweet"], recipe: "Gochujang Butter Noodles", recipeSlug: "gochujang-butter-noodles" },
  { name: "Dan Dan", levers: ["salt", "umami", "fat", "heat"] },
  { name: "Pad Thai", levers: ["salt", "umami", "acid", "sweet"] },
  { name: "Sesame", levers: ["salt", "umami", "fat", "acid"] },
  { name: "Lo Mein", levers: ["salt", "umami", "fat", "sweet"] },
  { name: "Pho", levers: ["salt", "umami"] },
  { name: "Laksa", levers: ["salt", "umami", "fat", "heat"] },
  { name: "Miso Udon", levers: ["salt", "umami", "fat"] },
];

export default function SaucePage() {
  const [activeLeverKeys, setActiveLeverKeys] = useState<Set<LeverKey>>(new Set());
  const [selectedCombo, setSelectedCombo] = useState<string | null>(null);

  function selectCombo(comboName: string) {
    const combo = SAUCE_COMBOS.find((c) => c.name === comboName);
    if (!combo) return;
    setSelectedCombo(comboName);
    setActiveLeverKeys(new Set(combo.levers));
  }

  function toggleLever(key: LeverKey) {
    setSelectedCombo(null);
    const next = new Set(activeLeverKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setActiveLeverKeys(next);
  }

  const currentCombo = SAUCE_COMBOS.find(
    (c) =>
      c.levers.length === activeLeverKeys.size &&
      c.levers.every((l) => activeLeverKeys.has(l))
  );

  return (
    <div className="min-h-screen bg-ivory pb-24 md:pb-12 page-transition">
      <div className="max-w-2xl mx-auto px-5 md:px-8">

        {/* Back */}
        <div className="pt-12 pb-2">
          <Link href="/fundamentals" className="inline-flex items-center gap-2 text-sm text-stone hover:text-charcoal transition-colors group">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            The Framework
          </Link>
        </div>

        {/* Header */}
        <div className="py-6">
          <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-2">Chapter 01</p>
          <h1 className="font-serif text-4xl text-charcoal leading-tight mb-3">The Sauce System</h1>
          <p className="text-stone text-sm leading-relaxed">
            Every sauce is built from 6 levers. Tap to activate, or choose a sauce combo below.
          </p>
        </div>

        {/* Levers grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {LEVERS.map(({ key, label, emoji, examples }) => {
            const active = activeLeverKeys.has(key);
            return (
              <button
                key={key}
                onClick={() => toggleLever(key)}
                className={`rounded-2xl p-4 text-left border-2 transition-all duration-200 ${
                  active
                    ? "border-sienna bg-sienna-light shadow-sm"
                    : "border-ivory-border bg-white hover:border-stone/30"
                }`}
              >
                <div className="text-2xl mb-2">{emoji}</div>
                <p className={`font-semibold text-sm mb-1 ${active ? "text-sienna" : "text-charcoal"}`}>
                  {label}
                </p>
                <p className="text-[10px] text-stone leading-relaxed">{examples}</p>
              </button>
            );
          })}
        </div>

        {/* Active combo display */}
        {activeLeverKeys.size > 0 && (
          <div
            className={`rounded-2xl px-5 py-4 mb-6 border transition-all ${
              currentCombo
                ? "bg-sienna-light border-sienna/30"
                : "bg-ivory-card border-ivory-border"
            }`}
          >
            {currentCombo ? (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-charcoal">{currentCombo.name}</p>
                  <p className="text-xs text-stone mt-0.5">
                    {currentCombo.levers
                      .map((l) => LEVERS.find((lv) => lv.key === l)?.label)
                      .join(" + ")}
                  </p>
                </div>
                {currentCombo.recipeSlug && (
                  <Link
                    href={`/vault/${currentCombo.recipeSlug}`}
                    className="shrink-0 text-xs text-sienna font-semibold underline underline-offset-4 hover:text-sienna-hover"
                  >
                    See recipe →
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-sm text-stone">
                {activeLeverKeys.size} lever{activeLeverKeys.size > 1 ? "s" : ""} active
              </p>
            )}
          </div>
        )}

        {/* Sauce combo chips */}
        <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-4">
          Known combinations
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {SAUCE_COMBOS.map(({ name }) => (
            <button
              key={name}
              onClick={() => selectCombo(name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                selectedCombo === name
                  ? "bg-sienna text-white border-sienna"
                  : "bg-white border-ivory-border text-charcoal hover:border-stone/30"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Clear */}
        {activeLeverKeys.size > 0 && (
          <button
            onClick={() => { setActiveLeverKeys(new Set()); setSelectedCombo(null); }}
            className="text-xs text-stone-light underline underline-offset-4 hover:text-stone transition-colors mb-8 block"
          >
            Clear all levers
          </button>
        )}

        {/* Next chapter */}
        <div className="border-t border-ivory-border pt-6">
          <Link href="/fundamentals/noodles" className="flex items-center justify-between py-4 group">
            <div>
              <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-1">Next chapter</p>
              <p className="font-semibold text-charcoal group-hover:text-sienna transition-colors">
                Choosing Noodles →
              </p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
