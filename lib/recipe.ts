export interface Ingredient {
  id: string;
  amount: number | null;
  unit: string;
  name: string;
  isFixed?: boolean;
  affiliateUrl?: string;
  chefNote?: string;
  vegSwap?: { name: string; note: string };
  allergens?: string[];
  allergenSubs?: { allergen: string; sub: string }[];
}

export interface IngredientGroup {
  name: string;
  ingredients: Ingredient[];
}

export interface Step {
  id: string;
  instruction: string;
  timer?: { seconds: number; label: string };
  videoTimestamp?: number;
  chefNote?: string;
  vegInstruction?: string;
}

export interface VideoChapter {
  seconds: number;
  label: string;
}

export interface Recipe {
  slug: string;
  name: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  videoId: string;
  chapters: VideoChapter[];
  ingredientGroups: IngredientGroup[];
  steps: Step[];
  nutrition: { calories: number; protein: number; carbs: number; fat: number };
  vegNutrition: { calories: number; protein: number; carbs: number; fat: number };
}

export const RECIPE: Recipe = {
  slug: "gochujang-butter-noodles",
  name: "Gochujang Butter Noodles",
  description:
    "Glossy, deeply spiced noodles with fermented chili heat, brown butter, and caramelised soy. One pan. Twenty minutes. You'll make it every week.",
  prepTime: "10 min",
  cookTime: "15 min",
  servings: 2,
  difficulty: "Medium",
  tags: ["spicy", "high-protein", "under-30-min", "weeknight"],
  videoId: "dQw4w9WgXcQ",
  chapters: [
    { seconds: 0, label: "Prep" },
    { seconds: 90, label: "Sear the protein" },
    { seconds: 180, label: "Build the sauce" },
    { seconds: 255, label: "Add noodles" },
    { seconds: 330, label: "Reduce until glossy" },
    { seconds: 405, label: "Plate and serve" },
  ],
  ingredientGroups: [
    {
      name: "Sauce",
      ingredients: [
        {
          id: "gochujang",
          amount: 2,
          unit: "tbsp",
          name: "gochujang",
          chefNote:
            "Use Haechandle or CJ brand. Avoid anything labelled 'paste' — they're thicker and much saltier. You'll over-season without realising.",
          allergens: ["gluten"],
          allergenSubs: [
            {
              allergen: "gluten",
              sub: "Use gluten-free gochujang (available online) or miso + chili flakes as a rough substitute.",
            },
          ],
        },
        {
          id: "dark-soy",
          amount: 1,
          unit: "tbsp",
          name: "dark soy sauce",
          affiliateUrl: "https://amzn.to/dark-soy",
          chefNote:
            "Dark soy, not regular. The colour and depth it adds is completely different — it's what gives the noodles that deep caramel glaze instead of looking pale and sad.",
          allergens: ["gluten", "soy"],
          allergenSubs: [
            { allergen: "gluten", sub: "Swap for tamari — same depth, fully gluten-free." },
            { allergen: "soy", sub: "Use coconut aminos. Slightly sweeter, so reduce the honey by half." },
          ],
        },
        {
          id: "rice-vinegar",
          amount: 1,
          unit: "tbsp",
          name: "rice vinegar",
        },
        {
          id: "sesame-oil",
          amount: 1,
          unit: "tsp",
          name: "toasted sesame oil",
          affiliateUrl: "https://amzn.to/sesame-oil",
          chefNote:
            "Add this to the sauce, not the pan. Heat destroys the flavour. It's a finishing note, not a cooking oil.",
        },
        {
          id: "honey",
          amount: 1,
          unit: "tsp",
          name: "honey",
          chefNote: "Just enough to round out the heat. Don't skip it — the balance matters.",
          vegSwap: { name: "maple syrup", note: "Direct swap, same quantity. Slightly less floral but works well." },
        },
        {
          id: "gochugaru",
          amount: 1,
          unit: "tsp",
          name: "gochugaru (Korean chili flakes)",
          affiliateUrl: "https://amzn.to/gochugaru",
          allergenSubs: [
            {
              allergen: "gluten",
              sub: "No gochugaru? Red pepper flakes + a small pinch of sugar. Slightly less smoky and fruity, but still works.",
            },
          ],
        },
        {
          id: "garlic",
          amount: 3,
          unit: "cloves",
          name: "garlic, finely minced",
        },
        {
          id: "ginger",
          amount: 1,
          unit: "tsp",
          name: "fresh ginger, grated",
          chefNote:
            "Grate it on a microplane if you have one — the texture is much finer than a grater and it melts into the sauce properly.",
        },
      ],
    },
    {
      name: "Noodles + Protein",
      ingredients: [
        {
          id: "noodles",
          amount: 200,
          unit: "g",
          name: "fresh ramen noodles",
          affiliateUrl: "https://amzn.to/ramen-noodles",
          chefNote:
            "Fresh noodles from the fridge aisle if you can get them. Dried works too — just cook until just shy of done, they'll finish in the sauce.",
          allergens: ["gluten"],
          allergenSubs: [
            { allergen: "gluten", sub: "Rice noodles or 100% buckwheat soba. Adjust cook time per the packet." },
          ],
        },
        {
          id: "chicken",
          amount: 250,
          unit: "g",
          name: "chicken thigh, thinly sliced",
          chefNote:
            "Thigh, not breast. The fat content means it stays juicy at high heat and gets proper colour. Breast goes dry before it gets any crust.",
          vegSwap: {
            name: "extra-firm tofu, pressed and cubed",
            note:
              "Press the tofu for at least 20 minutes — longer if you have time. A dry surface is everything for browning. Sear 4 minutes per side instead of 3.",
          },
        },
        {
          id: "butter",
          amount: 2,
          unit: "tbsp",
          name: "unsalted butter",
          chefNote:
            "Let it go until just starting to brown and smell nutty. That brown butter note is what sets this apart from every other noodle recipe.",
          allergens: ["dairy"],
          allergenSubs: [
            {
              allergen: "dairy",
              sub: "Vegan butter works well. Coconut oil is fine if that's all you have — you won't get the nuttiness but the sauce will still be rich.",
            },
          ],
          vegSwap: {
            name: "vegan butter",
            note: "Direct swap. If using coconut oil instead, use refined (not virgin) so it doesn't add coconut flavour.",
          },
        },
        {
          id: "oil",
          amount: 1,
          unit: "tbsp",
          name: "neutral oil (avocado or vegetable)",
          isFixed: true,
          chefNote: "High smoke point is what matters here. Olive oil will burn before the pan gets hot enough.",
        },
        {
          id: "green-onion",
          amount: 3,
          unit: "",
          name: "green onions, white and green parts separated",
          chefNote: "The white parts go in with the sauce. The green parts go on top at the end. Don't mix them up.",
        },
      ],
    },
    {
      name: "Garnish",
      ingredients: [
        {
          id: "sesame-seeds",
          amount: 1,
          unit: "tbsp",
          name: "toasted sesame seeds",
          affiliateUrl: "https://amzn.to/sesame-seeds",
          isFixed: true,
        },
        {
          id: "egg",
          amount: 1,
          unit: "",
          name: "soft-boiled egg, halved",
          chefNote:
            "6 minutes 30 seconds in boiling water, then straight into ice water. That's the number. Every time.",
          allergens: ["eggs"],
          allergenSubs: [{ allergen: "eggs", sub: "Simply omit, or use sliced avocado for creaminess instead." }],
          vegSwap: {
            name: "avocado, sliced",
            note: "For fully vegan. Adds a different kind of richness.",
          },
        },
        {
          id: "chili-crisp",
          amount: 1,
          unit: "tsp",
          name: "chili crisp, to finish",
          affiliateUrl: "https://amzn.to/chili-crisp",
          isFixed: true,
          chefNote: "Lao Gan Ma is the classic. Don't skip it — it adds a crunch and a different layer of heat.",
        },
      ],
    },
  ],
  steps: [
    {
      id: "s1",
      instruction:
        "Whisk together all sauce ingredients — gochujang, dark soy, rice vinegar, sesame oil, honey, gochugaru, garlic, and ginger — in a small bowl until smooth. Set aside.",
      videoTimestamp: 0,
      chefNote:
        "Get this done before anything hits the pan. Once you start cooking, it moves fast and you don't want to be measuring soy sauce with one hand while chicken is burning.",
    },
    {
      id: "s2",
      instruction:
        "Bring a large pot of well-salted water to a boil. Cook the ramen noodles until just under done — about 2 minutes for fresh, or 1 minute less than the packet says for dried. Drain and set aside.",
      videoTimestamp: 60,
      timer: { seconds: 120, label: "Noodles" },
      chefNote: "Do not rinse the noodles. The surface starch is what helps the sauce cling to every strand.",
    },
    {
      id: "s3",
      instruction:
        "Heat the neutral oil in a wok or large skillet over high heat until shimmering and just about to smoke.",
      videoTimestamp: 90,
      timer: { seconds: 120, label: "Heat oil" },
      chefNote:
        "If the oil isn't hot enough, you'll steam the chicken instead of sear it. You want to hear a hard sizzle the moment it hits the pan.",
    },
    {
      id: "s4",
      instruction:
        "Add the chicken in a single layer. Leave it completely alone for 3 minutes until golden brown on the bottom. Flip once, cook 2 minutes more. Remove from pan and set aside.",
      videoTimestamp: 90,
      timer: { seconds: 180, label: "Sear chicken" },
      chefNote:
        "Don't stir. Don't move it. Don't press it down. Just leave it. The crust is where all the flavour is, and you break the crust every time you prod it.",
      vegInstruction:
        "Add the pressed tofu in a single layer. Sear 4 minutes per side without moving — tofu releases water as it cooks, so it needs longer to get colour. Remove and set aside.",
    },
    {
      id: "s5",
      instruction:
        "Reduce heat to medium. Add the butter to the same pan. Let it foam and cook until the foam subsides and the butter smells nutty and looks golden brown — about 90 seconds.",
      videoTimestamp: 180,
      timer: { seconds: 90, label: "Brown butter" },
      chefNote:
        "Watch it closely here. Brown butter goes from perfect to burnt in about 15 seconds. Pull it off heat the moment you smell nuts.",
    },
    {
      id: "s6",
      instruction:
        "Add the white parts of the green onion and cook 30 seconds. Pour in the sauce — it will sizzle hard. Stir for 30 seconds, letting the gochujang cook down and deepen.",
      videoTimestamp: 180,
      timer: { seconds: 60, label: "Cook sauce" },
      chefNote:
        "Cooking the gochujang in the fat removes its raw edge and gives it a slightly roasted, deeper flavour. Don't skip this 30 seconds.",
    },
    {
      id: "s7",
      instruction: "Add the drained noodles directly to the pan. Toss aggressively with tongs to coat every strand.",
      videoTimestamp: 255,
      chefNote:
        "Don't be gentle. You want every noodle coated. If it looks too dry, add a splash of the pasta water — it loosens the sauce without diluting the flavour.",
    },
    {
      id: "s8",
      instruction:
        "Add the chicken back in. Toss again. Cook for 1 more minute, tossing occasionally, until the sauce is glossy and clings to the noodles.",
      videoTimestamp: 330,
      timer: { seconds: 60, label: "Final toss" },
      chefNote:
        "You want the sauce to coat the noodles like a glaze, not pool at the bottom of the pan. If it's pooling, the heat is too low or you need to toss more.",
      vegInstruction:
        "Add the tofu back in. Toss gently — tofu breaks more easily than chicken. Cook 1 minute until glossy.",
    },
    {
      id: "s9",
      instruction:
        "Divide between two bowls. Top with the green parts of the green onion, toasted sesame seeds, and the soft-boiled egg. Finish with a small spoonful of chili crisp.",
      videoTimestamp: 405,
      chefNote:
        "Serve immediately — noodles absorb sauce as they sit. If you're plating for a photo, add the egg last so it doesn't slide around while you're arranging everything else.",
    },
  ],
  nutrition: { calories: 580, protein: 32, carbs: 68, fat: 18 },
  vegNutrition: { calories: 490, protein: 22, carbs: 72, fat: 14 },
};
