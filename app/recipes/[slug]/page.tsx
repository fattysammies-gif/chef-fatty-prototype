import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getRecipe } from "@/lib/recipes";
import PremiumToggle from "@/components/PremiumToggle";
import RecipePageClient from "@/components/RecipePageClient";

export default async function RecipePage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ premium?: string }>;
}) {
  const { slug } = await params;
  const { premium } = await searchParams;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const isPremiumUser = premium === "true";

  // JSON-LD structured data — server rendered for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    image: [recipe.image],
    description: recipe.description,
    prepTime: `PT${recipe.prepTime.replace(" min", "M")}`,
    cookTime: `PT${recipe.cookTime.replace(" min", "M")}`,
    totalTime: `PT${recipe.totalTime.replace(" min", "M")}`,
    recipeYield: `${recipe.servings} servings`,
    recipeIngredient: recipe.ingredientGroups.flatMap((g) =>
      g.items.map((i) => `${i.amount} ${i.unit} ${i.name}`.trim())
    ),
    recipeInstructions: recipe.steps.map((s, i) => ({
      "@type": "HowToStep",
      text: s.instruction,
      position: i + 1,
    })),
    nutrition: {
      "@type": "NutritionInformation",
      calories: `${recipe.nutrition.calories} calories`,
      proteinContent: `${recipe.nutrition.protein}g`,
      carbohydrateContent: `${recipe.nutrition.carbs}g`,
      fatContent: `${recipe.nutrition.fat}g`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Prototype state toggle — shown in prototype only */}
      <PremiumToggle isPremium={isPremiumUser} />

      <article className="max-w-3xl mx-auto px-5 pb-20">

        {/* ── HERO — always free ── */}
        <div className="pt-8 pb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags.map((tag) => (
              <span key={tag} className="text-xs font-semibold px-3 py-1 rounded-full bg-cream-card border border-cream-border text-muted capitalize">
                {tag.replace("-", " ")}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal leading-tight mb-3">
            {recipe.title}
          </h1>
          <p className="text-muted text-lg mb-6">{recipe.description}</p>

          {/* Metadata row */}
          <div className="flex flex-wrap gap-5 text-sm text-charcoal font-medium border-y border-cream-border py-4 mb-6">
            <span>⏱ Cook: <strong>{recipe.cookTime}</strong></span>
            <span>🔪 Prep: <strong>{recipe.prepTime}</strong></span>
            <span>🍽 Serves: <strong>{recipe.servings}</strong></span>
            <span>📊 Difficulty: <strong>{recipe.difficulty}</strong></span>
          </div>

          {/* Hero image */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-cream-card">
            <Image src={recipe.image} alt={recipe.title} fill className="object-cover" priority />
          </div>
        </div>

        {/* ── Client-side interactive sections ── */}
        <RecipePageClient recipe={recipe} isPremiumUser={isPremiumUser} />

      </article>
    </>
  );
}
