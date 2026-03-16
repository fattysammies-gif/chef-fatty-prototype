"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrefs } from "@/lib/store";

const ALLERGEN_OPTIONS = ["Gluten", "Dairy", "Eggs", "Soy", "Shellfish", "Nuts", "Peanuts"];
const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [prefs, setPrefs] = usePrefs();
  const [step, setStep] = useState(1);

  const [unit, setUnit] = useState<"imperial" | "metric">(prefs.unit);
  const [diet, setDiet] = useState<"none" | "vegetarian" | "vegan">(prefs.diet);
  const [allergens, setAllergens] = useState<string[]>(prefs.allergens);
  const [servings, setServings] = useState(prefs.servings);

  function toggleAllergen(a: string) {
    setAllergens((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  }

  function goBack() {
    if (step > 1) setStep((s) => s - 1);
  }

  function goNext() {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      setPrefs({ hasOnboarded: true, unit, diet, allergens, servings });
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col">

      {/* Progress header */}
      {step > 1 && (
        <div className="max-w-lg mx-auto w-full px-6 pt-14 pb-6 flex items-center gap-4">
          <button onClick={goBack}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-ivory-border text-stone hover:text-charcoal transition-colors flex-shrink-0"
            aria-label="Back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="flex-1 flex gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className="flex-1 h-0.5 rounded-full transition-all duration-400"
                style={{ backgroundColor: i < step ? "#C85C0A" : "#E2D9CC" }} />
            ))}
          </div>
          <div className="w-10" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-6 page-transition">

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
            <div className="mb-10" style={{ fontSize: 80 }}>🍜</div>
            <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-4">Chef Fatty</p>
            <h1 className="font-serif text-5xl text-charcoal leading-tight tracking-tight mb-5">
              The Noodle<br />Vault
            </h1>
            <p className="text-stone text-lg leading-8 mb-14 max-w-xs">
              20 noodle recipes. Video-guided. Your kitchen, your pace.
            </p>
            <button onClick={goNext}
              className="w-full bg-sienna text-white rounded-2xl py-4 font-semibold text-base hover:bg-sienna-hover transition-colors">
              Let&apos;s get started →
            </button>
            <button onClick={() => { setPrefs({ hasOnboarded: true }); router.push("/dashboard"); }}
              className="mt-5 text-sm text-stone-light underline underline-offset-4 hover:text-stone transition-colors">
              Skip setup
            </button>
          </div>
        )}

        {/* Step 2: Measurements */}
        {step === 2 && (
          <div className="flex-1 flex flex-col pt-6 pb-8">
            <h2 className="font-serif text-4xl text-charcoal leading-tight tracking-tight mb-3">
              How do you<br />measure?
            </h2>
            <p className="text-stone leading-7 mb-10">
              We&apos;ll show all quantities in your preferred system.
            </p>
            <div className="flex flex-col gap-4 flex-1">
              {[
                { value: "imperial" as const, label: "US / Imperial", desc: "cups, oz, tablespoons" },
                { value: "metric" as const, label: "Metric", desc: "grams, millilitres" },
              ].map(({ value, label, desc }) => (
                <button key={value} onClick={() => setUnit(value)}
                  className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                    unit === value ? "border-sienna bg-sienna-light" : "border-ivory-border bg-ivory-card hover:border-stone-faint"
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-charcoal text-lg">{label}</div>
                      <div className="text-sm text-stone mt-1">{desc}</div>
                    </div>
                    {unit === value && (
                      <div className="w-6 h-6 rounded-full bg-sienna flex items-center justify-center flex-shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <button onClick={goNext}
              className="w-full bg-charcoal text-white rounded-2xl py-4 font-semibold text-base mt-10 hover:bg-charcoal-soft transition-colors">
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Dietary preferences */}
        {step === 3 && (
          <div className="flex-1 flex flex-col pt-6 pb-8">
            <h2 className="font-serif text-4xl text-charcoal leading-tight tracking-tight mb-3">
              Any dietary<br />preferences?
            </h2>
            <p className="text-stone leading-7 mb-10">
              We&apos;ll highlight swaps and alternatives throughout.
            </p>
            <div className="flex flex-col gap-4 flex-1">
              {[
                { value: "none" as const, label: "None", desc: "Show all recipes as-is" },
                { value: "vegetarian" as const, label: "Vegetarian", desc: "Highlight meat-free swaps" },
                { value: "vegan" as const, label: "Vegan", desc: "Fully plant-based options" },
              ].map(({ value, label, desc }) => (
                <button key={value} onClick={() => setDiet(value)}
                  className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                    diet === value ? "border-sienna bg-sienna-light" : "border-ivory-border bg-ivory-card hover:border-stone-faint"
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-charcoal text-lg">{label}</div>
                      <div className="text-sm text-stone mt-1">{desc}</div>
                    </div>
                    {diet === value && (
                      <div className="w-6 h-6 rounded-full bg-sienna flex items-center justify-center flex-shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <button onClick={goNext}
              className="w-full bg-charcoal text-white rounded-2xl py-4 font-semibold text-base mt-10 hover:bg-charcoal-soft transition-colors">
              Continue
            </button>
          </div>
        )}

        {/* Step 4: Allergens */}
        {step === 4 && (
          <div className="flex-1 flex flex-col pt-6 pb-8">
            <h2 className="font-serif text-4xl text-charcoal leading-tight tracking-tight mb-3">
              Any allergens<br />to avoid?
            </h2>
            <p className="text-stone leading-7 mb-10">
              We&apos;ll flag these in ingredient lists and suggest substitutions.
            </p>
            <div className="flex flex-wrap gap-3 flex-1 content-start">
              {ALLERGEN_OPTIONS.map((a) => (
                <button key={a} onClick={() => toggleAllergen(a.toLowerCase())}
                  className={`px-5 py-3 rounded-2xl border-2 font-medium text-sm transition-all ${
                    allergens.includes(a.toLowerCase())
                      ? "border-sienna bg-sienna-light text-sienna"
                      : "border-ivory-border bg-ivory-card text-charcoal hover:border-stone-faint"
                  }`}>
                  {a}
                </button>
              ))}
            </div>
            <button onClick={goNext}
              className="w-full bg-charcoal text-white rounded-2xl py-4 font-semibold text-base mt-10 hover:bg-charcoal-soft transition-colors">
              {allergens.length > 0 ? "Continue" : "None, continue"}
            </button>
          </div>
        )}

        {/* Step 5: Servings */}
        {step === 5 && (
          <div className="flex-1 flex flex-col pt-6 pb-8">
            <h2 className="font-serif text-4xl text-charcoal leading-tight tracking-tight mb-3">
              Cooking for<br />how many?
            </h2>
            <p className="text-stone leading-7 mb-12">
              We&apos;ll scale all ingredient amounts to your default serving size.
            </p>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="flex items-center gap-10">
                <button onClick={() => setServings((s) => Math.max(1, s - 1))}
                  className="w-14 h-14 rounded-full border-2 border-ivory-border bg-ivory-card text-charcoal text-2xl font-light flex items-center justify-center hover:border-stone-faint transition-colors"
                  aria-label="Decrease">
                  −
                </button>
                <span className="font-serif text-8xl text-charcoal w-20 text-center leading-none">
                  {servings}
                </span>
                <button onClick={() => setServings((s) => Math.min(8, s + 1))}
                  className="w-14 h-14 rounded-full border-2 border-ivory-border bg-ivory-card text-charcoal text-2xl font-light flex items-center justify-center hover:border-stone-faint transition-colors"
                  aria-label="Increase">
                  +
                </button>
              </div>
              <p className="text-stone text-sm mt-6 tracking-wide">
                {servings === 1 ? "just me" : `${servings} people`}
              </p>
            </div>
            <button onClick={goNext}
              className="w-full bg-sienna text-white rounded-2xl py-4 font-semibold text-base mt-10 hover:bg-sienna-hover transition-colors">
              Enter the Vault →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
