import Link from "next/link";
import Image from "next/image";
import { RECIPES } from "@/lib/recipes";

const TAGS = ["spicy", "vegetarian", "high-protein", "under-30-min", "meal-prep", "vegan"];

export default function RecipeLibrary() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-charcoal mb-3">Recipes</h1>
        <p className="text-muted text-lg">Bold flavours. Real techniques. Every recipe you can cook from tonight.</p>
      </div>

      {/* Search + filters */}
      <div className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Search recipes..."
          className="w-full max-w-md border border-cream-border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
        />
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold border border-cream-border text-muted hover:border-orange hover:text-orange transition-colors bg-white capitalize"
            >
              {tag.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {RECIPES.map((recipe) => (
          <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className="group block">
            <div className="bg-white rounded-2xl overflow-hidden border border-cream-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              {/* Image */}
              <div className="relative aspect-[4/3] bg-cream-card overflow-hidden">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Badge */}
                {recipe.isPremium && (
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-1 bg-charcoal/80 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      🔒 Premium
                    </span>
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="p-4">
                <h3 className="font-serif text-base font-bold text-charcoal leading-snug mb-2 group-hover:text-orange transition-colors">
                  {recipe.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted mb-3">
                  <span>⏱ {recipe.totalTime}</span>
                  <span>·</span>
                  <span>{recipe.difficulty}</span>
                  <span>·</span>
                  <span>{recipe.calories} cal</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recipe.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-0.5 rounded-full bg-cream border border-cream-border text-muted capitalize"
                    >
                      {tag.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Unlock banner */}
      <div className="mt-16 bg-charcoal rounded-2xl p-8 text-center">
        <p className="text-orange text-xs font-bold tracking-widest uppercase mb-3">The Essentials Collection</p>
        <h2 className="font-serif text-2xl font-bold text-white mb-3">Unlock the full experience</h2>
        <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
          Nutrition info, serving scaler, cook timers, flavor notes, substitutions, and step-by-step video — on every recipe.
        </p>
        <Link
          href="/collections/the-essentials"
          className="inline-block bg-orange text-white font-semibold text-sm px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
        >
          Get The Essentials — $14.99
        </Link>
      </div>
    </div>
  );
}
