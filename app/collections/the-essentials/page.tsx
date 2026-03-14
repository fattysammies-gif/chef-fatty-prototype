import Link from "next/link";
import Image from "next/image";
import { COLLECTION, RECIPES } from "@/lib/recipes";

const INCLUDED = [
  { icon: "🎬", label: "Step-by-step video" },
  { icon: "⏱", label: "Built-in cook timers" },
  { icon: "⚖️", label: "Serving scaler" },
  { icon: "🔢", label: "Macro breakdown" },
  { icon: "📝", label: "Flavor notes" },
  { icon: "🔄", label: "Substitution table" },
];

const TAGS: Record<string, string> = {
  "spicy": "🌶 Spicy",
  "vegetarian": "🥦 Vegetarian",
  "high-protein": "💪 High Protein",
  "under-30-min": "⚡ Under 30 Min",
  "meal-prep": "📦 Meal Prep",
  "vegan": "🌱 Vegan",
  "pescatarian": "🐟 Pescatarian",
};

export default function TheEssentialsCollection() {
  const essentialRecipes = COLLECTION.recipes;

  return (
    <main className="min-h-screen bg-cream">

      {/* ── HERO ── */}
      <section className="bg-charcoal text-white px-6 py-20 text-center">
        <p className="text-orange font-semibold text-sm uppercase tracking-widest mb-4">
          Chef Fatty Collection
        </p>
        <h1 className="font-bold text-4xl md:text-6xl leading-tight mb-4">
          The Essentials
        </h1>
        <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto mb-8">
          {COLLECTION.recipeCount} Asian-inspired recipes, perfected. Every technique explained. Every shortcut justified.
        </p>

        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="text-4xl font-bold">${COLLECTION.price}</span>
          <div className="text-left text-white/60 text-sm leading-tight">
            <div>one-time</div>
            <div>yours forever</div>
          </div>
        </div>

        <a
          href="#recipes"
          className="inline-block bg-orange text-white font-semibold px-8 py-4 rounded-full text-lg hover:bg-orange/90 transition-colors mb-4"
        >
          Browse the collection ↓
        </a>
        <p className="text-white/40 text-sm">
          {COLLECTION.buyerCount} cooks already inside
        </p>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="bg-white border-b border-cream-border px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-charcoal/50 text-xs uppercase tracking-widest font-semibold mb-8">
            Every recipe includes
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {INCLUDED.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 bg-cream rounded-xl px-4 py-3"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium text-charcoal">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECIPE GRID ── */}
      <section id="recipes" className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="text-2xl font-bold text-charcoal">
            {essentialRecipes.length} recipes
            <span className="text-charcoal/30 font-normal text-lg ml-2">
              (showing {essentialRecipes.length} of {COLLECTION.recipeCount})
            </span>
          </h2>
          <Link
            href={`/recipes?collection=the-essentials&preview=true`}
            className="text-sm text-orange font-medium hover:underline"
          >
            View free recipes →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {essentialRecipes.map((recipe) => (
            <Link
              key={recipe.slug}
              href={`/recipes/${recipe.slug}?premium=true`}
              className="group bg-white rounded-2xl overflow-hidden border border-cream-border hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              {/* Card image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-cream-card">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Premium badge */}
                <div className="absolute top-3 right-3 bg-charcoal/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  ✦ Unlocked
                </div>
              </div>

              {/* Card body */}
              <div className="p-5">
                <h3 className="font-bold text-charcoal text-base leading-snug mb-2 group-hover:text-orange transition-colors">
                  {recipe.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-2">
                  {recipe.description}
                </p>

                {/* Meta row */}
                <div className="flex items-center gap-3 text-xs text-charcoal/50 mb-3">
                  <span>⏱ {recipe.totalTime}</span>
                  <span>·</span>
                  <span>{recipe.difficulty}</span>
                  <span>·</span>
                  <span>{recipe.nutrition.calories} cal</span>
                </div>

                {/* Tags */}
                {recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-cream text-charcoal/60 px-2 py-0.5 rounded-full border border-cream-border"
                      >
                        {TAGS[tag] ?? tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}

          {/* Locked preview cards — hint at the remaining 47 */}
          {[...Array(3)].map((_, i) => (
            <div
              key={`locked-${i}`}
              className="bg-white rounded-2xl overflow-hidden border border-cream-border opacity-50 select-none"
            >
              <div className="aspect-[4/3] bg-cream-card flex items-center justify-center">
                <span className="text-4xl">🔒</span>
              </div>
              <div className="p-5">
                <div className="h-4 bg-cream rounded w-3/4 mb-2" />
                <div className="h-3 bg-cream rounded w-full mb-1" />
                <div className="h-3 bg-cream rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-muted text-sm mt-8">
          + {COLLECTION.recipeCount - essentialRecipes.length} more recipes inside the collection
        </p>
      </section>

      {/* ── FREE RECIPE TEASER ── */}
      <section className="bg-white border-t border-cream-border px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-charcoal/50 text-xs uppercase tracking-widest font-semibold mb-3">
            Try before you buy
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-4">
            One recipe, completely free.
          </h2>
          <p className="text-muted mb-8">
            Crispy Honey Chili Garlic Tofu — full ingredients, every step, no paywall.
          </p>
          <Link
            href="/recipes/crispy-honey-chili-garlic-tofu"
            className="inline-block bg-charcoal text-white font-semibold px-8 py-4 rounded-full hover:bg-charcoal/90 transition-colors"
          >
            Read the free recipe →
          </Link>
        </div>
      </section>

      {/* ── STICKY BUY FOOTER ── */}
      <div className="sticky bottom-0 left-0 right-0 bg-charcoal border-t border-white/10 px-6 py-4 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="text-white">
            <p className="font-bold text-lg leading-none">The Essentials</p>
            <p className="text-white/50 text-sm">{COLLECTION.recipeCount} recipes · one-time ${COLLECTION.price}</p>
          </div>
          <button className="shrink-0 bg-orange text-white font-semibold px-6 py-3 rounded-full hover:bg-orange/90 transition-colors text-sm md:text-base">
            Get The Essentials — ${COLLECTION.price}
          </button>
        </div>
      </div>

    </main>
  );
}
