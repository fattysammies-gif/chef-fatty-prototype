"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RECIPE } from "@/lib/recipe";
import { RECIPE_SUMMARIES } from "@/lib/recipeSummaries";
import { usePrefs, useShoppingList } from "@/lib/store";
import { formatAmount, scaleAmount } from "@/lib/fractions";
import { convertUnit } from "@/lib/units";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function ChefNoteButton({ note }: { note: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="inline-block ml-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-5 h-5 rounded-full bg-orange-light text-orange text-xs font-bold inline-flex items-center justify-center border border-orange/20 leading-none"
        aria-label="Chef note"
      >
        C
      </button>
      {open && (
        <div className="chef-note-enter mt-2 pl-4 border-l-2 border-orange text-sm text-muted italic leading-6">
          {note}
        </div>
      )}
    </span>
  );
}

export default function IngredientsPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const [prefs, setPrefs] = usePrefs();
  const { addRecipeItems, hasRecipe } = useShoppingList();

  const summary = RECIPE_SUMMARIES.find((r) => r.slug === slug);
  const isFull = slug === "gochujang-butter-noodles";
  const recipe = isFull ? RECIPE : null;

  const [servings, setServings] = useState(prefs.servings);
  const [unit, setUnit] = useState<"imperial" | "metric">(prefs.unit);
  const [added, setAdded] = useState(hasRecipe(slug));

  if (!summary) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <p className="text-muted">Recipe not found.</p>
      </div>
    );
  }

  function handleAddToList() {
    if (!recipe) return;
    const items = recipe.ingredientGroups.flatMap((group) =>
      group.ingredients.map((ing) => {
        const scaled = scaleAmount(ing.amount, recipe.servings, servings);
        const converted = scaled !== null ? convertUnit(scaled, ing.unit, unit) : null;
        const amountStr = converted !== null ? formatAmount(converted.amount) : "";
        const unitStr = converted !== null ? converted.unit : ing.unit;
        const displayText = [amountStr, unitStr, ing.name].filter(Boolean).join(" ");
        return {
          ingredientId: ing.id,
          displayText,
        };
      })
    );
    addRecipeItems(slug, summary?.name ?? slug, items);
    setAdded(true);
    setPrefs({ unit, servings });
  }

  return (
    <div className="min-h-screen bg-cream pb-20 page-transition">
      <div className="max-w-lg mx-auto px-6">
        {/* Header */}
        <div className="pt-12 pb-6 flex items-start gap-4">
          <Link
            href={`/kitchen/${slug}`}
            className="mt-1 w-10 h-10 flex items-center justify-center rounded-full border border-cream-border text-muted hover:text-charcoal flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal leading-tight">Ingredients</h1>
            <p className="text-sm text-muted mt-0.5">{summary.name}</p>
          </div>
        </div>

        {/* Prefs bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          {prefs.diet !== "none" && (
            <span className="bg-orange-light text-orange text-xs font-medium px-3 py-1.5 rounded-xl capitalize">
              {prefs.diet}
            </span>
          )}
          <span className="bg-cream-card border border-cream-border text-charcoal text-xs font-medium px-3 py-1.5 rounded-xl">
            {unit === "imperial" ? "US" : "Metric"}
          </span>
          <span className="bg-cream-card border border-cream-border text-charcoal text-xs font-medium px-3 py-1.5 rounded-xl">
            {servings} {servings === 1 ? "serving" : "servings"}
          </span>
        </div>

        {/* Serving adjuster + unit toggle */}
        <div className="bg-cream-card border border-cream-border rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-charcoal">Serves</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setServings((s) => Math.max(1, s - 1))}
                className="w-8 h-8 rounded-full border border-cream-border bg-cream text-charcoal text-lg font-light flex items-center justify-center"
              >
                −
              </button>
              <span className="font-semibold text-charcoal w-4 text-center">{servings}</span>
              <button
                onClick={() => setServings((s) => Math.min(12, s + 1))}
                className="w-8 h-8 rounded-full border border-cream-border bg-cream text-charcoal text-lg font-light flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex rounded-xl border border-cream-border overflow-hidden">
            <button
              onClick={() => setUnit("imperial")}
              className={`px-3 py-2 text-xs font-medium transition-colors ${unit === "imperial" ? "bg-charcoal text-white" : "bg-cream-card text-muted"}`}
            >
              US
            </button>
            <button
              onClick={() => setUnit("metric")}
              className={`px-3 py-2 text-xs font-medium transition-colors ${unit === "metric" ? "bg-charcoal text-white" : "bg-cream-card text-muted"}`}
            >
              Metric
            </button>
          </div>
        </div>

        {/* Ingredient groups */}
        {recipe ? (
          <div className="flex flex-col gap-8">
            {recipe.ingredientGroups.map((group) => (
              <div key={group.name}>
                <p className="text-xs text-orange uppercase tracking-widest font-semibold mb-4">
                  {group.name}
                </p>
                <div className="flex flex-col gap-4">
                  {group.ingredients.map((ing) => {
                    const scaled = scaleAmount(ing.amount, recipe.servings, servings);
                    const converted = scaled !== null ? convertUnit(scaled, ing.unit, unit) : null;
                    const amountStr = converted !== null ? formatAmount(converted.amount) : "";
                    const unitStr = converted !== null ? converted.unit : ing.unit;

                    const hasAllergenWarning = ing.allergens?.some((a) =>
                      prefs.allergens.includes(a)
                    );
                    const vegSwapActive =
                      prefs.diet === "vegan" || prefs.diet === "vegetarian";
                    const hasVegSwap = vegSwapActive && ing.vegSwap;

                    return (
                      <div key={ing.id} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange mt-2.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-start gap-1 flex-wrap">
                            <span className="font-semibold text-charcoal">
                              {[amountStr, unitStr].filter(Boolean).join(" ")}
                            </span>
                            <span className="text-charcoal">
                              {hasVegSwap ? ing.vegSwap!.name : ing.name}
                            </span>
                            {ing.chefNote && <ChefNoteButton note={ing.chefNote} />}
                          </div>
                          {hasAllergenWarning && (
                            <div className="mt-1.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5">
                              ⚠️ Contains {ing.allergens?.filter((a) => prefs.allergens.includes(a)).join(", ")}
                              {ing.allergenSubs
                                ?.filter((s) => prefs.allergens.includes(s.allergen))
                                .map((s) => (
                                  <div key={s.allergen} className="mt-0.5">
                                    Swap: {s.sub}
                                  </div>
                                ))}
                            </div>
                          )}
                          {hasVegSwap && ing.vegSwap?.note && (
                            <div className="mt-1.5 text-xs text-green-800 bg-green-50 border border-green-200 rounded-xl px-3 py-1.5">
                              {ing.vegSwap.note}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-cream-card border border-cream-border rounded-2xl p-8 text-center">
            <p className="font-serif text-xl text-charcoal mb-2">Coming soon</p>
            <p className="text-sm text-muted leading-6">
              Full recipe data for {summary.name} is being prepared. Check back soon.
            </p>
          </div>
        )}

        {/* Add to shopping list */}
        {recipe && (
          <div className="mt-10">
            {added ? (
              <div className="flex gap-3">
                <div className="flex-1 bg-green-50 border border-green-200 text-green-800 rounded-2xl py-4 text-center font-semibold text-sm">
                  ✓ Added to list
                </div>
                <button
                  onClick={() => router.push("/shopping-list")}
                  className="flex-1 bg-charcoal text-white rounded-2xl py-4 font-semibold text-sm"
                >
                  View List →
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToList}
                className="w-full bg-charcoal text-white rounded-2xl py-4 font-semibold text-base"
              >
                Add to Shopping List
              </button>
            )}
          </div>
        )}

        {/* Start cooking */}
        <div className="mt-4">
          <Link
            href={`/kitchen/${slug}/cook`}
            className="block w-full bg-orange text-white text-center rounded-2xl py-4 font-semibold text-base"
          >
            Start Cooking →
          </Link>
        </div>
      </div>
    </div>
  );
}
