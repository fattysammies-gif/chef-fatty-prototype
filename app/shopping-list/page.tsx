"use client";

import { useState } from "react";
import { useShoppingList } from "@/lib/store";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
      <div className="w-16 h-16 rounded-full bg-ivory-card border border-ivory-border flex items-center justify-center mb-5">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A09890" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </div>
      <p className="font-serif text-2xl text-charcoal mb-2">Your list is empty</p>
      <p className="text-stone text-sm leading-relaxed">
        Open a recipe, go to Ingredients,<br />and tap Add to Shopping List.
      </p>
    </div>
  );
}

export default function ShoppingListPage() {
  const { items, toggleItem, removeRecipe, clearAll } = useShoppingList();
  const [confirmClear, setConfirmClear] = useState(false);

  // Group items by recipe
  const recipeGroups = items.reduce<Record<string, { recipeName: string; items: typeof items }>>((acc, item) => {
    if (!acc[item.recipeSlug]) {
      acc[item.recipeSlug] = { recipeName: item.recipeName, items: [] };
    }
    acc[item.recipeSlug].items.push(item);
    return acc;
  }, {});

  const groupEntries = Object.entries(recipeGroups);
  const totalItems = items.length;
  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <div className="min-h-screen bg-ivory pb-28 page-transition">
      <div className="max-w-lg mx-auto px-6">

        {/* Header */}
        <div className="pt-16 pb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-2">Chef Fatty</p>
            <h1 className="font-serif text-4xl text-charcoal leading-tight tracking-tight">
              Shopping<br />List
            </h1>
            {totalItems > 0 && (
              <p className="text-stone text-sm mt-2">
                {checkedCount} of {totalItems} checked
              </p>
            )}
          </div>

          {/* Clear all */}
          {totalItems > 0 && (
            <div className="mb-1">
              {confirmClear ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => setConfirmClear(false)}
                    className="text-xs text-stone hover:text-charcoal transition-colors px-3 py-2">
                    Cancel
                  </button>
                  <button onClick={() => { clearAll(); setConfirmClear(false); }}
                    className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors px-3 py-2 rounded-xl">
                    Clear all
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmClear(true)}
                  className="text-xs text-stone-light hover:text-stone transition-colors py-2">
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>

        {totalItems === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            {groupEntries.map(([slug, group]) => {
              const groupChecked = group.items.filter((i) => i.checked).length;
              const allChecked = groupChecked === group.items.length;

              return (
                <div key={slug}>
                  {/* Recipe header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {allChecked && (
                        <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"
                            strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                      <h2 className={`text-xs font-bold uppercase tracking-widest truncate ${
                        allChecked ? "text-stone-light line-through" : "text-sienna"
                      }`}>
                        {group.recipeName}
                      </h2>
                      <span className="text-xs text-stone-light flex-shrink-0">
                        {groupChecked}/{group.items.length}
                      </span>
                    </div>
                    <button onClick={() => removeRecipe(slug)}
                      className="text-xs text-stone-light hover:text-stone transition-colors ml-3 flex-shrink-0 py-1 px-2 rounded-lg hover:bg-ivory-card">
                      Remove
                    </button>
                  </div>

                  {/* Items */}
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item.id}>
                        <button onClick={() => toggleItem(item.id)}
                          className="w-full flex items-center gap-3 py-3 px-4 rounded-2xl hover:bg-ivory-card transition-colors active:scale-[0.99] text-left">
                          {/* Checkbox */}
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            item.checked
                              ? "bg-charcoal border-charcoal"
                              : "border-ivory-border bg-ivory"
                          }`}>
                            {item.checked && (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"
                                strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                          {/* Text */}
                          <span className={`text-sm transition-colors ${
                            item.checked ? "line-through text-stone-light" : "text-charcoal"
                          }`}>
                            {item.displayText}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* Progress bar */}
            {totalItems > 0 && (
              <div className="pt-2 pb-4">
                <div className="flex items-center justify-between text-xs text-stone-light mb-2">
                  <span>{checkedCount} checked</span>
                  <span>{totalItems - checkedCount} remaining</span>
                </div>
                <div className="h-1.5 bg-ivory-deep rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sienna rounded-full transition-all duration-500"
                    style={{ width: totalItems > 0 ? `${(checkedCount / totalItems) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
