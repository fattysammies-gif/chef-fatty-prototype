"use client";

import Link from "next/link";
import { RECIPE_SUMMARIES } from "@/lib/recipeSummaries";

export default function DashboardPage() {
  const featured = RECIPE_SUMMARIES[0];
  const scrollRecipes = RECIPE_SUMMARIES.slice(1, 7);

  return (
    <div className="min-h-screen bg-ivory pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="md:grid md:grid-cols-[1fr_340px] md:gap-8 md:px-8 lg:px-12 md:pt-8">

          {/* ── Main column ── */}
          <div className="px-5 md:px-0">

            {/* Header */}
            <div className="pt-14 md:pt-6 pb-6">
              <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-2">
                Chef Fatty
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight tracking-tight">
                Your Kitchen
              </h1>
              <p className="text-stone text-sm mt-2">
                {RECIPE_SUMMARIES.length} recipes ready to cook
              </p>
            </div>

            {/* Pre-order banner — mobile only */}
            <Link
              href="https://club.cheffatty.com"
              target="_blank"
              className="md:hidden flex items-center gap-4 bg-gradient-to-r from-sienna to-sienna-hover rounded-2xl px-5 py-4 mb-7 group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-label font-semibold text-white/70 mb-1">
                  Pre-order · $9
                </p>
                <p className="text-white font-semibold text-sm leading-snug">
                  Get lifetime access + video walkthroughs
                </p>
              </div>
              <div className="shrink-0 w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </Link>

            {/* Start Here label */}
            <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-4">
              Start Here
            </p>

            {/* Featured hero card */}
            <Link href={`/vault/${featured.slug}`} className="block mb-8 group">
              <div
                className="relative w-full rounded-3xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-shadow duration-300"
                style={{ background: featured.gradient, aspectRatio: "16/9" }}
              >
                <div className="absolute top-4 left-4 bg-gold text-white text-xs font-semibold px-3 py-1 rounded-full tracking-wide">
                  Demo Recipe
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="drop-shadow-lg" style={{ fontSize: 64 }}>{featured.emoji}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6">
                  <h2 className="font-serif text-xl md:text-2xl text-white leading-tight mb-2">
                    {featured.name}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/70">Cook {featured.cookTime}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-xs text-white/70">{featured.difficulty}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-xs text-emerald-300 font-medium">Full Recipe →</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Browse Recipes */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-label font-medium text-stone-light">
                Browse Recipes
              </p>
              <Link
                href="/vault"
                className="text-xs text-sienna font-medium hover:text-sienna-hover transition-colors"
              >
                View all {RECIPE_SUMMARIES.length} →
              </Link>
            </div>

            {/* Horizontal recipe scroll */}
            <div
              className="-mx-5 md:mx-0 overflow-x-auto mb-8"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
            >
              <div className="flex gap-3 px-5 md:px-0 pb-2">
                {scrollRecipes.map((recipe) => (
                  <Link key={recipe.slug} href={`/vault/${recipe.slug}`} className="shrink-0 group">
                    <div
                      className="relative rounded-2xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-shadow duration-200"
                      style={{ background: recipe.gradient, width: 140, height: 178 }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span style={{ fontSize: 40 }}>{recipe.emoji}</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <p className="font-serif text-xs text-white leading-snug line-clamp-2">
                          {recipe.name}
                        </p>
                        <p className="text-[10px] text-white/60 mt-0.5">{recipe.cookTime}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Vault teaser */}
            <div className="bg-ivory-card border border-ivory-border rounded-2xl px-5 py-4 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-charcoal">19 more recipes</p>
                  <p className="text-xs text-stone mt-0.5">
                    Full vault unlocks with your pre-order
                  </p>
                </div>
                <span className="text-2xl">🔒</span>
              </div>
            </div>

          </div>

          {/* ── Desktop sidebar ── */}
          <div className="hidden md:block space-y-5 pt-6">

            {/* Club presale card */}
            <Link
              href="https://club.cheffatty.com"
              target="_blank"
              className="block bg-gradient-to-br from-sienna to-sienna-hover rounded-3xl p-6 group hover:shadow-card-hover transition-shadow"
            >
              <p className="text-xs uppercase tracking-label font-semibold text-white/70 mb-2">
                Limited Pre-Order
              </p>
              <p className="font-serif text-2xl text-white mb-3 leading-snug">
                The Noodle<br />Vault
              </p>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                Lifetime access to all 20 recipes with video walkthroughs, ingredient swaps, and cook mode.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-white text-2xl font-bold">$9</span>
                  <span className="text-white/50 text-sm line-through">$14</span>
                </div>
                <div className="bg-white text-sienna text-sm font-semibold px-4 py-2 rounded-xl group-hover:bg-ivory-card transition-colors">
                  Pre-order →
                </div>
              </div>
            </Link>

            {/* Quick links */}
            <div className="bg-ivory-card border border-ivory-border rounded-2xl p-5">
              <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-4">
                Quick Access
              </p>
              <div className="space-y-0">
                {[
                  { href: "/vault", label: "All Recipes" },
                  { href: "/shopping-list", label: "Shopping List" },
                  { href: "/settings", label: "Preferences" },
                ].map(({ href, label }, i, arr) => (
                  <div key={href}>
                    <Link href={href} className="flex items-center justify-between py-3 group">
                      <span className="text-sm text-charcoal group-hover:text-sienna transition-colors font-medium">
                        {label}
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A09890" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                    {i < arr.length - 1 && <div className="border-t border-ivory-border" />}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
