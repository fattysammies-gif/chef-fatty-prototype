"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { RECIPE_SUMMARIES } from "@/lib/recipeSummaries";

export default function RecipePlaceholderPage() {
  const { slug } = useParams<{ slug: string }>();
  const recipe = RECIPE_SUMMARIES.find((r) => r.slug === slug);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
        <p className="font-serif text-2xl text-charcoal mb-3">Recipe not found</p>
        <Link href="/vault" className="text-sm text-sienna underline underline-offset-4">
          Back to Vault
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pb-28 page-transition">
      <div className="max-w-lg mx-auto px-6">

        <div className="pt-12 pb-6">
          <Link href="/vault"
            className="inline-flex items-center gap-2 text-sm text-stone hover:text-charcoal transition-colors group">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            The Vault
          </Link>
        </div>

        <div className="relative w-full rounded-3xl overflow-hidden shadow-card mb-6"
          style={{ background: recipe.gradient, aspectRatio: "16/9" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="drop-shadow-lg" style={{ fontSize: 80 }}>{recipe.emoji}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6">
            <h1 className="font-serif text-3xl text-white leading-tight mb-2">{recipe.name}</h1>
            <p className="text-white/75 text-sm leading-relaxed">{recipe.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { label: "Prep", value: recipe.prepTime },
            { label: "Cook", value: recipe.cookTime },
            { label: recipe.difficulty, value: null },
          ].map((m) => (
            <div key={m.label}
              className="flex items-center gap-1.5 bg-ivory-card border border-ivory-border rounded-full px-3 py-1.5 text-xs">
              <span className="text-stone">{m.label}</span>
              {m.value && <span className="font-semibold text-charcoal">{m.value}</span>}
            </div>
          ))}
        </div>

        <div className="bg-ivory-card border border-ivory-border rounded-3xl p-8 text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-ivory-border flex items-center justify-center mx-auto mb-4">
            <span style={{ fontSize: 22 }}>📽️</span>
          </div>
          <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-2">Coming soon</p>
          <p className="font-serif text-xl text-charcoal leading-tight mb-2">
            Recipe in production
          </p>
          <p className="text-stone text-sm leading-relaxed">
            This recipe is being filmed and edited. Check back at launch.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <span key={tag}
              className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-ivory-card border border-ivory-border text-stone capitalize">
              {tag.replace(/-/g, " ")}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}
