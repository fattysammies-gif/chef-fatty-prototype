"use client";

import Link from "next/link";
import { useRef, useCallback } from "react";
import { RECIPE } from "@/lib/recipe";

function useYouTubeIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const seekTo = useCallback((seconds: number) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(JSON.stringify({ event: "command", func: "seekTo", args: [seconds, true] }), "*");
    win.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: [] }), "*");
  }, []);
  return { iframeRef, seekTo };
}

export default function RecipeLandingPage() {
  const recipe = RECIPE;
  const { iframeRef, seekTo } = useYouTubeIframe();

  return (
    <div className="min-h-screen bg-ivory pb-28 page-transition">
      <div className="max-w-lg mx-auto px-6">

        {/* Back */}
        <div className="pt-12 pb-6">
          <Link href="/vault"
            className="inline-flex items-center gap-2 text-sm text-stone hover:text-charcoal transition-colors group">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            The Vault
          </Link>
        </div>

        {/* Recipe name + meta */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-2">Chef Fatty</p>
          <h1 className="font-serif text-4xl text-charcoal leading-tight tracking-tight mb-3">
            {recipe.name}
          </h1>
          <p className="text-stone text-sm leading-relaxed mb-5">
            {recipe.description}
          </p>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Prep", value: recipe.prepTime },
              { label: "Cook", value: recipe.cookTime },
              { label: "Serves", value: String(recipe.servings) },
              { label: recipe.difficulty, value: null },
            ].map((m) => (
              <div key={m.label}
                className="flex items-center gap-1.5 bg-ivory-card border border-ivory-border rounded-full px-3 py-1.5 text-xs">
                <span className="text-stone">{m.label}</span>
                {m.value && <span className="font-semibold text-charcoal">{m.value}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Video */}
        <div className="rounded-3xl overflow-hidden bg-charcoal shadow-card mb-4">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${recipe.videoId}?enablejsapi=1&modestbranding=1&rel=0`}
              title="Recipe walkthrough"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
        </div>

        {/* Chapter jumps */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-8 scrollbar-hide">
          {recipe.chapters.map((ch) => {
            const mins = Math.floor(ch.seconds / 60);
            const secs = ch.seconds % 60;
            return (
              <button key={ch.seconds} onClick={() => seekTo(ch.seconds)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full border border-ivory-border bg-ivory-card text-xs text-charcoal hover:border-sienna hover:text-sienna transition-colors active:scale-95">
                <span className="font-mono text-stone-light">{mins}:{secs.toString().padStart(2, "0")}</span>
                <span className="font-medium">{ch.label}</span>
              </button>
            );
          })}
        </div>

        {/* Choose your path */}
        <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-4">
          How do you want to cook?
        </p>

        {/* Step-by-step — Primary CTA */}
        <Link href="/vault/gochujang-butter-noodles/cook"
          className="flex items-center justify-between w-full bg-sienna text-white rounded-2xl px-6 py-5 mb-3 hover:bg-sienna-hover transition-colors active:scale-[0.98] group">
          <div>
            <p className="font-semibold text-base leading-tight">Start Cooking</p>
            <p className="text-white/70 text-sm mt-0.5">Step-by-step · swipe through each card</p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 ml-4 group-hover:translate-x-0.5 transition-transform">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        {/* Ingredients + Full Recipe */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link href="/vault/gochujang-butter-noodles/ingredients"
            className="flex flex-col gap-2.5 bg-ivory-card border border-ivory-border rounded-2xl px-5 py-4 hover:border-sienna/40 transition-colors active:scale-[0.98]">
            <div className="w-9 h-9 rounded-xl bg-gold-faint flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4975A" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-charcoal text-sm">Ingredients</p>
              <p className="text-stone text-xs mt-0.5">Add to shopping list</p>
            </div>
          </Link>

          <Link href="/vault/gochujang-butter-noodles/basic"
            className="flex flex-col gap-2.5 bg-ivory-card border border-ivory-border rounded-2xl px-5 py-4 hover:border-sienna/40 transition-colors active:scale-[0.98]">
            <div className="w-9 h-9 rounded-xl bg-sienna-faint flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C85C0A" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-charcoal text-sm">Full Recipe</p>
              <p className="text-stone text-xs mt-0.5">Everything on one page</p>
            </div>
          </Link>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <span key={tag}
              className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-ivory-card border border-ivory-border text-stone capitalize">
              {tag.replace(/-/g, " ")}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}
