"use client";

import Link from "next/link";

const CHAPTERS = [
  {
    num: "01",
    title: "The Sauce System",
    desc: "6 levers — salt, umami, fat, acid, heat, sweet. Learn the combinations that power every sauce.",
    href: "/fundamentals/sauce",
    emoji: "🧂",
    ready: true,
  },
  {
    num: "02",
    title: "Choosing Noodles",
    desc: "3 questions that narrow down the right noodle for any sauce, texture, and cooking method.",
    href: "/fundamentals/noodles",
    emoji: "🍜",
    ready: true,
  },
  {
    num: "03",
    title: "Protein",
    desc: "How to cut, time, and cook protein to complement your sauce — not fight it.",
    href: "/fundamentals/protein",
    emoji: "🥩",
    ready: true,
  },
  {
    num: "04",
    title: "Vegetables",
    desc: "Texture contrast and balance. How to add without making things soggy or bland.",
    href: "/fundamentals/veg",
    emoji: "🥬",
    ready: false,
  },
  {
    num: "05",
    title: "Aromatics & Herbs",
    desc: "Garlic, ginger, scallions, cilantro — these shape the dish before anything else does.",
    href: "/fundamentals/aromatics",
    emoji: "🧄",
    ready: false,
  },
  {
    num: "06",
    title: "The Finish",
    desc: "Acid, oil, heat — the final layer that ties the bowl together.",
    href: "/fundamentals/finish",
    emoji: "✨",
    ready: false,
  },
];

export default function FundamentalsPage() {
  return (
    <div className="min-h-screen bg-ivory pb-24 md:pb-12 page-transition">
      <div className="max-w-2xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="pt-14 md:pt-8 pb-8">
          <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-2">
            Chef Fatty
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight tracking-tight mb-3">
            The Framework
          </h1>
          <p className="text-stone text-sm leading-relaxed">
            6 components. Infinite combinations. Master the system behind every noodle bowl.
          </p>
        </div>

        {/* Chapter list */}
        <div className="flex flex-col gap-3">
          {CHAPTERS.map((ch) =>
            ch.ready ? (
              <Link
                key={ch.href}
                href={ch.href}
                className="flex items-center gap-4 bg-white border border-ivory-border rounded-2xl px-5 py-4 group hover:border-sienna/30 hover:shadow-card transition-all"
              >
                <span style={{ fontSize: 32 }}>{ch.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-stone-light tracking-wider">{ch.num}</span>
                    <span className="font-semibold text-charcoal text-sm group-hover:text-sienna transition-colors">
                      {ch.title}
                    </span>
                  </div>
                  <p className="text-xs text-stone leading-relaxed line-clamp-2">{ch.desc}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A09890" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 group-hover:stroke-[#C85C0A] transition-colors">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ) : (
              <div
                key={ch.href}
                className="flex items-center gap-4 bg-ivory-card border border-ivory-border rounded-2xl px-5 py-4 opacity-55"
              >
                <span style={{ fontSize: 32 }}>{ch.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-stone-light tracking-wider">{ch.num}</span>
                    <span className="font-semibold text-charcoal text-sm">{ch.title}</span>
                    <span className="text-[10px] bg-ivory-border text-stone-light px-2 py-0.5 rounded-full font-medium">
                      Coming soon
                    </span>
                  </div>
                  <p className="text-xs text-stone leading-relaxed line-clamp-2">{ch.desc}</p>
                </div>
              </div>
            )
          )}
        </div>

        {/* CTA to recipe */}
        <div className="mt-8 bg-sienna-light border border-sienna/20 rounded-2xl px-5 py-4">
          <p className="font-semibold text-charcoal text-sm mb-1">See the system in action</p>
          <p className="text-xs text-stone mb-3">
            The Gochujang Butter Noodles recipe is the perfect walkthrough.
          </p>
          <Link
            href="/vault/gochujang-butter-noodles"
            className="inline-flex items-center gap-2 text-sienna text-sm font-semibold hover:underline underline-offset-4"
          >
            Go to recipe →
          </Link>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
