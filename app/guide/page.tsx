"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SWIPE_THRESHOLD = 50;

const PARTS = [
  { emoji: "🧂", name: "Sauce", role: "The primary source of seasoning and flavor direction. Every bowl starts here." },
  { emoji: "🍜", name: "Noodles", role: "The structural base and central starch. Choose based on sauce and cooking method." },
  { emoji: "🥩", name: "Protein", role: "Source of body and depth. How it's cut and timed changes the whole dish." },
  { emoji: "🥬", name: "Vegetables", role: "Add texture variety and balance richness. Think contrast, not filler." },
  { emoji: "🧄", name: "Aromatics", role: "Shape perception and aroma. Garlic, ginger, scallions — these set the tone." },
  { emoji: "✨", name: "Finish", role: "The final adjustment. Acid, oil, or heat that ties everything together." },
];

const TOTAL_SCREENS = 3;

export default function GuidePage() {
  const router = useRouter();
  const [screen, setScreen] = useState(0);
  const [expandedPart, setExpandedPart] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const startX = useRef(0);
  const startY = useRef(0);
  const dragging = useRef(false);

  const allRevealed = revealed.size >= PARTS.length;

  function markGuideSeen() {
    try { localStorage.setItem("nv_guide_seen", "true"); } catch {}
  }

  function goNext() {
    if (screen < TOTAL_SCREENS - 1) setScreen((s) => s + 1);
  }

  function goPrev() {
    if (screen > 0) setScreen((s) => s - 1);
  }

  function handleReveal(i: number) {
    setExpandedPart(expandedPart === i ? null : i);
    setRevealed((prev) => new Set([...prev, i]));
  }

  function handlePointerDown(e: React.PointerEvent) {
    startX.current = e.clientX;
    startY.current = e.clientY;
    dragging.current = true;
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!dragging.current) return;
    dragging.current = false;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) goNext();
      else goPrev();
    }
  }

  return (
    <div
      className="min-h-screen bg-ivory flex flex-col select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-14 pb-4 shrink-0">
        {Array.from({ length: TOTAL_SCREENS }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === screen ? 24 : 6,
              backgroundColor: i <= screen ? "#C85C0A" : "#E2D9CC",
            }}
          />
        ))}
      </div>

      {/* ── Screen 0: Hook ── */}
      {screen === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="mb-8" style={{ fontSize: 72 }}>🍜</div>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight tracking-tight mb-6">
            A noodle bowl is built,<br />not assembled.
          </h1>
          <p className="text-stone text-lg leading-8 mb-14 max-w-sm">
            Every great bowl has 6 components working together. Learn the system once — cook it forever.
          </p>
          <button
            onClick={goNext}
            className="bg-sienna text-white rounded-2xl px-10 py-4 font-semibold text-base hover:bg-sienna-hover transition-colors"
          >
            Show me the system →
          </button>
          <button
            onClick={() => { markGuideSeen(); router.push("/vault"); }}
            className="mt-5 text-sm text-stone-light underline underline-offset-4 hover:text-stone transition-colors"
          >
            Skip to recipes
          </button>
        </div>
      )}

      {/* ── Screen 1: 6-part map ── */}
      {screen === 1 && (
        <div className="flex-1 flex flex-col px-5 pt-2 pb-6 max-w-lg mx-auto w-full">
          <div className="mb-5">
            <h2 className="font-serif text-3xl text-charcoal mb-1">The 6 Parts</h2>
            <p className="text-stone text-sm">Tap each one to see its role.</p>
          </div>

          <div className="flex flex-col gap-2.5 flex-1">
            {PARTS.map((part, i) => (
              <button
                key={i}
                onClick={() => handleReveal(i)}
                className={`w-full text-left rounded-2xl border-2 transition-all duration-200 ${
                  expandedPart === i
                    ? "border-sienna bg-sienna-light"
                    : revealed.has(i)
                    ? "border-ivory-border bg-ivory-card"
                    : "border-ivory-border bg-white hover:border-stone/30"
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <span style={{ fontSize: 22 }}>{part.emoji}</span>
                  <span className={`font-semibold text-sm ${expandedPart === i ? "text-sienna" : "text-charcoal"}`}>
                    {part.name}
                  </span>
                  {revealed.has(i) && expandedPart !== i && (
                    <span className="ml-auto text-sienna text-xs font-bold">✓</span>
                  )}
                  {expandedPart === i && (
                    <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C85C0A" strokeWidth="2.5">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  )}
                  {!revealed.has(i) && expandedPart !== i && (
                    <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A09890" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </div>
                {expandedPart === i && (
                  <p className="px-4 pb-4 pt-0 text-sm text-stone leading-relaxed">{part.role}</p>
                )}
              </button>
            ))}
          </div>

          {allRevealed && (
            <p className="text-xs text-stone-light font-medium uppercase tracking-label text-center mt-4 mb-2">
              These aren&apos;t steps — they&apos;re levers.
            </p>
          )}

          <button
            onClick={goNext}
            className="mt-3 w-full bg-charcoal text-white rounded-2xl py-4 font-semibold text-base hover:opacity-90 transition-opacity"
          >
            {allRevealed ? "Got it →" : "Continue →"}
          </button>
        </div>
      )}

      {/* ── Screen 2: See it in action ── */}
      {screen === 2 && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-lg mx-auto w-full">
          <div className="w-full bg-ivory-card border border-ivory-border rounded-3xl p-8 mb-6 text-center">
            <div className="text-4xl mb-4">🍳</div>
            <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-3">
              See it in action
            </p>
            <h2 className="font-serif text-2xl text-charcoal leading-tight mb-3">
              The Gochujang Butter Noodles recipe is built on exactly this system.
            </h2>
            <p className="text-stone text-sm leading-relaxed">
              Every component has a purpose. Walk through it once and the whole framework clicks.
            </p>
          </div>

          <Link
            href="/vault/gochujang-butter-noodles"
            onClick={markGuideSeen}
            className="w-full bg-sienna text-white rounded-2xl py-4 font-semibold text-base text-center hover:bg-sienna-hover transition-colors mb-3 block"
          >
            Walk me through the recipe →
          </Link>

          <Link
            href="/fundamentals"
            onClick={markGuideSeen}
            className="w-full bg-ivory-card border border-ivory-border text-charcoal rounded-2xl py-4 font-semibold text-sm text-center hover:bg-ivory transition-colors block"
          >
            Dive into the framework first →
          </Link>

          <button
            onClick={() => { markGuideSeen(); router.push("/vault"); }}
            className="mt-5 text-sm text-stone-light underline underline-offset-4 hover:text-stone transition-colors"
          >
            Go straight to the vault
          </button>
        </div>
      )}
    </div>
  );
}
