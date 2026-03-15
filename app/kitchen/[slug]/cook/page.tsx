"use client";

import { use, useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RECIPE } from "@/lib/recipe";
import type { Step } from "@/lib/recipe";
import { RECIPE_SUMMARIES } from "@/lib/recipeSummaries";
import { usePrefs } from "@/lib/store";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ActiveTimer {
  id: string;
  label: string;
  total: number;
  remaining: number;
  running: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function TimerBadge({
  timer,
  onToggle,
}: {
  timer: ActiveTimer;
  onToggle: (id: string) => void;
}) {
  const pct = (timer.remaining / timer.total) * 100;
  return (
    <div
      className={`flex items-center gap-2 bg-cream border border-cream-border rounded-2xl px-4 py-2 shadow-sm ${
        timer.running ? "timer-running" : ""
      }`}
    >
      <div className="relative w-8 h-8">
        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="13" fill="none" stroke="#E8E0D0" strokeWidth="3" />
          <circle
            cx="16"
            cy="16"
            r="13"
            fill="none"
            stroke="#D4600E"
            strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 13}`}
            strokeDashoffset={`${2 * Math.PI * 13 * (1 - pct / 100)}`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-orange text-xs font-bold">
          ⏱
        </span>
      </div>
      <div>
        <p className="text-xs font-semibold text-charcoal">{timer.label}</p>
        <p className="text-xs text-muted">{formatTime(timer.remaining)}</p>
      </div>
      <button
        onClick={() => onToggle(timer.id)}
        className="ml-1 text-xs text-orange font-semibold"
      >
        {timer.running ? "Pause" : "Start"}
      </button>
    </div>
  );
}

function StepCard({
  step,
  stepNum,
  total,
  isVeg,
  onStartTimer,
  onSwipe,
}: {
  step: Step;
  stepNum: number;
  total: number;
  isVeg: boolean;
  onStartTimer: (step: Step) => void;
  onSwipe: (dir: "next" | "prev") => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const dragging = useRef(false);

  const videoId = RECIPE.videoId;
  const start = step.videoTimestamp ?? 0;
  const stepIndex = RECIPE.steps.findIndex((s) => s.id === step.id);
  const nextStep = RECIPE.steps[stepIndex + 1];
  const end = nextStep?.videoTimestamp ?? start + 60;

  const instruction = isVeg && step.vegInstruction ? step.vegInstruction : step.instruction;

  function handlePointerDown(e: React.PointerEvent) {
    startX.current = e.clientX;
    dragging.current = true;
    if (cardRef.current) {
      cardRef.current.style.transition = "none";
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    currentX.current = e.clientX - startX.current;
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${currentX.current}px)`;
      cardRef.current.style.opacity = String(1 - Math.abs(currentX.current) / 400);
    }
  }

  function handlePointerUp() {
    if (!dragging.current) return;
    dragging.current = false;
    const delta = currentX.current;
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 250ms ease, opacity 250ms ease";
      cardRef.current.style.transform = "translateX(0)";
      cardRef.current.style.opacity = "1";
    }
    currentX.current = 0;
    if (delta < -60) onSwipe("next");
    else if (delta > 60) onSwipe("prev");
  }

  return (
    <div
      ref={cardRef}
      className="card-swipe bg-cream-card border border-cream-border rounded-3xl overflow-hidden shadow-sm select-none"
      style={{ touchAction: "pan-y" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Video clip */}
      <div className="youtube-container bg-charcoal">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?start=${start}&end=${end}&rel=0&modestbranding=1`}
          title={`Step ${stepNum}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-charcoal text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
            {stepNum}
          </div>
          <span className="text-xs text-muted uppercase tracking-widest font-semibold">
            Step {stepNum} of {total}
          </span>
        </div>

        <p className="font-serif text-xl leading-9 text-charcoal">{instruction}</p>

        {step.chefNote && (
          <div className="mt-4 pl-4 border-l-2 border-orange">
            <p className="text-sm text-muted italic leading-6">{step.chefNote}</p>
          </div>
        )}

        {step.timer && (
          <button
            onClick={() => onStartTimer(step)}
            className="mt-5 inline-flex items-center gap-2 bg-orange-light text-orange border border-orange/20 rounded-2xl px-5 py-3 text-sm font-semibold"
          >
            <span>⏱</span>
            {formatTime(step.timer.seconds)} — {step.timer.label}
          </button>
        )}
      </div>
    </div>
  );
}

export default function CookPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const [prefs] = usePrefs();

  const summary = RECIPE_SUMMARIES.find((r) => r.slug === slug);
  const isFull = slug === "gochujang-butter-noodles";
  const steps: Step[] = isFull ? RECIPE.steps : [];

  const [currentStep, setCurrentStep] = useState(0);
  const [timers, setTimers] = useState<ActiveTimer[]>([]);
  const [done, setDone] = useState(false);

  const isVeg = prefs.diet === "vegetarian" || prefs.diet === "vegan";

  // Tick timers
  useEffect(() => {
    if (timers.length === 0) return;
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) => {
          if (!t.running || t.remaining <= 0) return t;
          const next = t.remaining - 1;
          if (next <= 0) {
            // Simple browser notification if available
            if (typeof window !== "undefined" && "Notification" in window) {
              new Notification(`Timer done: ${t.label}`);
            }
            return { ...t, remaining: 0, running: false };
          }
          return { ...t, remaining: next };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [timers.length]);

  function startTimer(step: Step) {
    if (!step.timer) return;
    const id = `${step.id}-${Date.now()}`;
    setTimers((prev) => [
      ...prev.filter((t) => t.id !== step.id),
      {
        id,
        label: step.timer!.label,
        total: step.timer!.seconds,
        remaining: step.timer!.seconds,
        running: true,
      },
    ]);
  }

  function toggleTimer(id: string) {
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, running: !t.running } : t))
    );
  }

  function handleSwipe(dir: "next" | "prev") {
    if (dir === "next") {
      if (currentStep >= steps.length - 1) {
        setDone(true);
      } else {
        setCurrentStep((s) => s + 1);
      }
    } else {
      setCurrentStep((s) => Math.max(0, s - 1));
    }
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <p className="text-muted">Recipe not found.</p>
      </div>
    );
  }

  if (!isFull) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 pb-20">
        <div className="max-w-lg w-full text-center">
          <span className="text-5xl mb-6 block">{summary.emoji ?? "🍜"}</span>
          <h1 className="font-serif text-3xl font-bold text-charcoal mb-3">{summary.name}</h1>
          <p className="text-muted leading-7 mb-8">
            Full recipe coming soon. This recipe is part of the complete Noodle Vault.
          </p>
          <Link href="/vault" className="block w-full bg-charcoal text-white rounded-2xl py-4 font-semibold text-base text-center">
            Back to Vault
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 pb-20 page-transition">
        <div className="max-w-lg w-full text-center">
          <span className="text-6xl mb-6 block">🎉</span>
          <h1 className="font-serif text-4xl font-bold text-charcoal leading-tight mb-3">
            You&apos;re done!
          </h1>
          <p className="text-muted text-lg mb-10">{summary.name}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.print()}
              className="w-full border-2 border-cream-border text-charcoal rounded-2xl py-4 font-semibold text-base"
            >
              Print Recipe
            </button>
            <Link
              href="/vault"
              className="block w-full bg-charcoal text-white text-center rounded-2xl py-4 font-semibold text-base"
            >
              Back to Vault
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-cream-border">
        <div
          className="h-full bg-orange transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top bar */}
      <div className="max-w-lg mx-auto w-full px-6 pt-8 pb-4 flex items-center justify-between no-print">
        <Link
          href={`/kitchen/${slug}`}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-cream-border text-muted hover:text-charcoal"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <span className="text-sm font-medium text-muted">
          Step {currentStep + 1} of {steps.length}
        </span>
        <div className="w-10" />
      </div>

      {/* Main card */}
      <div className="flex-1 max-w-lg mx-auto w-full px-6 pb-4 overflow-hidden">
        <StepCard
          step={step}
          stepNum={currentStep + 1}
          total={steps.length}
          isVeg={isVeg}
          onStartTimer={startTimer}
          onSwipe={handleSwipe}
        />
      </div>

      {/* Floating timers */}
      {timers.filter((t) => t.remaining > 0).length > 0 && (
        <div className="fixed bottom-24 right-4 flex flex-col gap-2 z-40 no-print">
          {timers
            .filter((t) => t.remaining > 0)
            .map((timer) => (
              <TimerBadge key={timer.id} timer={timer} onToggle={toggleTimer} />
            ))}
        </div>
      )}

      {/* Navigation pills */}
      <div className="max-w-lg mx-auto w-full px-6 pb-6 flex items-center gap-3 no-print">
        <button
          onClick={() => handleSwipe("prev")}
          disabled={currentStep === 0}
          className="flex-1 border-2 border-cream-border text-charcoal rounded-2xl py-3.5 font-semibold text-sm disabled:opacity-30 transition-opacity"
        >
          ← Prev
        </button>
        <span className="text-xs text-muted font-medium whitespace-nowrap">
          {currentStep + 1}/{steps.length}
        </span>
        <button
          onClick={() => handleSwipe("next")}
          className="flex-1 bg-charcoal text-white rounded-2xl py-3.5 font-semibold text-sm"
        >
          {currentStep >= steps.length - 1 ? "Finish ✓" : "Next →"}
        </button>
      </div>
    </div>
  );
}
