"use client";

import { useState } from "react";
import Link from "next/link";

type Q1 = "absorb" | "cling" | "float";
type Q2 = "springy" | "soft" | "thick";
type Q3 = "stirfry" | "broth" | "cold";

interface NoodleResult {
  name: string;
  description: string;
  example: string;
  exampleSlug?: string;
}

const RESULTS: Record<string, NoodleResult> = {
  "absorb-springy-stirfry": {
    name: "Alkaline wheat noodles (ramen-style)",
    description: "Springy, chewy noodles that soak up sauce from the inside. Made with alkaline water — that's why they're yellow and bouncy.",
    example: "Gochujang Butter Noodles",
    exampleSlug: "gochujang-butter-noodles",
  },
  "cling-soft-stirfry": {
    name: "Rice noodles (thin, flat)",
    description: "Silky, flat noodles that coat in sauce without absorbing too much. Essential for Thai stir-fries.",
    example: "Pad Thai",
  },
  "float-soft-broth": {
    name: "Flat rice noodles (wide)",
    description: "Wide, delicate noodles that float in broth and soak up flavour without falling apart.",
    example: "Beef Pho",
  },
  "cling-springy-cold": {
    name: "Soba (buckwheat)",
    description: "Nutty, earthy noodles that hold their texture cold and pair beautifully with sesame or soy dressings.",
    example: "Cold Sesame Soba",
  },
  "absorb-thick-stirfry": {
    name: "Udon (thick wheat)",
    description: "Thick, pillowy noodles that absorb rich sauces. Great for carbonara-style or butter-based dishes.",
    example: "Udon Carbonara",
  },
  "float-springy-broth": {
    name: "Thin wheat noodles (wonton-style)",
    description: "Light and springy in broth — absorbs flavour as it sits. Classic for wonton soups.",
    example: "Wonton Noodle Soup",
  },
  "cling-thick-stirfry": {
    name: "Wide rice noodles (ho fun)",
    description: "Chewy, wide, and great at clinging to dark sauces. Essential for Pad See Ew.",
    example: "Pad See Ew",
  },
  "absorb-springy-broth": {
    name: "Ramen noodles in broth",
    description: "Classic ramen — springy noodles that absorb broth as you eat. The longer they sit, the better.",
    example: "Tonkotsu Ramen",
  },
};

const Q1_OPTIONS = [
  { value: "absorb" as Q1, label: "Absorb it", desc: "Noodles soak up sauce from the inside" },
  { value: "cling" as Q1, label: "Cling to sauce", desc: "Sauce coats the outside of each noodle" },
  { value: "float" as Q1, label: "Float in broth", desc: "Noodles sit in liquid and soak as you eat" },
];

const Q2_OPTIONS = [
  { value: "springy" as Q2, label: "Springy + chewy", desc: "Bounce, bite, resistance" },
  { value: "soft" as Q2, label: "Soft + silky", desc: "Smooth, delicate, glides" },
  { value: "thick" as Q2, label: "Thick + filling", desc: "Dense, pillowy, substantial" },
];

const Q3_OPTIONS = [
  { value: "stirfry" as Q3, label: "High-heat stir-fry", desc: "Wok, skillet, fast and hot" },
  { value: "broth" as Q3, label: "Simmered in broth", desc: "Long cook, slow flavour" },
  { value: "cold" as Q3, label: "Cold or dressed", desc: "Chilled, tossed, no heat" },
];

export default function NoodlesPage() {
  const [q1, setQ1] = useState<Q1 | null>(null);
  const [q2, setQ2] = useState<Q2 | null>(null);
  const [q3, setQ3] = useState<Q3 | null>(null);

  const key = q1 && q2 && q3 ? `${q1}-${q2}-${q3}` : null;
  const result = key ? (RESULTS[key] ?? null) : null;

  function reset() { setQ1(null); setQ2(null); setQ3(null); }

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
          <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-2">Chapter 02</p>
          <h1 className="font-serif text-4xl text-charcoal leading-tight mb-3">Choosing Noodles</h1>
          <p className="text-stone text-sm leading-relaxed">
            Answer 3 questions and get the right noodle for your dish.
          </p>
        </div>

        {/* Q1 */}
        <div className="mb-7">
          <p className="font-semibold text-charcoal mb-3">1. How should the noodles carry flavor?</p>
          <div className="flex flex-col gap-2">
            {Q1_OPTIONS.map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => { setQ1(value); setQ2(null); setQ3(null); }}
                className={`text-left rounded-2xl border-2 px-4 py-3.5 transition-all ${
                  q1 === value ? "border-sienna bg-sienna-light" : "border-ivory-border bg-white hover:border-stone/30"
                }`}
              >
                <p className={`font-semibold text-sm ${q1 === value ? "text-sienna" : "text-charcoal"}`}>{label}</p>
                <p className="text-xs text-stone mt-0.5">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Q2 */}
        {q1 && (
          <div className="mb-7">
            <p className="font-semibold text-charcoal mb-3">2. What texture should the dish have?</p>
            <div className="flex flex-col gap-2">
              {Q2_OPTIONS.map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => { setQ2(value); setQ3(null); }}
                  className={`text-left rounded-2xl border-2 px-4 py-3.5 transition-all ${
                    q2 === value ? "border-sienna bg-sienna-light" : "border-ivory-border bg-white hover:border-stone/30"
                  }`}
                >
                  <p className={`font-semibold text-sm ${q2 === value ? "text-sienna" : "text-charcoal"}`}>{label}</p>
                  <p className="text-xs text-stone mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q3 */}
        {q1 && q2 && (
          <div className="mb-7">
            <p className="font-semibold text-charcoal mb-3">3. What&apos;s the cooking method?</p>
            <div className="flex flex-col gap-2">
              {Q3_OPTIONS.map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => setQ3(value)}
                  className={`text-left rounded-2xl border-2 px-4 py-3.5 transition-all ${
                    q3 === value ? "border-sienna bg-sienna-light" : "border-ivory-border bg-white hover:border-stone/30"
                  }`}
                >
                  <p className={`font-semibold text-sm ${q3 === value ? "text-sienna" : "text-charcoal"}`}>{label}</p>
                  <p className="text-xs text-stone mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {key && (
          result ? (
            <div className="bg-sienna-light border border-sienna/30 rounded-3xl p-6 mb-6">
              <p className="text-xs uppercase tracking-label font-semibold text-sienna mb-3">Your noodle</p>
              <p className="font-serif text-2xl text-charcoal mb-3">{result.name}</p>
              <p className="text-stone text-sm leading-relaxed mb-4">{result.description}</p>
              <div className="border-t border-sienna/20 pt-4">
                <p className="text-xs text-stone-light mb-2">See it in a recipe:</p>
                {result.exampleSlug ? (
                  <Link
                    href={`/vault/${result.exampleSlug}`}
                    className="text-sm font-semibold text-sienna hover:underline underline-offset-4"
                  >
                    {result.example} →
                  </Link>
                ) : (
                  <p className="text-sm font-semibold text-charcoal">{result.example}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-ivory-card border border-ivory-border rounded-2xl p-5 mb-6">
              <p className="text-sm text-stone">This combination is less common — try adjusting your answers.</p>
            </div>
          )
        )}

        {/* Reset */}
        {(q1 || q2 || q3) && (
          <button
            onClick={reset}
            className="text-xs text-stone-light underline underline-offset-4 hover:text-stone transition-colors mb-8 block"
          >
            Start over
          </button>
        )}

        {/* Next */}
        <div className="border-t border-ivory-border pt-6">
          <Link href="/fundamentals/protein" className="flex items-center justify-between py-4 group">
            <div>
              <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-1">Next chapter</p>
              <p className="font-semibold text-charcoal group-hover:text-sienna transition-colors">Protein →</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
