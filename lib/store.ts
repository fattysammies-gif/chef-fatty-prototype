"use client";

import { useState, useEffect } from "react";

export interface UserPrefs {
  hasOnboarded: boolean;
  unit: "imperial" | "metric";
  diet: "none" | "vegetarian" | "vegan";
  allergens: string[];
  servings: number;
}

export interface ShoppingItem {
  id: string;
  recipeSlug: string;
  recipeName: string;
  ingredientId: string;
  displayText: string;
  checked: boolean;
}

export const DEFAULT_PREFS: UserPrefs = {
  hasOnboarded: false,
  unit: "imperial",
  diet: "none",
  allergens: [],
  servings: 2,
};

function readPrefs(): UserPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem("nv_prefs");
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

function readShoppingItems(): ShoppingItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("nv_shopping");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function usePrefs(): [UserPrefs, (p: Partial<UserPrefs>) => void] {
  const [prefs, setPrefsState] = useState<UserPrefs>(readPrefs);

  useEffect(() => {
    try {
      localStorage.setItem("nv_prefs", JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }, [prefs]);

  function setPrefs(partial: Partial<UserPrefs>) {
    setPrefsState((prev) => ({ ...prev, ...partial }));
  }

  return [prefs, setPrefs];
}

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(readShoppingItems);

  useEffect(() => {
    try {
      localStorage.setItem("nv_shopping", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  function addRecipeItems(
    recipeSlug: string,
    recipeName: string,
    newItems: Omit<ShoppingItem, "id" | "recipeSlug" | "recipeName" | "checked">[]
  ) {
    setItems((prev) => {
      const withoutRecipe = prev.filter((i) => i.recipeSlug !== recipeSlug);
      const added: ShoppingItem[] = newItems.map((item, idx) => ({
        ...item,
        id: `${recipeSlug}-${item.ingredientId}-${idx}`,
        recipeSlug,
        recipeName,
        checked: false,
      }));
      return [...withoutRecipe, ...added];
    });
  }

  function toggleItem(id: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  }

  function removeRecipe(recipeSlug: string) {
    setItems((prev) => prev.filter((i) => i.recipeSlug !== recipeSlug));
  }

  function clearAll() {
    setItems([]);
  }

  function hasRecipe(recipeSlug: string): boolean {
    return items.some((i) => i.recipeSlug === recipeSlug);
  }

  return { items, addRecipeItems, toggleItem, removeRecipe, clearAll, hasRecipe };
}
