"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Recipe, Ingredient } from "@/lib/recipe";
import { formatAmount, scaleAmount } from "@/lib/fractions";
import { convertUnit, type UnitSystem } from "@/lib/units";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TimerState {
  id: string;
  label: string;
  stepLabel: string;
  totalSeconds: number;
  remainingSeconds: number;
  running: boolean;
}

// ─── YouTube via postMessage (no API script needed, works with plain iframe) ──

function useYouTubeIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const seekTo = useCallback((seconds: number) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(JSON.stringify({ event: "command", func: "seekTo", args: [seconds, true] }), "*");
    win.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: [] }), "*");
  }, []);

  return { iframeRef, seekTo };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-cream-card border border-cream-border text-muted capitalize">
      {label.replace(/-/g, " ")}
    </span>
  );
}

function ChefNote({ note }: { note: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="inline-block ml-1.5 align-middle">
      <button
        onClick={() => setOpen(!open)}
        title="Chef's note"
        aria-label="Chef's note"
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors ${
          open
            ? "bg-orange text-white"
            : "bg-orange-light text-orange border border-orange/30 hover:bg-orange hover:text-white"
        }`}
      >
        C
      </button>
      {open && (
        <span className="chef-note-enter block mt-2 p-3 bg-orange-light border-l-2 border-orange rounded-r-xl text-sm text-charcoal leading-relaxed italic">
          &ldquo;{note}&rdquo;
        </span>
      )}
    </span>
  );
}

function AllergenBadge({ allergens }: { allergens: string[] }) {
  return (
    <span className="inline-flex gap-1 ml-1 align-middle">
      {allergens.map((a) => (
        <span
          key={a}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700"
        >
          ⚠ {a}
        </span>
      ))}
    </span>
  );
}

// ─── Floating Timers ──────────────────────────────────────────────────────────

function FloatingTimers({
  timers,
  onToggle,
  onReset,
  onDismiss,
}: {
  timers: TimerState[];
  onToggle: (id: string) => void;
  onReset: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  if (timers.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-3 z-50 flex flex-col gap-2 w-[200px] sm:bottom-4 sm:right-4 sm:w-[220px]">
      {timers.map((t) => {
        const mins = Math.floor(t.remainingSeconds / 60);
        const secs = t.remainingSeconds % 60;
        const pct = ((t.totalSeconds - t.remainingSeconds) / t.totalSeconds) * 100;
        const done = t.remainingSeconds === 0;

        return (
          <div
            key={t.id}
            className={`text-white rounded-2xl p-3 shadow-xl ${
              done ? "bg-green-800" : t.running ? "bg-charcoal timer-running" : "bg-charcoal"
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-xs font-semibold text-white/80">{t.stepLabel}</p>
                <p className="text-xs text-white/50">{t.label}</p>
              </div>
              <button
                onClick={() => onDismiss(t.id)}
                className="text-white/40 hover:text-white text-sm ml-2 leading-none p-1"
                aria-label="Dismiss timer"
              >
                ✕
              </button>
            </div>
            {/* Progress bar */}
            <div className="h-1 bg-white/20 rounded-full mb-2 overflow-hidden">
              <div
                className="h-full bg-orange rounded-full transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-mono text-lg font-bold ${done ? "text-green-300" : "text-white"}`}>
                {done ? "Done!" : `${mins}:${secs.toString().padStart(2, "0")}`}
              </span>
              <div className="flex gap-1.5 ml-auto">
                {!done && (
                  <button
                    onClick={() => onToggle(t.id)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {t.running ? "⏸" : "▶"}
                  </button>
                )}
                <button
                  onClick={() => onReset(t.id)}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  ↺
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function RecipePage({ recipe }: { recipe: Recipe }) {
  // ── State ──
  const [servings, setServings] = useState(recipe.servings);
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [isVeg, setIsVeg] = useState(false);
  const [activeAllergens, setActiveAllergens] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const [shoppingToast, setShoppingToast] = useState(false);
  const [allergenOpen, setAllergenOpen] = useState(false);
  const [timers, setTimers] = useState<TimerState[]>([]);

  const videoSectionRef = useRef<HTMLDivElement>(null);
  const { iframeRef, seekTo } = useYouTubeIframe();

  // ── Timer tick ──
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) => {
          if (!t.running || t.remainingSeconds === 0) return t;
          const next = t.remainingSeconds - 1;
          if (next === 0) {
            try {
              const ctx = new (window.AudioContext ||
                (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = 880;
              gain.gain.setValueAtTime(0.3, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
              osc.start();
              osc.stop(ctx.currentTime + 1.5);
            } catch (_) {}
          }
          return { ...t, remainingSeconds: next, running: next > 0 };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startTimer = (stepId: string, stepLabel: string, timerLabel: string, seconds: number) => {
    const existing = timers.find((t) => t.id === stepId);
    if (existing) {
      setTimers((prev) =>
        prev.map((t) => (t.id === stepId ? { ...t, running: !t.running } : t))
      );
      return;
    }
    setTimers((prev) => [
      ...prev,
      { id: stepId, label: timerLabel, stepLabel, totalSeconds: seconds, remainingSeconds: seconds, running: true },
    ]);
  };

  const toggleTimer = (id: string) =>
    setTimers((prev) => prev.map((t) => (t.id === id ? { ...t, running: !t.running } : t)));

  const resetTimer = (id: string) =>
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, remainingSeconds: t.totalSeconds, running: false } : t))
    );

  const dismissTimer = (id: string) => setTimers((prev) => prev.filter((t) => t.id !== id));

  // ── Video chapter seek ──
  const handleChapterClick = (seconds: number) => {
    videoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => seekTo(seconds), 400);
  };

  // ── Shopping list toast ──
  const handleAddToShoppingList = () => {
    setShoppingToast(true);
    setTimeout(() => setShoppingToast(false), 3000);
  };

  // ── Allergen toggle ──
  const toggleAllergen = (allergen: string) => {
    setActiveAllergens((prev) => {
      const next = new Set(prev);
      if (next.has(allergen)) next.delete(allergen);
      else next.add(allergen);
      return next;
    });
  };

  // ── Ingredient display ──
  const displayIngredient = (ing: Ingredient) => {
    const name = isVeg && ing.vegSwap ? ing.vegSwap.name : ing.name;
    let displayAmt = "";
    if (ing.amount !== null) {
      const base = ing.isFixed
        ? ing.amount
        : (scaleAmount(ing.amount, recipe.servings, servings) ?? ing.amount);
      const converted = convertUnit(base, ing.unit, unit);
      const amtStr = formatAmount(converted.amount);
      displayAmt = amtStr ? `${amtStr}${converted.unit ? " " + converted.unit : ""}` : "";
    }
    return { name, displayAmt };
  };

  const getActiveWarnings = (ing: Ingredient) =>
    ing.allergens?.filter((a) => activeAllergens.has(a)) ?? [];

  const ALLERGEN_LIST = ["gluten", "dairy", "eggs", "soy", "shellfish", "nuts"];
  const nutrition = isVeg ? recipe.vegNutrition : recipe.nutrition;

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="bg-cream min-h-screen">
      {/* ── Sticky kitchen nav ── */}
      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-cream-border no-print">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-charcoal whitespace-nowrap">The Noodle Vault</span>
            <span className="text-cream-border hidden sm:inline">·</span>
            <span className="text-xs text-muted hidden sm:inline">kitchen.cheffatty.com</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-orange text-white font-semibold shrink-0">
            🔒 Member
          </span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pb-36 sm:pb-10">

        {/* ═══════════════════════════════════════════════════
            SECTION 1 — Recipe Header
        ═══════════════════════════════════════════════════ */}
        <section className="pt-8 pb-6">
          {/* Title + icons row */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="font-serif text-3xl font-bold text-charcoal leading-tight">
              {recipe.name}
            </h1>
            <div className="flex items-center gap-2 shrink-0 mt-1">
              <button
                onClick={() => setSaved(!saved)}
                aria-label={saved ? "Remove from saved" : "Save recipe"}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-cream-border hover:border-orange transition-colors"
              >
                <span className={`text-xl transition-all ${saved ? "text-orange" : "text-muted-light"}`}>
                  {saved ? "♥" : "♡"}
                </span>
              </button>
              <button
                onClick={() => window.print()}
                aria-label="Print recipe"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-cream-border hover:border-orange transition-colors text-muted-light hover:text-orange no-print"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
              </button>
            </div>
          </div>

          <p className="text-muted text-base leading-relaxed mb-5">{recipe.description}</p>

          {/* Metadata — pill style, no inline dividers that break on wrap */}
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { label: "Prep", value: recipe.prepTime },
              { label: "Cook", value: recipe.cookTime },
              { label: "Serves", value: String(recipe.servings) },
              { label: "Difficulty", value: recipe.difficulty },
            ].map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-1.5 bg-cream-card border border-cream-border rounded-full px-3 py-1.5 text-sm"
              >
                <span className="text-muted">{m.label}</span>
                <span className="font-semibold text-charcoal">{m.value}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </section>

        <hr className="border-cream-border" />

        {/* ═══════════════════════════════════════════════════
            SECTION 2 — Video Player
        ═══════════════════════════════════════════════════ */}
        <section className="py-6" ref={videoSectionRef}>
          {/* Aspect-ratio container — iframe fills it naturally */}
          <div className="rounded-2xl overflow-hidden bg-charcoal shadow-lg">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${recipe.videoId}?enablejsapi=1&modestbranding=1&rel=0&origin=${
                  typeof window !== "undefined" ? window.location.origin : ""
                }`}
                title="Recipe walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>

          {/* Chapter timestamps */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Jump to</p>
            <div className="flex flex-wrap gap-2">
              {recipe.chapters.map((ch) => {
                const mins = Math.floor(ch.seconds / 60);
                const secs = ch.seconds % 60;
                return (
                  <button
                    key={ch.seconds}
                    onClick={() => handleChapterClick(ch.seconds)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-cream-border bg-white text-sm text-charcoal hover:border-orange hover:text-orange transition-colors active:scale-95"
                  >
                    <span className="text-xs font-mono text-muted-light">
                      {mins}:{secs.toString().padStart(2, "0")}
                    </span>
                    <span className="font-medium">{ch.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <hr className="border-cream-border" />

        {/* ═══════════════════════════════════════════════════
            SECTION 3 — Dietary Toggles
        ═══════════════════════════════════════════════════ */}
        <section className="py-6 space-y-3">
          {/* Veg toggle */}
          <div className="flex items-center justify-between p-4 bg-cream-card rounded-2xl border border-cream-border">
            <div>
              <p className="font-semibold text-charcoal text-sm">Vegetarian / Vegan</p>
              <p className="text-xs text-muted mt-0.5">Swaps animal proteins to plant-based alternatives</p>
            </div>
            <button
              onClick={() => setIsVeg(!isVeg)}
              role="switch"
              aria-checked={isVeg}
              aria-label="Vegetarian / Vegan toggle"
              className={`relative shrink-0 w-12 h-7 rounded-full transition-colors duration-200 ${
                isVeg ? "bg-orange" : "bg-cream-border"
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  isVeg ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Allergen adjuster */}
          <div className="p-4 bg-cream-card rounded-2xl border border-cream-border">
            <button
              className="w-full flex items-center justify-between"
              onClick={() => setAllergenOpen(!allergenOpen)}
            >
              <div className="text-left">
                <p className="font-semibold text-charcoal text-sm">Allergen Checker</p>
                <p className="text-xs text-muted mt-0.5">
                  {activeAllergens.size === 0
                    ? "Tap to flag ingredients for your allergens"
                    : `${activeAllergens.size} allergen${activeAllergens.size > 1 ? "s" : ""} active — ingredients flagged below`}
                </p>
              </div>
              <span
                className={`text-muted text-lg ml-4 transition-transform duration-200 ${allergenOpen ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>

            {allergenOpen && (
              <div className="chef-note-enter mt-4 flex flex-wrap gap-2">
                {ALLERGEN_LIST.map((allergen) => (
                  <button
                    key={allergen}
                    onClick={() => toggleAllergen(allergen)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors capitalize ${
                      activeAllergens.has(allergen)
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-white border-cream-border text-muted hover:border-amber-400 hover:text-amber-600"
                    }`}
                  >
                    {allergen}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <hr className="border-cream-border" />

        {/* ═══════════════════════════════════════════════════
            SECTION 4 — Serving Adjuster + Units
        ═══════════════════════════════════════════════════ */}
        <section className="py-6">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Serving adjuster */}
            <div className="flex items-center gap-3 bg-cream-card rounded-2xl border border-cream-border px-4 py-2.5">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                aria-label="Decrease servings"
                className="w-10 h-10 rounded-full border border-cream-border text-charcoal font-bold hover:border-orange hover:text-orange active:scale-95 transition-all flex items-center justify-center text-xl leading-none"
              >
                −
              </button>
              <div className="text-center min-w-[56px]">
                <span className="font-semibold text-charcoal text-xl">{servings}</span>
                <p className="text-xs text-muted leading-none mt-0.5">
                  serving{servings !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => setServings(Math.min(20, servings + 1))}
                aria-label="Increase servings"
                className="w-10 h-10 rounded-full border border-cream-border text-charcoal font-bold hover:border-orange hover:text-orange active:scale-95 transition-all flex items-center justify-center text-xl leading-none"
              >
                +
              </button>
            </div>

            {/* Unit toggle */}
            <div className="flex items-center rounded-2xl border border-cream-border bg-cream-card overflow-hidden">
              {(["imperial", "metric"] as UnitSystem[]).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`px-5 py-3 text-sm font-semibold transition-colors ${
                    unit === u ? "bg-charcoal text-white" : "text-muted hover:text-charcoal"
                  }`}
                >
                  {u === "imperial" ? "US" : "Metric"}
                </button>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-cream-border" />

        {/* ═══════════════════════════════════════════════════
            SECTION 5 — Ingredients
        ═══════════════════════════════════════════════════ */}
        <section className="py-6">
          <h2 className="font-serif text-xl font-bold text-charcoal mb-5">Ingredients</h2>
          <div className="space-y-7">
            {recipe.ingredientGroups.map((group) => (
              <div key={group.name}>
                <h3 className="text-xs font-bold text-orange uppercase tracking-widest mb-3">
                  {group.name}
                </h3>
                <ul className="space-y-3.5">
                  {group.ingredients.map((ing) => {
                    const { name, displayAmt } = displayIngredient(ing);
                    const warnings = getActiveWarnings(ing);
                    const hasAllergenSub = warnings.length > 0 && ing.allergenSubs;

                    return (
                      <li key={ing.id} className="text-sm">
                        <div className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange mt-[7px] shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 leading-relaxed">
                              {displayAmt && (
                                <span className="font-semibold text-charcoal">{displayAmt}</span>
                              )}
                              {ing.affiliateUrl ? (
                                <a
                                  href={ing.affiliateUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-charcoal underline decoration-dotted decoration-orange/50 hover:text-orange transition-colors"
                                >
                                  {name}
                                </a>
                              ) : (
                                <span className="text-charcoal">{name}</span>
                              )}
                              {ing.isFixed && (
                                <span className="text-xs text-muted-light font-medium">(fixed)</span>
                              )}
                              {warnings.length > 0 && <AllergenBadge allergens={warnings} />}
                              {ing.chefNote && <ChefNote note={ing.chefNote} />}
                            </div>

                            {/* Veg swap */}
                            {isVeg && ing.vegSwap && (
                              <div className="chef-note-enter mt-2 p-2.5 bg-green-50 border border-green-200 rounded-xl text-xs text-charcoal leading-relaxed">
                                <span className="font-semibold text-green-700">↔ Plant-based swap: </span>
                                <span className="line-through text-muted-light mr-1">{ing.name}</span>
                                <span>→ <strong>{ing.vegSwap.name}</strong></span>
                                <span className="text-muted ml-1">— {ing.vegSwap.note}</span>
                              </div>
                            )}

                            {/* Allergen subs */}
                            {hasAllergenSub &&
                              ing.allergenSubs!
                                .filter((s) => activeAllergens.has(s.allergen))
                                .map((s) => (
                                  <div
                                    key={s.allergen}
                                    className="chef-note-enter mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-charcoal leading-relaxed"
                                  >
                                    <span className="font-semibold text-amber-700">⚑ {s.allergen}: </span>
                                    <span>{s.sub}</span>
                                  </div>
                                ))}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-cream-border" />

        {/* ═══════════════════════════════════════════════════
            SECTION 6 — Steps
        ═══════════════════════════════════════════════════ */}
        <section className="py-6">
          <h2 className="font-serif text-xl font-bold text-charcoal mb-5">Method</h2>
          <ol className="space-y-7">
            {recipe.steps.map((step, idx) => {
              const activeTimer = timers.find((t) => t.id === step.id);
              const instruction =
                isVeg && step.vegInstruction ? step.vegInstruction : step.instruction;

              return (
                <li key={step.id} className="flex gap-4">
                  {/* Step number */}
                  <div className="shrink-0 w-8 h-8 rounded-full bg-charcoal text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-sm text-charcoal leading-relaxed">{instruction}</p>

                    {/* Timer + video buttons */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {step.timer && (
                        <button
                          onClick={() =>
                            startTimer(step.id, `Step ${idx + 1}`, step.timer!.label, step.timer!.seconds)
                          }
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border transition-all active:scale-95 ${
                            activeTimer?.running
                              ? "bg-orange text-white border-orange"
                              : activeTimer?.remainingSeconds === 0
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-cream-card border-cream-border text-muted hover:border-orange hover:text-orange"
                          }`}
                        >
                          {activeTimer?.running
                            ? `⏱ ${Math.floor(activeTimer.remainingSeconds / 60)}:${(
                                activeTimer.remainingSeconds % 60
                              )
                                .toString()
                                .padStart(2, "0")}`
                            : activeTimer?.remainingSeconds === 0
                            ? "✓ Done"
                            : `⏱ ${Math.floor(step.timer.seconds / 60)}:${(step.timer.seconds % 60)
                                .toString()
                                .padStart(2, "0")} ${step.timer.label}`}
                        </button>
                      )}

                      {step.videoTimestamp !== undefined && (
                        <button
                          onClick={() => handleChapterClick(step.videoTimestamp!)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border border-cream-border bg-cream-card text-muted hover:border-orange hover:text-orange transition-colors active:scale-95"
                        >
                          ▶ Watch this step
                        </button>
                      )}
                    </div>

                    {/* Chef note on step */}
                    {step.chefNote && (
                      <div className="mt-3 pl-3 border-l-2 border-orange/30 text-xs text-muted leading-relaxed italic">
                        &ldquo;{step.chefNote}&rdquo;
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <hr className="border-cream-border" />

        {/* ═══════════════════════════════════════════════════
            SECTION 7 — Nutrition
        ═══════════════════════════════════════════════════ */}
        <section className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-bold text-charcoal">Nutrition</h2>
            <span className="text-xs text-muted">
              per serving · {servings} serving{servings !== 1 ? "s" : ""} total
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {[
              { label: "Calories", value: nutrition.calories, unit: "" },
              { label: "Protein", value: nutrition.protein, unit: "g" },
              { label: "Carbs", value: nutrition.carbs, unit: "g" },
              { label: "Fat", value: nutrition.fat, unit: "g" },
            ].map((n) => (
              <div
                key={n.label}
                className="bg-cream-card border border-cream-border rounded-2xl p-3 text-center"
              >
                <p className="text-lg font-bold text-charcoal font-serif leading-none mb-1">
                  {n.value}
                  <span className="text-sm font-sans font-normal text-muted">{n.unit}</span>
                </p>
                <p className="text-xs text-muted font-medium uppercase tracking-wide leading-none">
                  {n.label}
                </p>
              </div>
            ))}
          </div>

          {isVeg && (
            <p className="text-xs text-green-700 mt-2.5 font-medium">✓ Showing vegetarian macros</p>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 8 — Action Bar (inline, above sticky bar)
        ═══════════════════════════════════════════════════ */}
        {/* Desktop-only inline version */}
        <section className="py-6 hidden sm:block">
          <div className="flex gap-3">
            <button
              onClick={handleAddToShoppingList}
              className="flex-1 flex items-center justify-center gap-2 bg-charcoal text-white font-semibold text-sm py-3.5 rounded-2xl hover:bg-charcoal/90 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              Add to Shopping List
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`flex-1 flex items-center justify-center gap-2 font-semibold text-sm py-3.5 rounded-2xl border-2 transition-colors ${
                saved
                  ? "bg-orange-light border-orange text-orange"
                  : "border-cream-border text-muted hover:border-orange hover:text-orange"
              }`}
            >
              <span className="text-base">{saved ? "♥" : "♡"}</span>
              {saved ? "Saved" : "Save Recipe"}
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 font-semibold text-sm py-3.5 rounded-2xl border-2 border-cream-border text-muted hover:border-orange hover:text-orange transition-colors no-print"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print Recipe
            </button>
          </div>
        </section>

      </div>

      {/* ── Sticky action bar — mobile only ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur border-t border-cream-border px-4 py-3 sm:hidden no-print">
        <div className="flex gap-2.5 max-w-2xl mx-auto">
          <button
            onClick={handleAddToShoppingList}
            className="flex-1 flex items-center justify-center gap-2 bg-charcoal text-white font-semibold text-sm py-3.5 rounded-2xl active:scale-95 transition-all"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Add to List
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className={`w-14 flex items-center justify-center rounded-2xl border-2 transition-all active:scale-95 ${
              saved ? "bg-orange-light border-orange text-orange" : "border-cream-border text-muted"
            }`}
          >
            <span className="text-xl">{saved ? "♥" : "♡"}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="w-14 flex items-center justify-center rounded-2xl border-2 border-cream-border text-muted active:scale-95 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Floating Timers ── */}
      <FloatingTimers
        timers={timers}
        onToggle={toggleTimer}
        onReset={resetTimer}
        onDismiss={dismissTimer}
      />

      {/* ── Shopping list toast ── */}
      {shoppingToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 chef-note-enter sm:bottom-6 whitespace-nowrap">
          <span>✓</span> Added to shopping list
        </div>
      )}
    </div>
  );
}
