"use client";

import { useState, useEffect } from "react";
import { usePrefs } from "@/lib/store";

const ALLERGEN_OPTIONS = ["Gluten", "Dairy", "Eggs", "Soy", "Shellfish", "Nuts", "Peanuts"];

type Section = "unit" | "diet" | "allergens" | "servings";

function CheckIcon() {
  return (
    <div className="w-6 h-6 rounded-full bg-sienna flex items-center justify-center flex-shrink-0">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}

function SavedToast({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 chef-note-enter whitespace-nowrap">
      <span className="text-green-400">✓</span> Preferences saved
    </div>
  );
}

export default function SettingsPage() {
  const [prefs, setPrefs] = usePrefs();
  const [unit, setUnit] = useState<"imperial" | "metric">(prefs.unit);
  const [diet, setDiet] = useState<"none" | "vegetarian" | "vegan">(prefs.diet);
  const [allergens, setAllergens] = useState<string[]>(prefs.allergens);
  const [servings, setServings] = useState(prefs.servings);
  const [openSection, setOpenSection] = useState<Section | null>(null);
  const [toast, setToast] = useState(false);

  // Sync with latest prefs on mount
  useEffect(() => {
    setUnit(prefs.unit);
    setDiet(prefs.diet);
    setAllergens(prefs.allergens);
    setServings(prefs.servings);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleAllergen(a: string) {
    const key = a.toLowerCase();
    setAllergens((prev) => prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]);
  }

  function save() {
    setPrefs({ unit, diet, allergens, servings });
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  }

  const toggle = (s: Section) => setOpenSection((prev) => prev === s ? null : s);

  const unitLabel = unit === "imperial" ? "US / Imperial" : "Metric";
  const dietLabel = diet === "none" ? "None" : diet.charAt(0).toUpperCase() + diet.slice(1);
  const allergensLabel = allergens.length === 0 ? "None" : allergens.map((a) => a.charAt(0).toUpperCase() + a.slice(1)).join(", ");

  return (
    <div className="min-h-screen bg-ivory pb-28 page-transition">
      <SavedToast visible={toast} />

      <div className="max-w-lg mx-auto px-6">

        {/* Header */}
        <div className="pt-16 pb-8">
          <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-2">Chef Fatty</p>
          <h1 className="font-serif text-4xl text-charcoal leading-tight tracking-tight">Settings</h1>
          <p className="text-stone text-sm mt-2">Your preferences apply across all recipes.</p>
        </div>

        {/* Accordion sections */}
        <div className="space-y-2.5 mb-8">

          {/* Measurements */}
          <div className="bg-ivory-card border border-ivory-border rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between px-5 py-4"
              onClick={() => toggle("unit")}>
              <div className="text-left">
                <p className="font-semibold text-charcoal text-sm">Measurements</p>
                <p className="text-xs text-stone mt-0.5">{unitLabel}</p>
              </div>
              <span className={`text-stone text-base transition-transform duration-200 ${openSection === "unit" ? "rotate-180" : ""}`}>▾</span>
            </button>
            {openSection === "unit" && (
              <div className="chef-note-enter px-5 pb-5 flex flex-col gap-3">
                {[
                  { value: "imperial" as const, label: "US / Imperial", desc: "cups, oz, tablespoons" },
                  { value: "metric" as const, label: "Metric", desc: "grams, millilitres" },
                ].map(({ value, label, desc }) => (
                  <button key={value} onClick={() => setUnit(value)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                      unit === value ? "border-sienna bg-sienna-faint" : "border-ivory-border bg-ivory hover:border-stone-faint"
                    }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-charcoal text-sm">{label}</div>
                        <div className="text-xs text-stone mt-0.5">{desc}</div>
                      </div>
                      {unit === value && <CheckIcon />}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Diet */}
          <div className="bg-ivory-card border border-ivory-border rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between px-5 py-4"
              onClick={() => toggle("diet")}>
              <div className="text-left">
                <p className="font-semibold text-charcoal text-sm">Dietary Preference</p>
                <p className="text-xs text-stone mt-0.5">{dietLabel}</p>
              </div>
              <span className={`text-stone text-base transition-transform duration-200 ${openSection === "diet" ? "rotate-180" : ""}`}>▾</span>
            </button>
            {openSection === "diet" && (
              <div className="chef-note-enter px-5 pb-5 flex flex-col gap-3">
                {[
                  { value: "none" as const, label: "None", desc: "Show all recipes as-is" },
                  { value: "vegetarian" as const, label: "Vegetarian", desc: "Highlight meat-free swaps" },
                  { value: "vegan" as const, label: "Vegan", desc: "Fully plant-based options" },
                ].map(({ value, label, desc }) => (
                  <button key={value} onClick={() => setDiet(value)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                      diet === value ? "border-sienna bg-sienna-faint" : "border-ivory-border bg-ivory hover:border-stone-faint"
                    }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-charcoal text-sm">{label}</div>
                        <div className="text-xs text-stone mt-0.5">{desc}</div>
                      </div>
                      {diet === value && <CheckIcon />}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Allergens */}
          <div className="bg-ivory-card border border-ivory-border rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between px-5 py-4"
              onClick={() => toggle("allergens")}>
              <div className="text-left min-w-0 pr-4">
                <p className="font-semibold text-charcoal text-sm">Allergens</p>
                <p className="text-xs text-stone mt-0.5 truncate">{allergensLabel}</p>
              </div>
              <span className={`text-stone text-base flex-shrink-0 transition-transform duration-200 ${openSection === "allergens" ? "rotate-180" : ""}`}>▾</span>
            </button>
            {openSection === "allergens" && (
              <div className="chef-note-enter px-5 pb-5">
                <p className="text-xs text-stone mb-4">Tap to select allergens we&apos;ll flag in every recipe.</p>
                <div className="flex flex-wrap gap-2">
                  {ALLERGEN_OPTIONS.map((a) => {
                    const key = a.toLowerCase();
                    const active = allergens.includes(key);
                    return (
                      <button key={a} onClick={() => toggleAllergen(a)}
                        className={`px-4 py-2.5 rounded-2xl border-2 font-medium text-sm transition-all ${
                          active ? "border-sienna bg-sienna-faint text-sienna" : "border-ivory-border bg-ivory text-charcoal hover:border-stone-faint"
                        }`}>
                        {a}
                      </button>
                    );
                  })}
                </div>
                {allergens.length > 0 && (
                  <button onClick={() => setAllergens([])}
                    className="mt-4 text-xs text-stone-light hover:text-stone transition-colors underline underline-offset-4">
                    Clear all
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Default servings */}
          <div className="bg-ivory-card border border-ivory-border rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between px-5 py-4"
              onClick={() => toggle("servings")}>
              <div className="text-left">
                <p className="font-semibold text-charcoal text-sm">Default Servings</p>
                <p className="text-xs text-stone mt-0.5">{servings} {servings === 1 ? "person" : "people"}</p>
              </div>
              <span className={`text-stone text-base transition-transform duration-200 ${openSection === "servings" ? "rotate-180" : ""}`}>▾</span>
            </button>
            {openSection === "servings" && (
              <div className="chef-note-enter px-5 pb-6">
                <p className="text-xs text-stone mb-6">All ingredient amounts scale to this by default.</p>
                <div className="flex items-center justify-center gap-8">
                  <button onClick={() => setServings((s) => Math.max(1, s - 1))}
                    className="w-12 h-12 rounded-full border-2 border-ivory-border bg-ivory text-charcoal text-2xl font-light flex items-center justify-center hover:border-stone-faint transition-colors active:scale-95"
                    aria-label="Decrease">
                    −
                  </button>
                  <div className="text-center">
                    <span className="font-serif text-6xl text-charcoal">{servings}</span>
                    <p className="text-stone text-xs mt-1">{servings === 1 ? "just me" : "people"}</p>
                  </div>
                  <button onClick={() => setServings((s) => Math.min(8, s + 1))}
                    className="w-12 h-12 rounded-full border-2 border-ivory-border bg-ivory text-charcoal text-2xl font-light flex items-center justify-center hover:border-stone-faint transition-colors active:scale-95"
                    aria-label="Increase">
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Save button */}
        <button onClick={save}
          className="w-full bg-sienna text-white rounded-2xl py-4 font-semibold text-base hover:bg-sienna-hover transition-colors active:scale-[0.98] mb-6">
          Save Preferences
        </button>

        {/* Re-run onboarding */}
        <div className="text-center">
          <button onClick={() => {
            setPrefs({ hasOnboarded: false });
            window.location.href = "/onboarding";
          }}
            className="text-sm text-stone-light underline underline-offset-4 hover:text-stone transition-colors">
            Re-run onboarding wizard
          </button>
        </div>

      </div>
    </div>
  );
}
