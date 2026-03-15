"use client";

import { use } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RECIPE } from "@/lib/recipe";
import RecipePage from "@/app/vault/gochujang-butter-noodles/RecipePage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BasicPage({ params }: PageProps) {
  const { slug } = use(params);

  if (slug !== "gochujang-butter-noodles") {
    redirect(`/kitchen/${slug}`);
  }

  return (
    <div className="min-h-screen bg-cream pb-20 page-transition">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-cream-border no-print">
        <div className="max-w-lg mx-auto px-6 py-3 flex items-center gap-4">
          <Link
            href={`/kitchen/${slug}`}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-cream-border text-muted hover:text-charcoal flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <h1 className="font-serif text-base font-bold text-charcoal truncate">
            {RECIPE.name}
          </h1>
        </div>
      </div>
      <RecipePage recipe={RECIPE} />
    </div>
  );
}
