"use client";

import { use } from "react";
import Link from "next/link";
import { RECIPE_SUMMARIES } from "@/lib/recipeSummaries";
import { RECIPE } from "@/lib/recipe";
import { usePrefs } from "@/lib/store";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function KitchenLandingPage({ params }: PageProps) {
  const { slug } = use(params);
  const [prefs] = usePrefs();

  const summary = RECIPE_SUMMARIES.find((r) => r.slug === slug);
  const isFull = slug === "gochujang-butter-noodles";
  const recipe = isFull ? RECIPE : null;

  if (!summary) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-serif text-2xl text-charcoal mb-4">Recipe not found</p>
          <Link href="/vault" className="text-orange underline underline-offset-2">
            Back to vault
          </Link>
        </div>
      </div>
    );
  }

  const chapters = recipe?.chapters ?? [];

  return (
    <div className="min-h-screen bg-cream pb-20 page-transition">
      {/* Back arrow */}
      <div className="max-w-lg mx-auto px-6 pt-12">
        <Link
          href="/vault"
          className="inline-flex items-center gap-2 text-muted text-sm hover:text-charcoal transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Vault
        </Link>
      </div>

      {/* Video */}
      <div className="max-w-lg mx-auto mt-4">
        <div className="youtube-container bg-charcoal">
          <iframe
            src={`https://www.youtube.com/embed/${recipe?.videoId ?? "dQw4w9WgXcQ"}?rel=0`}
            title={summary.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6">
        {/* Title */}
        <div className="pt-6 pb-4">
          <h1 className="font-serif text-4xl font-bold text-charcoal leading-tight">
            {summary.name}
          </h1>
          <p className="text-base leading-7 text-muted mt-2">{summary.description}</p>
        </div>

        {/* Metadata chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-cream-card border border-cream-border text-charcoal text-xs font-medium px-3 py-1.5 rounded-xl">
            Prep {summary.prepTime}
          </span>
          <span className="bg-cream-card border border-cream-border text-charcoal text-xs font-medium px-3 py-1.5 rounded-xl">
            Cook {summary.cookTime}
          </span>
          <span className={`border text-xs font-medium px-3 py-1.5 rounded-xl ${
            summary.difficulty === "Easy"
              ? "bg-green-50 border-green-200 text-green-800"
              : summary.difficulty === "Hard"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-cream-card border-cream-border text-charcoal"
          }`}>
            {summary.difficulty}
          </span>
          <span className="bg-cream-card border border-cream-border text-charcoal text-xs font-medium px-3 py-1.5 rounded-xl">
            Serves {prefs.servings}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {summary.tags.map((tag) => (
            <span key={tag} className="bg-orange-light text-orange text-xs font-medium px-2.5 py-1 rounded-lg">
              {tag}
            </span>
          ))}
        </div>

        {/* Chapter timestamps */}
        {chapters.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-muted uppercase tracking-widest font-semibold mb-3">
              Chapters
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
              {chapters.map((ch) => {
                const mins = Math.floor(ch.seconds / 60);
                const secs = ch.seconds % 60;
                const timestamp = `${mins}:${String(secs).padStart(2, "0")}`;
                return (
                  <a
                    key={ch.seconds}
                    href={`https://www.youtube.com/watch?v=${recipe?.videoId}&t=${ch.seconds}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 bg-cream-card border border-cream-border rounded-xl px-3 py-2 text-xs font-medium text-charcoal hover:border-orange hover:text-orange transition-colors"
                  >
                    <span className="text-orange mr-1.5">{timestamp}</span>
                    {ch.label}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Diet/allergen notice */}
        {(prefs.diet !== "none" || prefs.allergens.length > 0) && (
          <div className="bg-orange-light border border-orange/20 rounded-2xl px-5 py-4 mb-6">
            <p className="text-sm text-orange font-semibold mb-1">Your preferences</p>
            <p className="text-sm text-muted">
              {prefs.diet !== "none" && (
                <span className="capitalize">{prefs.diet}</span>
              )}
              {prefs.diet !== "none" && prefs.allergens.length > 0 && " · "}
              {prefs.allergens.length > 0 && (
                <span>Avoiding: {prefs.allergens.join(", ")}</span>
              )}
            </p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/kitchen/${slug}/ingredients`}
            className="block w-full bg-charcoal text-white text-center rounded-2xl py-4 font-semibold text-base"
          >
            View Ingredients →
          </Link>
          <Link
            href={`/kitchen/${slug}/cook`}
            className="block w-full bg-orange text-white text-center rounded-2xl py-4 font-semibold text-base"
          >
            Start Cooking →
          </Link>
        </div>

        {isFull && (
          <div className="text-center mt-5">
            <Link
              href={`/kitchen/${slug}/basic`}
              className="text-sm text-muted underline underline-offset-2 hover:text-charcoal transition-colors"
            >
              View full recipe
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
