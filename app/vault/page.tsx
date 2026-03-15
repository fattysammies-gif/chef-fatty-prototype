"use client";

import Link from "next/link";
import { RECIPE_SUMMARIES } from "@/lib/recipeSummaries";

export default function VaultPage() {
  const featured = RECIPE_SUMMARIES[0];
  const rest = RECIPE_SUMMARIES.slice(1);

  return (
    <div className="min-h-screen bg-ivory pb-24 page-transition">
      <div className="max-w-lg mx-auto px-6">

        {/* Header */}
        <div className="pt-16 pb-8">
          <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-3">
            Chef Fatty
          </p>
          <h1 className="font-serif text-5xl text-charcoal leading-tight tracking-tight">
            The Noodle<br />Vault
          </h1>
          <p className="text-stone text-sm mt-3 leading-relaxed">
            {RECIPE_SUMMARIES.length} recipes · video-guided · your pace
          </p>
        </div>

        {/* Noodle Guide Banner */}
        <Link href="/onboarding"
          className="flex items-center justify-between bg-gold-faint border border-gold/30 rounded-2xl px-5 py-4 mb-8 group">
          <div>
            <p className="text-sm font-semibold text-charcoal group-hover:text-sienna transition-colors">
              New here? Watch the Noodle Guide
            </p>
            <p className="text-xs text-stone mt-0.5">Set your preferences · 2 min</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎬</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4975A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </Link>

        {/* Featured Card */}
        <Link href={`/vault/${featured.slug}`} className="block mb-8 group">
          <div className="relative w-full rounded-3xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-shadow duration-300"
            style={{ background: featured.gradient, aspectRatio: "16/9" }}>
            {/* Badges */}
            <div className="absolute top-4 left-4 bg-gold text-white text-xs font-semibold px-3 py-1 rounded-full tracking-wide">
              Start Here
            </div>
            {/* Emoji */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="drop-shadow-lg" style={{ fontSize: 72 }}>{featured.emoji}</span>
            </div>
            {/* Bottom overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6">
              <h2 className="font-serif text-2xl text-white leading-tight mb-2">
                {featured.name}
              </h2>
              <p className="text-white/75 text-sm leading-relaxed line-clamp-2 mb-3">
                {featured.description}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/70">Prep {featured.prepTime}</span>
                <span className="text-white/40">·</span>
                <span className="text-xs text-white/70">Cook {featured.cookTime}</span>
                <span className="text-white/40">·</span>
                <span className={`text-xs font-medium ${featured.difficulty === "Easy" ? "text-emerald-300" : featured.difficulty === "Hard" ? "text-red-300" : "text-white/70"}`}>
                  {featured.difficulty}
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Section label */}
        <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-5">
          All Recipes
        </p>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4">
          {rest.map((recipe) => (
            <Link key={recipe.slug} href={`/vault/${recipe.slug}`} className="block group">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-shadow duration-300"
                style={{ background: recipe.gradient, aspectRatio: "3/4" }}>
                {/* Emoji */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="drop-shadow-md" style={{ fontSize: 44 }}>{recipe.emoji}</span>
                </div>
                {/* Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                  <h3 className="font-serif text-sm text-white leading-snug mb-1.5">
                    {recipe.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-white/65">{recipe.cookTime}</span>
                    <span className="text-white/40 text-xs">·</span>
                    <span className={`text-[10px] font-medium ${recipe.difficulty === "Easy" ? "text-emerald-300" : recipe.difficulty === "Hard" ? "text-red-300" : "text-white/65"}`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
