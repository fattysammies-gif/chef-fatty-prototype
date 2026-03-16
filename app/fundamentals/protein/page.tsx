"use client";

import { useState } from "react";
import Link from "next/link";

type Q1 = "absorb" | "distinct" | "render";
type Q2 = "blend" | "bite" | "richness";
type Q3 = "thin" | "ground" | "whole";
type Q4 = "start" | "middle" | "end";

const CUT_GRID = [
  { label: "Thin-sliced", slug: "thin", emoji: "🥩", examples: "beef, pork, chicken", timing: "Middle", note: "Marinade 15-30 min for tenderness. Velvet with cornstarch for a silky finish." },
  { label: "Ground", slug: "ground", emoji: "🫙", examples: "pork, chicken, tofu", timing: "Start", note: "Brown in small batches. Don't crowd — you want browning, not steaming." },
  { label: "Whole piece", slug: "whole", emoji: "🥚", examples: "egg, soft tofu, shrimp", timing: "End", note: "Added last to avoid overcooking. The residual heat does the work." },
  { label: "Cubed", slug: "cubed", emoji: "🎲", examples: "firm tofu, fish", timing: "Middle or end", note: "Sear first to build a crust. Don't over-stir or it breaks." },
];

const Q1_OPTIONS = [
  { value: "absorb" as Q1, label: "Absorb the sauce", desc: "Protein takes on the sauce flavour as it cooks" },
  { value: "distinct" as Q1, label: "Stay distinct", desc: "Protein keeps its own flavour alongside the sauce" },
  { value: "render" as Q1, label: "Render fat into the sauce", desc: "Fatty protein adds depth and body" },
];

const Q2_OPTIONS = [
  { value: "blend" as Q2, label: "Blend in", desc: "Becomes part of the sauce — ground meat, soft tofu" },
  { value: "bite" as Q2, label: "Bite contrast", desc: "Distinct texture vs. noodles — sliced beef, shrimp" },
  { value: "richness" as Q2, label: "Richness", desc: "Fatty, silky, heavy — pork belly, egg yolk" },
];

const Q3_OPTIONS = [
  { value: "thin" as Q3, label: "Thin-sliced", desc: "Quick cooking, high surface area for sauce contact" },
  { value: "ground" as Q3, label: "Ground or minced", desc: "Breaks down into sauce, gives body and depth" },
  { value: "whole" as Q3, label: "Whole or large piece", desc: "Poached, fried whole, or left intact" },
];

const Q4_OPTIONS = [
  { value: "start" as Q4, label: "Start — render or brown first", desc: "Builds the base flavour. Fatty proteins, ground meat." },
  { value: "middle" as Q4, label: "Middle — stir-fry with everything", desc: "Fast, high heat. Thin-sliced meat, shrimp." },
  { value: "end" as Q4, label: "End — poach or finish", desc: "Delicate proteins that overcook fast. Egg, soft tofu." },
];

export default function ProteinPage() {
  const [q1, setQ1] = useState<Q1 | null>(null);
  const [q2, setQ2] = useState<Q2 | null>(null);
  const [q3, setQ3] = useState<Q3 | null>(null);
  const [q4, setQ4] = useState<Q4 | null>(null);
  const [showCutGrid, setShowCutGrid] = useState(false);

  const allAnswered = q1 && q2 && q3 && q4;

  function reset() { setQ1(null); setQ2(null); setQ3(null); setQ4(null); }

  const resultCut = CUT_GRID.find((c) => c.slug === q3);
  const resultTiming = Q4_OPTIONS.find((o) => o.value === q4);

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
          <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-2">Chapter 03</p>
          <h1 className="font-serif text-4xl text-charcoal leading-tight mb-3">Protein</h1>
          <p className="text-stone text-sm leading-relaxed">
            How you cut and time your protein changes the entire dish. Answer 4 questions.
          </p>
        </div>

        {/* Q1 */}
        <div className="mb-7">
          <p className="font-semibold text-charcoal mb-3">1. How should protein interact with the sauce?</p>
          <div className="flex flex-col gap-2">
            {Q1_OPTIONS.map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => { setQ1(value); setQ2(null); setQ3(null); setQ4(null); }}
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
            <p className="font-semibold text-charcoal mb-3">2. What texture should it contribute?</p>
            <div className="flex flex-col gap-2">
              {Q2_OPTIONS.map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => { setQ2(value); setQ3(null); setQ4(null); }}
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

        {/* Q3 with cut guide */}
        {q1 && q2 && (
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-charcoal">3. How should it be cut?</p>
              <button
                onClick={() => setShowCutGrid((s) => !s)}
                className="text-xs text-sienna font-medium underline underline-offset-4 hover:text-sienna-hover"
              >
                {showCutGrid ? "Hide guide" : "Cut guide"}
              </button>
            </div>

            {showCutGrid && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {CUT_GRID.map(({ label, examples, timing, note, emoji }) => (
                  <div key={label} className="bg-ivory-card border border-ivory-border rounded-2xl p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg">{emoji}</span>
                      <span className="font-semibold text-charcoal text-xs">{label}</span>
                    </div>
                    <p className="text-[10px] text-stone-light mb-1">{examples}</p>
                    <p className="text-[10px] text-sienna font-medium mb-1.5">Add: {timing}</p>
                    <p className="text-[10px] text-stone leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {Q3_OPTIONS.map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => { setQ3(value); setQ4(null); }}
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

        {/* Q4 */}
        {q1 && q2 && q3 && (
          <div className="mb-7">
            <p className="font-semibold text-charcoal mb-3">4. When should it be added?</p>
            <div className="flex flex-col gap-2">
              {Q4_OPTIONS.map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => setQ4(value)}
                  className={`text-left rounded-2xl border-2 px-4 py-3.5 transition-all ${
                    q4 === value ? "border-sienna bg-sienna-light" : "border-ivory-border bg-white hover:border-stone/30"
                  }`}
                >
                  <p className={`font-semibold text-sm ${q4 === value ? "text-sienna" : "text-charcoal"}`}>{label}</p>
                  <p className="text-xs text-stone mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {allAnswered && resultCut && (
          <div className="bg-sienna-light border border-sienna/30 rounded-3xl p-6 mb-6">
            <p className="text-xs uppercase tracking-label font-semibold text-sienna mb-4">Your approach</p>
            <div className="flex gap-3 items-start mb-4">
              <span className="text-2xl shrink-0">{resultCut.emoji}</span>
              <div>
                <p className="font-semibold text-charcoal">
                  {resultCut.label} · {resultTiming?.label.split(" — ")[0]}
                </p>
                <p className="text-xs text-stone mt-1.5 leading-relaxed">{resultCut.note}</p>
              </div>
            </div>
            <div className="border-t border-sienna/20 pt-4">
              <Link
                href="/vault/gochujang-butter-noodles"
                className="text-sm font-semibold text-sienna hover:underline underline-offset-4"
              >
                See this in Gochujang Butter Noodles →
              </Link>
            </div>
          </div>
        )}

        {(q1 || q2 || q3 || q4) && (
          <button
            onClick={reset}
            className="text-xs text-stone-light underline underline-offset-4 hover:text-stone transition-colors mb-8 block"
          >
            Start over
          </button>
        )}

        {/* Back to fundamentals */}
        <div className="border-t border-ivory-border pt-6">
          <Link href="/fundamentals" className="flex items-center justify-between py-4 group">
            <div>
              <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-1">Back to</p>
              <p className="font-semibold text-charcoal group-hover:text-sienna transition-colors">The Framework →</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
