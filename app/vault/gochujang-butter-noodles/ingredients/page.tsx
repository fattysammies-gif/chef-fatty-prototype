"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RECIPE, type Ingredient } from "@/lib/recipe";
import { formatAmount, scaleAmount } from "@/lib/fractions";
import { convertUnit, type UnitSystem } from "@/lib/units";
import { usePrefs, useShoppingList } from "@/lib/store";

const ALLERGEN_LIST = ["gluten", "dairy", "eggs", "soy", "shellfish", "nuts"];

function ChefNote({ note }: { note: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="inline-block ml-1.5 align-middle">
      <button onClick={() => setOpen(!open)} aria-label="Chef's note"
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold transition-colors ${
          open ? "bg-sienna text-white" : "bg-sienna-faint text-sienna border border-sienna/20 hover:bg-sienna hover:text-white"
        }`}>
        C
      </button>
      {open && (
        <span className="chef-note-enter block mt-2 p-3 bg-sienna-faint border-l-2 border-sienna rounded-r-xl text-xs text-charcoal leading-relaxed italic">
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
        <span key={a}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 border border-amber-200 text-amber-700">
          ⚠ {a}
        </span>
      ))}
    </span>
  );
}

export default function IngredientsPage() {
  const recipe = RECIPE;
  const [prefs] = usePrefs();
  const { addRecipeItems, hasRecipe } = useShoppingList();

  const [servings, setServings] = useState(recipe.servings);
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [isVeg, setIsVeg] = useState(false);
  const [activeAllergens, setActiveAllergens] = useState<Set<string>>(new Set());
  const [allergenOpen, setAllergenOpen] = useState(false);
  const [addedToList, setAddedToList] = useState(false);
  const [toast, setToast] = useState(false);

  // Apply user prefs on mount
  useEffect(() => {
    setUnit(prefs.unit);
    setServings(prefs.servings);
    if (prefs.diet === "vegetarian" || prefs.diet === "vegan") setIsVeg(true);
    if (prefs.allergens.length > 0) setActiveAllergens(new Set(prefs.allergens));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleAllergen = (a: string) =>
    setActiveAllergens((prev) => {
      const next = new Set(prev);
      next.has(a) ? next.delete(a) : next.add(a);
      return next;
    });

  const displayIngredient = (ing: Ingredient) => {
    const name = isVeg && ing.vegSwap ? ing.vegSwap.name : ing.name;
    let displayAmt = "";
    if (ing.amount !== null) {
      const base = ing.isFixed ? ing.amount : (scaleAmount(ing.amount, recipe.servings, servings) ?? ing.amount);
      const converted = convertUnit(base, ing.unit, unit);
      const amtStr = formatAmount(converted.amount);
      displayAmt = amtStr ? `${amtStr}${converted.unit ? " " + converted.unit : ""}` : "";
    }
    return { name, displayAmt };
  };

  const getWarnings = (ing: Ingredient) => ing.allergens?.filter((a) => activeAllergens.has(a)) ?? [];

  const handleAddToList = () => {
    const allIngredients = recipe.ingredientGroups.flatMap((g) =>
      g.ingredients.map((ing) => {
        const { name, displayAmt } = displayIngredient(ing);
        return {
          ingredientId: ing.id,
          displayText: displayAmt ? `${displayAmt} ${name}` : name,
        };
      })
    );
    addRecipeItems(recipe.slug, recipe.name, allIngredients);
    setAddedToList(true);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const alreadyAdded = addedToList || hasRecipe(recipe.slug);

  return (
    <div className="min-h-screen bg-ivory pb-32 page-transition">
      <div className="max-w-lg mx-auto px-6">

        {/* Back + title */}
        <div className="pt-12 pb-6">
          <Link href="/vault/gochujang-butter-noodles"
            className="inline-flex items-center gap-2 text-sm text-stone hover:text-charcoal transition-colors group mb-5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {recipe.name}
          </Link>
          <h1 className="font-serif text-3xl text-charcoal leading-tight">Ingredients</h1>
        </div>

        {/* Controls: servings + unit */}
        <div className="flex items-center gap-3 flex-wrap mb-6">
          {/* Serving adjuster */}
          <div className="flex items-center gap-3 bg-ivory-card rounded-2xl border border-ivory-border px-4 py-2.5">
            <button onClick={() => setServings(Math.max(1, servings - 1))} aria-label="Decrease servings"
              className="w-9 h-9 rounded-full border border-ivory-border text-charcoal font-bold hover:border-sienna hover:text-sienna active:scale-95 transition-all flex items-center justify-center text-lg leading-none">
              −
            </button>
            <div className="text-center min-w-[52px]">
              <span className="font-semibold text-charcoal text-xl">{servings}</span>
              <p className="text-xs text-stone leading-none mt-0.5">serving{servings !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={() => setServings(Math.min(20, servings + 1))} aria-label="Increase servings"
              className="w-9 h-9 rounded-full border border-ivory-border text-charcoal font-bold hover:border-sienna hover:text-sienna active:scale-95 transition-all flex items-center justify-center text-lg leading-none">
              +
            </button>
          </div>

          {/* Unit toggle */}
          <div className="flex items-center rounded-2xl border border-ivory-border bg-ivory-card overflow-hidden">
            {(["imperial", "metric"] as UnitSystem[]).map((u) => (
              <button key={u} onClick={() => setUnit(u)}
                className={`px-5 py-3 text-sm font-semibold transition-colors ${
                  unit === u ? "bg-charcoal text-white" : "text-stone hover:text-charcoal"
                }`}>
                {u === "imperial" ? "US" : "Metric"}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary toggles */}
        <div className="space-y-2.5 mb-6">
          {/* Veg toggle */}
          <div className="flex items-center justify-between p-4 bg-ivory-card rounded-2xl border border-ivory-border">
            <div>
              <p className="font-semibold text-charcoal text-sm">Vegetarian / Vegan</p>
              <p className="text-xs text-stone mt-0.5">Swaps protein to plant-based</p>
            </div>
            <button onClick={() => setIsVeg(!isVeg)} role="switch" aria-checked={isVeg}
              className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
                isVeg ? "bg-sienna" : "bg-ivory-border"
              }`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                isVeg ? "translate-x-[22px]" : "translate-x-0.5"
              }`} />
            </button>
          </div>

          {/* Allergen checker */}
          <div className="p-4 bg-ivory-card rounded-2xl border border-ivory-border">
            <button className="w-full flex items-center justify-between" onClick={() => setAllergenOpen(!allergenOpen)}>
              <div className="text-left">
                <p className="font-semibold text-charcoal text-sm">Allergen Checker</p>
                <p className="text-xs text-stone mt-0.5">
                  {activeAllergens.size === 0
                    ? "Tap to flag your allergens"
                    : `${activeAllergens.size} allergen${activeAllergens.size > 1 ? "s" : ""} active`}
                </p>
              </div>
              <span className={`text-stone text-base ml-4 transition-transform duration-200 ${allergenOpen ? "rotate-180" : ""}`}>
                ▾
              </span>
            </button>
            {allergenOpen && (
              <div className="chef-note-enter mt-4 flex flex-wrap gap-2">
                {ALLERGEN_LIST.map((a) => (
                  <button key={a} onClick={() => toggleAllergen(a)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors capitalize ${
                      activeAllergens.has(a)
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-ivory border-ivory-border text-stone hover:border-amber-400 hover:text-amber-600"
                    }`}>
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ingredient groups */}
        <div className="space-y-8 mb-8">
          {recipe.ingredientGroups.map((group) => (
            <div key={group.name}>
              <h2 className="text-xs font-bold text-sienna uppercase tracking-widest mb-4">{group.name}</h2>
              <ul className="space-y-4">
                {group.ingredients.map((ing) => {
                  const { name, displayAmt } = displayIngredient(ing);
                  const warnings = getWarnings(ing);
                  const hasAllergenSub = warnings.length > 0 && ing.allergenSubs;

                  return (
                    <li key={ing.id} className="text-sm">
                      <div className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-sienna mt-[7px] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 leading-relaxed">
                            {displayAmt && <span className="font-semibold text-charcoal">{displayAmt}</span>}
                            {ing.affiliateUrl ? (
                              <a href={ing.affiliateUrl} target="_blank" rel="noopener noreferrer"
                                className="text-charcoal underline decoration-dotted decoration-sienna/40 hover:text-sienna transition-colors">
                                {name}
                              </a>
                            ) : (
                              <span className="text-charcoal">{name}</span>
                            )}
                            {ing.isFixed && <span className="text-xs text-stone-light font-medium">(fixed)</span>}
                            {warnings.length > 0 && <AllergenBadge allergens={warnings} />}
                            {ing.chefNote && <ChefNote note={ing.chefNote} />}
                          </div>

                          {/* Veg swap */}
                          {isVeg && ing.vegSwap && (
                            <div className="chef-note-enter mt-2 p-2.5 bg-green-50 border border-green-200 rounded-xl text-xs text-charcoal leading-relaxed">
                              <span className="font-semibold text-green-700">↔ Plant swap: </span>
                              <span className="line-through text-stone-light mr-1">{ing.name}</span>
                              <span>→ <strong>{ing.vegSwap.name}</strong></span>
                              <span className="text-stone ml-1">— {ing.vegSwap.note}</span>
                            </div>
                          )}

                          {/* Allergen subs */}
                          {hasAllergenSub && ing.allergenSubs!
                            .filter((s) => activeAllergens.has(s.allergen))
                            .map((s) => (
                              <div key={s.allergen}
                                className="chef-note-enter mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-charcoal leading-relaxed">
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

      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-ivory/95 backdrop-blur border-t border-ivory-border px-6 py-3"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}>
        <div className="max-w-lg mx-auto flex gap-3">
          <button onClick={handleAddToList}
            className={`flex-1 flex items-center justify-center gap-2 font-semibold text-sm py-3.5 rounded-2xl transition-all active:scale-95 ${
              alreadyAdded
                ? "bg-green-600 text-white"
                : "bg-charcoal text-white hover:bg-charcoal-soft"
            }`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              {alreadyAdded
                ? <polyline points="20 6 9 17 4 12" />
                : <>
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </>
              }
            </svg>
            {alreadyAdded ? "Added to Shopping List" : "Add to Shopping List"}
          </button>
          <Link href="/vault/gochujang-butter-noodles/cook"
            className="flex-1 flex items-center justify-center gap-2 bg-sienna text-white font-semibold text-sm py-3.5 rounded-2xl hover:bg-sienna-hover transition-colors active:scale-95">
            Start Cooking →
          </Link>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 chef-note-enter whitespace-nowrap">
          <span className="text-green-400">✓</span> Added to shopping list
        </div>
      )}
    </div>
  );
}
