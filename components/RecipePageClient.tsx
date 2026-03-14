"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { Recipe } from "@/lib/recipes";

function LockGate({ collectionName, children, label, count }: {
  collectionName?: string; children?: React.ReactNode; label: string; count?: string;
}) {
  return (
    <div className="relative rounded-2xl border border-cream-border overflow-hidden">
      <div className="blur-sm pointer-events-none select-none opacity-40 p-6">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-cream/80 backdrop-blur-sm p-6 text-center">
        <span className="text-2xl mb-3">🔒</span>
        {count && <p className="text-sm font-semibold text-charcoal mb-1">{count}</p>}
        <p className="text-sm text-muted mb-4">{label}</p>
        <Link
          href="/collections/the-essentials"
          className="inline-block bg-orange text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
        >
          Unlock with {collectionName ?? "The Essentials"} — $14.99
        </Link>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold text-charcoal mb-4">{children}</h2>;
}

// Timer component
function Timer({ seconds, label }: { seconds: number; label: string }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => setRemaining((r) => r - 1), 1000);
    } else {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      if (remaining === 0) setRunning(false);
    }
    return () => { if (intervalRef.current !== null) clearInterval(intervalRef.current); };
  }, [running, remaining]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = ((seconds - remaining) / seconds) * 100;

  return (
    <button
      onClick={() => setRunning(!running)}
      className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
        running
          ? "bg-orange text-white border-orange"
          : remaining === 0
          ? "bg-green-100 text-green-700 border-green-200"
          : "bg-cream-card border-cream-border text-muted hover:border-orange hover:text-orange"
      }`}
    >
      {remaining === 0 ? "✅ Done" : running ? "⏸" : "⏱"}{" "}
      {remaining === 0 ? label : `${mins}:${secs.toString().padStart(2, "0")}`}
      {running && (
        <span className="w-16 h-1 bg-white/30 rounded-full overflow-hidden">
          <span className="block h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
        </span>
      )}
    </button>
  );
}

export default function RecipePageClient({ recipe, isPremiumUser }: {
  recipe: Recipe;
  isPremiumUser: boolean;
}) {
  const [servings, setServings] = useState(recipe.servings);
  const scale = servings / recipe.servings;

  function scaleAmount(amount: string, scalable: boolean): string {
    if (!scalable || !amount || scale === 1) return amount;
    const fractions: Record<string, number> = { "¼": 0.25, "½": 0.5, "¾": 0.75, "⅓": 0.333, "⅔": 0.667 };
    const num = fractions[amount] ?? parseFloat(amount);
    if (isNaN(num)) return amount;
    const scaled = num * scale;
    // Convert back to nice fractions
    const niceFractions: [number, string][] = [[0.25, "¼"], [0.5, "½"], [0.75, "¾"], [0.333, "⅓"], [0.667, "⅔"]];
    for (const [val, str] of niceFractions) {
      if (Math.abs(scaled - val) < 0.05) return str;
    }
    if (Number.isInteger(scaled)) return String(scaled);
    return scaled.toFixed(1).replace(/\.0$/, "");
  }

  return (
    <div className="space-y-10">

      {/* ── NUTRITION BAR — premium ── */}
      <section>
        <SectionTitle>Nutrition</SectionTitle>
        {isPremiumUser ? (
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Calories", val: Math.round(recipe.nutrition.calories * scale), unit: "" },
              { label: "Protein", val: Math.round(recipe.nutrition.protein * scale), unit: "g" },
              { label: "Carbs", val: Math.round(recipe.nutrition.carbs * scale), unit: "g" },
              { label: "Fat", val: Math.round(recipe.nutrition.fat * scale), unit: "g" },
            ].map((n) => (
              <div key={n.label} className="bg-white rounded-xl border border-cream-border p-4 text-center">
                <p className="text-2xl font-bold text-charcoal">{n.val}<span className="text-sm font-normal text-muted">{n.unit}</span></p>
                <p className="text-xs text-muted mt-1">{n.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <LockGate collectionName={recipe.collectionName} label="See full nutrition info per serving">
            <div className="grid grid-cols-4 gap-3">
              {["Calories", "Protein", "Carbs", "Fat"].map((l) => (
                <div key={l} className="bg-white rounded-xl border border-cream-border p-4 text-center">
                  <p className="text-2xl font-bold text-charcoal">—</p>
                  <p className="text-xs text-muted mt-1">{l}</p>
                </div>
              ))}
            </div>
          </LockGate>
        )}
      </section>

      {/* ── SERVING SCALER — premium ── */}
      <section>
        <SectionTitle>Servings</SectionTitle>
        {isPremiumUser ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setServings((s) => Math.max(1, s - 1))}
              className="w-10 h-10 rounded-full border border-cream-border flex items-center justify-center text-xl font-bold text-muted hover:border-orange hover:text-orange transition-colors"
            >−</button>
            <span className="text-2xl font-bold text-charcoal w-8 text-center">{servings}</span>
            <button
              onClick={() => setServings((s) => Math.min(20, s + 1))}
              className="w-10 h-10 rounded-full border border-cream-border flex items-center justify-center text-xl font-bold text-muted hover:border-orange hover:text-orange transition-colors"
            >+</button>
            <span className="text-sm text-muted">servings</span>
            {scale !== 1 && (
              <span className="text-xs bg-orange/10 text-orange font-semibold px-3 py-1 rounded-full">
                {scale > 1 ? `${scale}×` : `÷${(1 / scale).toFixed(1)}`} scaled
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4 opacity-40 pointer-events-none">
            <button className="w-10 h-10 rounded-full border border-cream-border flex items-center justify-center text-xl text-muted">−</button>
            <span className="text-2xl font-bold text-charcoal w-8 text-center">{recipe.servings}</span>
            <button className="w-10 h-10 rounded-full border border-cream-border flex items-center justify-center text-xl text-muted">+</button>
            <span className="text-sm text-muted">servings</span>
            <span className="text-xs bg-orange/10 text-orange font-semibold px-3 py-1 rounded-full">🔒 Premium</span>
          </div>
        )}
      </section>

      {/* ── INGREDIENTS — always free ── */}
      <section>
        <SectionTitle>Ingredients</SectionTitle>
        <div className="space-y-6">
          {recipe.ingredientGroups.map((group, gi) => (
            <div key={gi}>
              {group.group && (
                <p className="text-xs font-bold tracking-widest uppercase text-muted mb-3">{group.group}</p>
              )}
              <ul className="space-y-2.5">
                {group.items.map((item, ii) => (
                  <li key={ii} className="flex items-baseline gap-2 text-sm">
                    <span className="font-semibold text-charcoal w-10 shrink-0">
                      {isPremiumUser ? scaleAmount(item.amount, item.scalable ?? true) : item.amount}
                    </span>
                    <span className="text-muted w-12 shrink-0">{item.unit}</span>
                    {item.affiliateUrl ? (
                      <a href={item.affiliateUrl} target="_blank" rel="noopener noreferrer"
                        className="text-charcoal hover:text-orange underline underline-offset-2 decoration-dotted transition-colors">
                        {item.name}
                      </a>
                    ) : (
                      <span className="text-charcoal">{item.name}</span>
                    )}
                    {item.notes && <span className="text-subtle text-xs">({item.notes})</span>}
                    {!(item.scalable ?? true) && isPremiumUser && (
                      <span className="text-xs text-subtle italic">fixed</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── STEPS — base free, timers + video premium ── */}
      <section>
        <SectionTitle>Instructions</SectionTitle>
        <ol className="space-y-6">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="font-serif text-2xl font-bold text-cream-border shrink-0 w-8 pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 space-y-3">
                <p className="text-charcoal leading-relaxed">{step.instruction}</p>
                <div className="flex flex-wrap gap-2">
                  {step.timerSeconds && (
                    isPremiumUser ? (
                      <Timer seconds={step.timerSeconds} label={`Step ${i + 1} timer`} />
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-cream-border text-subtle opacity-50 cursor-not-allowed">
                        🔒 ⏱ {Math.floor(step.timerSeconds / 60)}:{String(step.timerSeconds % 60).padStart(2, "0")} timer
                      </span>
                    )
                  )}
                  {step.videoUrl && (
                    isPremiumUser ? (
                      <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-orange text-orange hover:bg-orange hover:text-white transition-colors">
                        ▶ Watch step video
                      </button>
                    ) : (
                      <div className="relative w-full max-w-xs aspect-video bg-cream-card rounded-xl border border-cream-border overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-charcoal/80 flex items-center justify-center">
                            <span className="text-white text-xl ml-0.5">🔒</span>
                          </div>
                          <p className="text-xs text-muted font-semibold">Premium video</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── FLAVOR NOTES — premium ── */}
      {recipe.isPremium && (
        <section>
          <SectionTitle>Why this recipe works</SectionTitle>
          {isPremiumUser ? (
            <div className="bg-cream-card rounded-2xl border border-cream-border p-6">
              <div className="prose prose-sm max-w-none text-charcoal leading-relaxed">
                {recipe.flavorNotes.split("\n\n").map((para, i) => (
                  <p key={i} className={i > 0 ? "mt-4" : ""}>{para}</p>
                ))}
              </div>
            </div>
          ) : (
            <LockGate collectionName={recipe.collectionName} label="Unlock the full flavor breakdown — why each ingredient is there, what to taste for, and what makes this recipe work.">
              <div className="bg-cream-card rounded-2xl border border-cream-border p-6">
                <p className="font-semibold text-charcoal mb-2">Why this recipe works</p>
                <p className="text-muted text-sm">Kecap manis is the engine here — it's sweeter and thicker than regular soy sauce...</p>
                <p className="text-muted text-sm mt-2 blur-sm select-none">The crispy rice technique is all about patience and heat management. Day-old rice is drier, which means less steam when it hits the oil and a crispier crust. Pressing it firmly...</p>
              </div>
            </LockGate>
          )}
        </section>
      )}

      {/* ── SUBSTITUTIONS — premium ── */}
      {recipe.isPremium && (
        <section>
          <SectionTitle>Substitutions</SectionTitle>
          {isPremiumUser ? (
            <div className="rounded-2xl border border-cream-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-cream-card border-b border-cream-border">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase text-muted">Original</th>
                    <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase text-muted">Substitute</th>
                    <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase text-muted hidden sm:table-cell">Notes</th>
                    <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase text-muted hidden sm:table-cell">Dietary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-border">
                  {recipe.substitutions.map((sub, i) => (
                    <tr key={i} className="bg-white hover:bg-cream/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-charcoal">{sub.original}</td>
                      <td className="px-4 py-3 text-orange font-medium">{sub.substitute}</td>
                      <td className="px-4 py-3 text-muted hidden sm:table-cell">{sub.notes}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {sub.dietary.map((d) => (
                            <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 capitalize">{d}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <LockGate
              collectionName={recipe.collectionName}
              label="See all substitutions with dietary tags and technique notes."
              count={`${recipe.substitutions.length} substitutions available`}
            >
              <div className="rounded-2xl border border-cream-border overflow-hidden">
                <div className="bg-cream-card px-4 py-3 text-xs font-bold tracking-widest uppercase text-muted">Substitutions</div>
                {recipe.substitutions.slice(0, 2).map((sub, i) => (
                  <div key={i} className="px-4 py-3 border-t border-cream-border flex gap-4 text-sm">
                    <span className="text-charcoal font-medium">{sub.original}</span>
                    <span className="text-orange">→ {sub.substitute}</span>
                  </div>
                ))}
              </div>
            </LockGate>
          )}
        </section>
      )}

      {/* ── UNLOCK CTA — shown to non-premium on premium recipes ── */}
      {recipe.isPremium && !isPremiumUser && (
        <div className="bg-charcoal rounded-2xl p-8 text-center">
          <p className="text-orange text-xs font-bold tracking-widest uppercase mb-3">{recipe.collectionName}</p>
          <h3 className="font-serif text-2xl font-bold text-white mb-3">Unlock the full experience</h3>
          <p className="text-white/60 text-sm mb-6 max-w-sm mx-auto">
            Nutrition info, serving scaler, cook timers, flavor notes, substitutions, and step-by-step video — on every recipe.
          </p>
          <Link
            href="/collections/the-essentials"
            className="inline-block bg-orange text-white font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Get The Essentials — $14.99
          </Link>
          <p className="text-white/30 text-xs mt-4">One-time purchase. Yours forever.</p>
        </div>
      )}

    </div>
  );
}
