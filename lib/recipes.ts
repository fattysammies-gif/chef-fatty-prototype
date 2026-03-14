export type Tag = "spicy" | "vegetarian" | "high-protein" | "under-30-min" | "meal-prep" | "vegan" | "pescatarian";

export type IngredientGroup = {
  group?: string;
  items: { amount: string; unit: string; name: string; notes?: string; affiliateUrl?: string; scalable?: boolean }[];
};

export type Step = {
  instruction: string;
  timerSeconds?: number;
  videoUrl?: string;
};

export type Substitution = {
  original: string;
  substitute: string;
  notes: string;
  dietary: string[];
};

export type Recipe = {
  slug: string;
  title: string;
  description: string;
  image: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: Tag[];
  isPremium: boolean; // assigned to a collection
  collectionName?: string;
  ingredientGroups: IngredientGroup[];
  steps: Step[];
  nutrition: { calories: number; protein: number; carbs: number; fat: number };
  flavorNotes: string;
  substitutions: Substitution[];
  calories: number;
};

export const RECIPES: Recipe[] = [
  {
    slug: "sizzling-chicken-crispy-rice-bowl",
    title: "Sizzling Chicken Crispy Rice Bowl",
    description: "Sweet soy ginger chicken over crispy rice with a shattered golden crust.",
    image: "https://cheffatty.com/wp-content/uploads/2026/03/cover-1280x900-1.jpg",
    prepTime: "10 min",
    cookTime: "25 min",
    totalTime: "25 min",
    servings: 2,
    difficulty: "Easy",
    tags: ["high-protein", "under-30-min"],
    isPremium: true,
    collectionName: "The Essentials",
    ingredientGroups: [
      {
        group: "Rice",
        items: [
          { amount: "1½", unit: "cups", name: "cooked white rice", notes: "warm, day-old works best", scalable: true },
          { amount: "1", unit: "tbsp", name: "neutral oil", scalable: false },
        ],
      },
      {
        group: "Marinated Chicken",
        items: [
          { amount: "¾", unit: "lb", name: "boneless skinless chicken thighs", notes: "sliced thin", scalable: true },
          { amount: "1½", unit: "tbsp", name: "sweet soy sauce (kecap manis)", affiliateUrl: "https://amzn.to/kecapmanis", scalable: true },
          { amount: "1", unit: "tbsp", name: "soy sauce", scalable: true },
          { amount: "1", unit: "tsp", name: "sesame oil", scalable: true },
          { amount: "2", unit: "cloves", name: "garlic", notes: "finely grated", scalable: true },
          { amount: "1", unit: "tsp", name: "fresh ginger", notes: "grated", scalable: true },
          { amount: "½", unit: "tsp", name: "sugar", scalable: true },
          { amount: "", unit: "", name: "black pepper", notes: "to taste", scalable: false },
        ],
      },
      {
        group: "Finishing Sauce",
        items: [
          { amount: "1", unit: "tbsp", name: "sweet soy sauce (kecap manis)", scalable: true },
          { amount: "1", unit: "tsp", name: "soy sauce", scalable: true },
          { amount: "1", unit: "tsp", name: "sesame oil", scalable: true },
        ],
      },
      {
        group: "Toppings",
        items: [
          { amount: "2", unit: "stalks", name: "scallions", notes: "sliced into 2-inch lengths", scalable: false },
          { amount: "1", unit: "tsp", name: "sesame seeds", scalable: false },
        ],
      },
    ],
    steps: [
      { instruction: "Combine chicken with all marinade ingredients. Toss well to coat and set aside for at least 5 minutes.", },
      { instruction: "Heat a large skillet over high heat. Add a splash of oil and briefly sear scallion whites for 30–45 seconds until lightly charred. Remove and set aside.", timerSeconds: 45 },
      { instruction: "Add 1 tbsp neutral oil to the same hot skillet. Press cooked rice firmly into an even, compact layer covering the whole pan base.", },
      { instruction: "Arrange marinated chicken evenly over the rice. Scatter the seared scallion whites on top.", },
      { instruction: "Reduce heat to medium-low. Cover tightly and cook undisturbed for 12–15 minutes.", timerSeconds: 780, videoUrl: "https://example.com/step5.mp4" },
      { instruction: "Peek at the edges — the rice should be golden brown and pulling away from the sides.", },
      { instruction: "Flip the whole rice cake onto a serving dish. Drizzle with finishing sauce and top with fresh scallion greens and sesame seeds.", },
      { instruction: "Serve immediately. Crack through the crust with a spoon and scrape up sections of rice with the chicken.", },
    ],
    nutrition: { calories: 485, protein: 38, carbs: 42, fat: 16 },
    flavorNotes: `Why this recipe works: Kecap manis is the engine here — it's sweeter and thicker than regular soy sauce, which means it caramelises fast against the hot pan without burning. That caramelisation is what gives the chicken its lacquered, slightly sticky coating.

The crispy rice technique is all about patience and heat management. Day-old rice is drier, which means less steam when it hits the oil and a crispier crust. Pressing it firmly into the pan creates contact with the metal, and keeping the lid on traps steam that cooks the chicken through while the base shatters into that golden crust.

The finishing sauce goes on at the end — not during cooking — so it stays bright and doesn't go bitter from the heat.`,
    substitutions: [
      { original: "Chicken thighs", substitute: "Firm tofu", notes: "Press tofu for 20 min first. Reduce cook time by 3 min.", dietary: ["vegetarian", "vegan"] },
      { original: "Chicken thighs", substitute: "Salmon fillet", notes: "Skin-side down on the rice. Same cook time.", dietary: ["pescatarian"] },
      { original: "Kecap manis", substitute: "Soy sauce + 1 tsp brown sugar", notes: "Mix together before adding", dietary: ["vegetarian", "vegan"] },
      { original: "White rice", substitute: "Cauliflower rice", notes: "Pat very dry first. Press firmly.", dietary: ["vegetarian", "vegan"] },
      { original: "Sesame oil", substitute: "Toasted sunflower oil", notes: "Milder flavour, works well", dietary: ["vegetarian", "vegan"] },
      { original: "Fish sauce", substitute: "Soy sauce", notes: "1:1 swap", dietary: ["vegetarian", "vegan"] },
    ],
    calories: 485,
  },
  {
    slug: "thai-coconut-curry-noodles",
    title: "Thai Coconut Curry Noodles",
    description: "Rich coconut curry noodle soup with a homemade curry paste.",
    image: "https://cheffatty.com/wp-content/uploads/2026/03/1280x900-khao.jpg",
    prepTime: "15 min",
    cookTime: "40 min",
    totalTime: "40 min",
    servings: 2,
    difficulty: "Medium",
    tags: ["spicy"],
    isPremium: true,
    collectionName: "The Essentials",
    ingredientGroups: [
      {
        group: "Curry Paste",
        items: [
          { amount: "2", unit: "", name: "shallots", notes: "chopped", scalable: true },
          { amount: "4", unit: "cloves", name: "garlic", scalable: true },
          { amount: "1", unit: "stalk", name: "lemongrass", notes: "tender inner portion, sliced", scalable: true },
          { amount: "1", unit: "inch", name: "fresh ginger or galangal", notes: "sliced", scalable: true },
          { amount: "1", unit: "tsp", name: "ground coriander", scalable: true },
          { amount: "½", unit: "tsp", name: "ground cumin", scalable: true },
          { amount: "½", unit: "tsp", name: "turmeric powder", scalable: true },
          { amount: "1", unit: "tsp", name: "shrimp paste", affiliateUrl: "https://amzn.to/shrimpaste", scalable: true },
          { amount: "½", unit: "tsp", name: "salt", scalable: false },
        ],
      },
      {
        group: "Broth & Protein",
        items: [
          { amount: "1", unit: "tbsp", name: "neutral oil", scalable: false },
          { amount: "1", unit: "can", name: "coconut milk", notes: "13.5 oz", affiliateUrl: "https://amzn.to/coconutmilk", scalable: true },
          { amount: "1½", unit: "cups", name: "chicken stock", scalable: true },
          { amount: "8", unit: "oz", name: "boneless chicken thighs", scalable: true },
          { amount: "1½", unit: "tbsp", name: "fish sauce", scalable: true },
          { amount: "1½", unit: "tsp", name: "sugar", scalable: true },
        ],
      },
      {
        group: "Noodles & Garnish",
        items: [
          { amount: "8", unit: "oz", name: "egg noodles", notes: "dry", scalable: true },
          { amount: "", unit: "", name: "pickled mustard greens", notes: "sliced", scalable: false },
          { amount: "", unit: "", name: "red onion or shallot", notes: "thinly sliced", scalable: false },
          { amount: "", unit: "", name: "lime wedges", scalable: false },
          { amount: "", unit: "", name: "cilantro", notes: "optional", scalable: false },
        ],
      },
    ],
    steps: [
      { instruction: "Blend shallots, garlic, lemongrass, galangal, ground coriander, cumin, turmeric, shrimp paste, and salt into a smooth paste using a food processor or mortar and pestle.", },
      { instruction: "Heat oil in a medium pot over medium heat. Add the curry paste and cook for 2–3 minutes, stirring constantly, until deeply fragrant and beginning to darken.", timerSeconds: 180 },
      { instruction: "Pour in coconut milk and stir until the paste is fully incorporated. Bring to a gentle simmer and cook until the coconut milk separates slightly and the surface looks oily — about 5 minutes.", timerSeconds: 300, videoUrl: "https://example.com/step3.mp4" },
      { instruction: "Add chicken thighs and chicken stock. Simmer over medium-low heat for 15–20 minutes until the chicken is cooked through.", timerSeconds: 1200 },
      { instruction: "Remove chicken, shred or slice, then return to the pot. Season with fish sauce and sugar. Taste and adjust.", },
      { instruction: "Add 1½ cups water to loosen the broth. Cook egg noodles directly in the curry broth until just tender, then drain and divide into bowls.", timerSeconds: 360 },
      { instruction: "Ladle the curry broth and chicken over the noodles. Top with pickled mustard greens, thinly sliced red onion, and lime wedges. Serve hot.", },
    ],
    nutrition: { calories: 620, protein: 34, carbs: 68, fat: 24 },
    flavorNotes: `Why this recipe works: Making the curry paste from scratch is the difference between a soup that tastes like a jar and one that tastes like a restaurant. The key is cooking the paste in oil before adding any liquid — this blooms the aromatics and drives off the raw edge of the garlic and shallots.

The coconut milk split is not a mistake. When you see the oil separating on the surface, that's the fat rendering out of the coconut milk, and it's exactly right. That fat is what carries the fat-soluble compounds in the spices, deepening the flavour before the liquid even goes in.

Fish sauce goes in at the end because heat dulls it. Adding it late keeps the bright, savoury punch intact.`,
    substitutions: [
      { original: "Chicken thighs", substitute: "Tofu (firm)", notes: "Press for 20 min. Add in last 5 minutes of simmering.", dietary: ["vegetarian", "vegan"] },
      { original: "Shrimp paste", substitute: "Miso paste", notes: "Use white miso, same quantity", dietary: ["vegetarian", "vegan"] },
      { original: "Fish sauce", substitute: "Soy sauce + pinch of sugar", notes: "Less complex but works well", dietary: ["vegetarian", "vegan"] },
      { original: "Egg noodles", substitute: "Rice noodles", notes: "Soak in hot water instead of boiling", dietary: ["vegetarian", "vegan"] },
      { original: "Chicken stock", substitute: "Vegetable stock", notes: "1:1 swap", dietary: ["vegetarian", "vegan"] },
    ],
    calories: 620,
  },
  {
    slug: "crispy-honey-chili-garlic-tofu",
    title: "Crispy Honey Chili Garlic Tofu",
    description: "Shatteringly crispy tofu tossed in a sticky, fiery honey garlic glaze.",
    image: "https://cheffatty.com/wp-content/uploads/2025/12/Untitled-design.jpg",
    prepTime: "10 min",
    cookTime: "20 min",
    totalTime: "30 min",
    servings: 2,
    difficulty: "Easy",
    tags: ["vegetarian", "vegan", "spicy", "under-30-min"],
    isPremium: false,
    ingredientGroups: [
      {
        items: [
          { amount: "14", unit: "oz", name: "firm tofu", notes: "pressed and cubed", scalable: true },
          { amount: "2", unit: "tbsp", name: "cornstarch", scalable: true },
          { amount: "2", unit: "tbsp", name: "neutral oil", scalable: false },
          { amount: "4", unit: "cloves", name: "garlic", notes: "minced", scalable: true },
          { amount: "2", unit: "tbsp", name: "honey or maple syrup", scalable: true },
          { amount: "1", unit: "tbsp", name: "soy sauce", scalable: true },
          { amount: "1", unit: "tbsp", name: "chili flakes or chili crisp", affiliateUrl: "https://amzn.to/chilicrisp", scalable: true },
          { amount: "1", unit: "tsp", name: "rice vinegar", scalable: true },
        ],
      },
    ],
    steps: [
      { instruction: "Press tofu firmly between paper towels for at least 10 minutes. Cut into 1-inch cubes. Toss with cornstarch until evenly coated." },
      { instruction: "Heat oil in a large non-stick pan over medium-high. Add tofu in a single layer and cook undisturbed for 4–5 minutes per side until golden and crispy.", timerSeconds: 300 },
      { instruction: "While tofu cooks, mix honey, soy sauce, chili flakes, and rice vinegar in a small bowl." },
      { instruction: "Push tofu to the side of the pan. Add garlic and cook 30 seconds until fragrant." },
      { instruction: "Pour sauce over tofu. Toss quickly and cook 1–2 minutes until the glaze thickens and coats everything.", timerSeconds: 90 },
      { instruction: "Serve immediately over rice or noodles. Garnish with sesame seeds and scallions." },
    ],
    nutrition: { calories: 320, protein: 18, carbs: 28, fat: 14 },
    flavorNotes: `Why this recipe works: Cornstarch is the secret to crispy tofu — it pulls moisture to the surface and creates a shell that crisps up fast in hot oil. The key is pressing the tofu well first so the cornstarch adheres properly.

The glaze goes in at the very end because honey burns quickly over high heat. You only need 60–90 seconds to reduce it down to a sticky lacquer. Any longer and it'll go bitter.`,
    substitutions: [
      { original: "Firm tofu", substitute: "Tempeh", notes: "Steam for 5 min first to reduce bitterness", dietary: ["vegetarian", "vegan"] },
      { original: "Honey", substitute: "Maple syrup", notes: "1:1 swap, keeps it vegan", dietary: ["vegan"] },
      { original: "Chili flakes", substitute: "Gochugaru (Korean chili)", notes: "Adds a smoky depth", dietary: ["vegetarian", "vegan"] },
    ],
    calories: 320,
  },
  {
    slug: "butter-chicken-pasta",
    title: "Butter Chicken Pasta",
    description: "The creamiest fusion mashup — classic butter chicken sauce tossed with al dente rigatoni.",
    image: "https://cheffatty.com/wp-content/uploads/2025/12/BC.jpg",
    prepTime: "10 min",
    cookTime: "25 min",
    totalTime: "35 min",
    servings: 4,
    difficulty: "Easy",
    tags: ["high-protein"],
    isPremium: true,
    collectionName: "The Essentials",
    ingredientGroups: [
      {
        group: "Chicken",
        items: [
          { amount: "1", unit: "lb", name: "boneless chicken thighs", notes: "cubed", scalable: true },
          { amount: "1", unit: "tsp", name: "garam masala", scalable: true },
          { amount: "1", unit: "tsp", name: "ground cumin", scalable: true },
          { amount: "½", unit: "tsp", name: "turmeric", scalable: true },
          { amount: "1", unit: "tsp", name: "salt", scalable: false },
        ],
      },
      {
        group: "Sauce",
        items: [
          { amount: "2", unit: "tbsp", name: "butter", scalable: true },
          { amount: "1", unit: "", name: "onion", notes: "finely diced", scalable: true },
          { amount: "4", unit: "cloves", name: "garlic", notes: "minced", scalable: true },
          { amount: "1", unit: "tbsp", name: "fresh ginger", notes: "grated", scalable: true },
          { amount: "1", unit: "can", name: "crushed tomatoes", notes: "14 oz", scalable: true },
          { amount: "¾", unit: "cup", name: "heavy cream", scalable: true },
          { amount: "1", unit: "tsp", name: "sugar", scalable: false },
        ],
      },
      {
        group: "Pasta",
        items: [
          { amount: "12", unit: "oz", name: "rigatoni", scalable: true },
          { amount: "½", unit: "cup", name: "pasta water", notes: "reserved", scalable: false },
        ],
      },
    ],
    steps: [
      { instruction: "Toss chicken with garam masala, cumin, turmeric, and salt. Cook in a hot oiled pan over medium-high heat until cooked through and lightly charred, about 6–8 minutes.", timerSeconds: 480 },
      { instruction: "Remove chicken. In the same pan, melt butter over medium heat. Add onion and cook until soft, about 5 minutes.", timerSeconds: 300 },
      { instruction: "Add garlic and ginger. Cook 1 minute until fragrant." },
      { instruction: "Add crushed tomatoes. Simmer 10 minutes until thickened.", timerSeconds: 600, videoUrl: "https://example.com/step4.mp4" },
      { instruction: "Meanwhile, cook rigatoni in heavily salted water until al dente. Reserve ½ cup pasta water before draining." },
      { instruction: "Stir cream and sugar into the sauce. Return chicken to the pan." },
      { instruction: "Add pasta and a splash of pasta water. Toss to coat, adding more pasta water until the sauce clings." },
    ],
    nutrition: { calories: 580, protein: 42, carbs: 52, fat: 22 },
    flavorNotes: `Why this recipe works: The pasta water is the secret finishing ingredient. Its starch emulsifies the cream and tomato into a silky sauce that clings to the pasta instead of pooling at the bottom. Don't skip reserving it.

The sugar in the sauce isn't sweetness — it's balance. Canned tomatoes have an acidic edge that the cream can't fully offset. A tiny amount of sugar rounds it out without making the dish taste sweet.`,
    substitutions: [
      { original: "Heavy cream", substitute: "Coconut cream", notes: "Slightly sweeter, gives a Thai edge", dietary: ["vegetarian"] },
      { original: "Chicken thighs", substitute: "Paneer", notes: "Cube and pan-fry before adding to sauce", dietary: ["vegetarian"] },
      { original: "Rigatoni", substitute: "Penne or fusilli", notes: "Any tube or ridged pasta works", dietary: [] },
      { original: "Butter", substitute: "Ghee", notes: "Richer, more aromatic", dietary: [] },
    ],
    calories: 580,
  },
];

export function getRecipe(slug: string): Recipe | undefined {
  return RECIPES.find((r) => r.slug === slug);
}

export const COLLECTION = {
  name: "The Essentials",
  slug: "the-essentials",
  price: 14.99,
  tagline: "50 Asian-inspired recipes, fully unlocked.",
  description: "Every recipe Chef Fatty has perfected — with macros, step-by-step video, cook timers, flavor notes, and substitutions. Your permanent kitchen companion.",
  recipeCount: 50,
  buyerCount: 127,
  recipes: RECIPES.filter((r) => r.isPremium),
};
