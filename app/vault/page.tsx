"use client";

import { useState } from "react";
import Link from "next/link";
import { RECIPE_SUMMARIES } from "@/lib/recipeSummaries";

type FilterTag = "all" | "spicy" | "vegetarian" | "high-protein" | "under-30-min" | "weeknight";

const FILTER_CHIPS: { key: FilterTag; label: string }[] = [
  { key: "all", label: "All" },
  { key: "spicy", label: "Spicy 🌶️" },
  { key: "vegetarian", label: "Vegetarian" },
  { key: "high-protein", label: "High Protein" },
  { key: "under-30-min", label: "Under 30 Min" },
  { key: "weeknight", label: "Weeknight" },
];

export default function VaultPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTag>("all");

  const filtered =
    activeFilter === "all"
      ? RECIPE_SUMMARIES
      : RECIPE_SUMMARIES.filter((r) => r.tags.includes(activeFilter));

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-ivory pb-24 md:pb-12 page-transition">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">

        {/* Header */}
        <div className="pt-14 md:pt-8 pb-6">
          <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-2">
            Chef Fatty
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight tracking-tight">
            The Noodle<br />Vault
          </h1>
          <p className="text-stone text-sm mt-2">
            {RECIPE_SUMMARIES.length} recipes · video-guided · your pace
          </p>
        </div>

        {/* Filter chips */}
        <div
          className="-mx-5 md:mx-0 overflow-x-auto mb-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          <div className="flex gap-2 px-5 md:px-0 pb-1">
            {FILTER_CHIPS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === key
                    ? "bg-sienna text-white shadow-sm"
                    : "bg-ivory-card border border-ivory-border text-stone hover:border-stone/30 hover:text-charcoal"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {featured ? (
          <>
            {/* Featured card */}
            <Link href={`/vault/${featured.slug}`} className="block mb-8 group">
              <div
                className="relative w-full rounded-3xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-shadow duration-300"
                style={{ background: featured.gradient, aspectRatio: "16/9" }}
              >
                {activeFilter === "all" && (
                  <div className="absolute top-4 left-4 bg-gold text-white text-xs font-semibold px-3 py-1 rounded-full tracking-wide">
                    Start Here
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="drop-shadow-lg" style={{ fontSize: 72 }}>{featured.emoji}</span>
                </div>
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
                    <span
                      className={`text-xs font-medium ${
                        featured.difficulty === "Easy"
                          ? "text-emerald-300"
                          : featured.difficulty === "Hard"
                          ? "text-red-300"
                          : "text-white/70"
                      }`}
                    >
                      {featured.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Section label */}
            {rest.length > 0 && (
              <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-5">
                {activeFilter === "all" ? "All Recipes" : `${rest.length} more`}
              </p>
            )}

            {/* Grid — 2 cols mobile, 3 tablet, 4 desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {rest.map((recipe) => (
                <Link key={recipe.slug} href={`/vault/${recipe.slug}`} className="block group">
                  <div
                    className="relative w-full rounded-2xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-shadow duration-300"
                    style={{ background: recipe.gradient, aspectRatio: "3/4" }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="drop-shadow-md" style={{ fontSize: 44 }}>{recipe.emoji}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                      <h3 className="font-serif text-sm text-white leading-snug mb-1.5">
                        {recipe.name}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-white/65">{recipe.cookTime}</span>
                        <span className="text-white/40 text-xs">·</span>
                        <span
                          className={`text-[10px] font-medium ${
                            recipe.difficulty === "Easy"
                              ? "text-emerald-300"
                              : recipe.difficulty === "Hard"
                              ? "text-red-300"
                              : "text-white/65"
                          }`}
                        >
                          {recipe.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-stone text-sm">No recipes match this filter</p>
            <button
              onClick={() => setActiveFilter("all")}
              className="text-sienna text-sm mt-2 underline underline-offset-4"
            >
              Show all
            </button>
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  );
}
