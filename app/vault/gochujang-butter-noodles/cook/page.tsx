"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { RECIPE, type Step } from "@/lib/recipe";
import { usePrefs } from "@/lib/store";

// ─── Timer ───────────────────────────────────────────────────────────────────

interface TimerState {
  id: string;
  label: string;
  stepLabel: string;
  totalSeconds: number;
  remainingSeconds: number;
  running: boolean;
}

// ─── YouTube iframe control ───────────────────────────────────────────────────

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

// ─── Floating Timers ──────────────────────────────────────────────────────────

function FloatingTimers({
  timers,
  onToggle,
  onReset,
  onDismiss,
}: {
  timers: TimerState[];
  onToggle: (id: string) => void;
  onReset: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  if (timers.length === 0) return null;
  return (
    <div className="fixed bottom-24 right-3 z-50 flex flex-col gap-2 w-[200px]">
      {timers.map((t) => {
        const mins = Math.floor(t.remainingSeconds / 60);
        const secs = t.remainingSeconds % 60;
        const pct = ((t.totalSeconds - t.remainingSeconds) / t.totalSeconds) * 100;
        const done = t.remainingSeconds === 0;
        return (
          <div key={t.id}
            className={`text-white rounded-2xl p-3 shadow-xl ${
              done ? "bg-green-800" : t.running ? "bg-charcoal timer-running" : "bg-charcoal"
            }`}>
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-xs font-semibold text-white/80">{t.stepLabel}</p>
                <p className="text-xs text-white/50">{t.label}</p>
              </div>
              <button onClick={() => onDismiss(t.id)}
                className="text-white/40 hover:text-white text-sm ml-2 leading-none p-1" aria-label="Dismiss">
                ✕
              </button>
            </div>
            <div className="h-1 bg-white/20 rounded-full mb-2 overflow-hidden">
              <div className="h-full bg-sienna rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-mono text-lg font-bold ${done ? "text-green-300" : "text-white"}`}>
                {done ? "Done!" : `${mins}:${secs.toString().padStart(2, "0")}`}
              </span>
              <div className="flex gap-1.5 ml-auto">
                {!done && (
                  <button onClick={() => onToggle(t.id)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    {t.running ? "⏸" : "▶"}
                  </button>
                )}
                <button onClick={() => onReset(t.id)}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  ↺
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Video Modal ──────────────────────────────────────────────────────────────

function VideoModal({
  videoId,
  timestamp,
  onClose,
}: {
  videoId: string;
  timestamp: number;
  onClose: () => void;
}) {
  const { iframeRef, seekTo } = useYouTubeIframe();

  useEffect(() => {
    // Slight delay to let iframe initialise
    const t = setTimeout(() => seekTo(timestamp), 800);
    return () => clearTimeout(t);
  }, [seekTo, timestamp]);

  return (
    <div className="fixed inset-0 flex flex-col bg-black/90 backdrop-blur-sm" style={{ zIndex: 60 }} onClick={onClose}>
      <div className="flex items-center justify-between px-6 pt-14 pb-4">
        <p className="text-white/70 text-sm font-medium">Watch this step</p>
        <button onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
          ✕
        </button>
      </div>
      <div className="px-4 flex-1 flex items-center" onClick={(e) => e.stopPropagation()}>
        <div className="w-full rounded-3xl overflow-hidden">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&modestbranding=1&rel=0&autoplay=1`}
              title="Step walkthrough"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step Card ────────────────────────────────────────────────────────────────

function StepCard({
  step,
  index,
  total,
  isVeg,
  timers,
  onStartTimer,
  onWatchStep,
  dir,
}: {
  step: Step;
  index: number;
  total: number;
  isVeg: boolean;
  timers: TimerState[];
  onStartTimer: (stepId: string, stepLabel: string, timerLabel: string, seconds: number) => void;
  onWatchStep: (timestamp: number) => void;
  dir: "left" | "right" | null;
}) {
  const [noteOpen, setNoteOpen] = useState(false);
  const instruction = isVeg && step.vegInstruction ? step.vegInstruction : step.instruction;
  const activeTimer = timers.find((t) => t.id === step.id);

  return (
    <div className={`select-none card-swipe ${dir ? (dir === "left" ? "opacity-0 -translate-x-8" : "opacity-0 translate-x-8") : ""}`}>
      {/* Card */}
      <div className="bg-ivory-card border border-ivory-border rounded-3xl overflow-hidden shadow-card">
        {/* Step number header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ivory-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-charcoal text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
              {index + 1}
            </div>
            <div>
              <p className="text-xs text-stone-light uppercase tracking-label font-medium">Step {index + 1} of {total}</p>
            </div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i < index ? "w-4 bg-sienna" : i === index ? "w-6 bg-sienna" : "w-4 bg-ivory-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Instruction */}
        <div className="px-6 py-6">
          <p className="text-charcoal text-base leading-relaxed font-medium">
            {instruction}
          </p>

          {/* Timer + watch buttons */}
          <div className="flex flex-wrap gap-2 mt-5">
            {step.timer && (
              <button
                onClick={() => onStartTimer(step.id, `Step ${index + 1}`, step.timer!.label, step.timer!.seconds)}
                className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full border transition-all active:scale-95 ${
                  activeTimer?.running
                    ? "bg-sienna text-white border-sienna"
                    : activeTimer?.remainingSeconds === 0
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-ivory border-ivory-border text-stone hover:border-sienna hover:text-sienna"
                }`}>
                <span className="text-base">
                  {activeTimer?.running ? "⏱" : activeTimer?.remainingSeconds === 0 ? "✓" : "⏱"}
                </span>
                {activeTimer?.running
                  ? `${Math.floor(activeTimer.remainingSeconds / 60)}:${(activeTimer.remainingSeconds % 60).toString().padStart(2, "0")}`
                  : activeTimer?.remainingSeconds === 0
                  ? "Done"
                  : `${Math.floor(step.timer.seconds / 60)}:${(step.timer.seconds % 60).toString().padStart(2, "0")} ${step.timer.label}`}
              </button>
            )}

            {step.videoTimestamp !== undefined && (
              <button onClick={() => onWatchStep(step.videoTimestamp!)}
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full border border-ivory-border bg-ivory text-stone hover:border-sienna hover:text-sienna transition-colors active:scale-95">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                </svg>
                Watch this step
              </button>
            )}
          </div>

          {/* Chef note */}
          {step.chefNote && (
            <div className="mt-5">
              <button onClick={() => setNoteOpen(!noteOpen)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-stone hover:text-sienna transition-colors">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  noteOpen ? "bg-sienna text-white" : "bg-sienna-faint text-sienna border border-sienna/20"
                }`}>C</span>
                Chef&apos;s note
                <span className={`transition-transform duration-200 ${noteOpen ? "rotate-180" : ""}`}>▾</span>
              </button>
              {noteOpen && (
                <div className="chef-note-enter mt-3 p-4 bg-sienna-faint border-l-2 border-sienna rounded-r-2xl text-sm text-charcoal leading-relaxed italic">
                  &ldquo;{step.chefNote}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Done Card ────────────────────────────────────────────────────────────────

function DoneCard({ recipeName }: { recipeName: string }) {
  return (
    <div className="bg-ivory-card border border-ivory-border rounded-3xl overflow-hidden shadow-card">
      <div className="px-6 py-12 flex flex-col items-center text-center">
        <div className="text-6xl mb-6">🎉</div>
        <p className="text-xs uppercase tracking-label font-medium text-stone-light mb-3">You did it</p>
        <h2 className="font-serif text-3xl text-charcoal leading-tight mb-4">
          {recipeName}
        </h2>
        <p className="text-stone text-sm leading-relaxed mb-8">
          Serve immediately. Noodles absorb sauce as they sit — the bowl is at its best right now.
        </p>
        <Link href="/vault/gochujang-butter-noodles"
          className="w-full flex items-center justify-center gap-2 bg-sienna text-white font-semibold text-sm py-4 rounded-2xl hover:bg-sienna-hover transition-colors active:scale-95 mb-3">
          Back to Recipe
        </Link>
        <Link href="/vault"
          className="w-full flex items-center justify-center gap-2 border border-ivory-border text-stone font-semibold text-sm py-4 rounded-2xl hover:border-sienna hover:text-sienna transition-colors active:scale-95">
          Back to Vault
        </Link>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const SWIPE_THRESHOLD = 50;

export default function CookPage() {
  const recipe = RECIPE;
  const [prefs] = usePrefs();
  const isVeg = prefs.diet === "vegetarian" || prefs.diet === "vegan";

  const [stepIndex, setStepIndex] = useState(0);
  const [timers, setTimers] = useState<TimerState[]>([]);
  const [videoModal, setVideoModal] = useState<{ open: boolean; timestamp: number }>({ open: false, timestamp: 0 });
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);

  const pointerStartX = useRef<number>(0);
  const isDragging = useRef(false);

  const totalSteps = recipe.steps.length;
  const isDone = stepIndex >= totalSteps;

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) => {
          if (!t.running || t.remainingSeconds === 0) return t;
          const next = t.remainingSeconds - 1;
          if (next === 0) {
            try {
              const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = 880;
              gain.gain.setValueAtTime(0.3, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
              osc.start();
              osc.stop(ctx.currentTime + 1.5);
            } catch (_) {}
          }
          return { ...t, remainingSeconds: next, running: next > 0 };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function animateTo(dir: "left" | "right", callback: () => void) {
    setSwipeDir(dir);
    setTimeout(() => {
      callback();
      setSwipeDir(null);
    }, 220);
  }

  function goNext() {
    if (isDone) return;
    animateTo("left", () => setStepIndex((i) => Math.min(i + 1, totalSteps)));
  }

  function goPrev() {
    if (stepIndex === 0) return;
    animateTo("right", () => setStepIndex((i) => Math.max(i - 1, 0)));
  }

  // Pointer events for swipe
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    pointerStartX.current = e.clientX;
    isDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = e.clientX - pointerStartX.current;
    if (delta < -SWIPE_THRESHOLD) goNext();
    else if (delta > SWIPE_THRESHOLD) goPrev();
  }

  const startTimer = (stepId: string, stepLabel: string, timerLabel: string, seconds: number) => {
    const existing = timers.find((t) => t.id === stepId);
    if (existing) {
      setTimers((prev) => prev.map((t) => t.id === stepId ? { ...t, running: !t.running } : t));
      return;
    }
    setTimers((prev) => [...prev, { id: stepId, label: timerLabel, stepLabel, totalSeconds: seconds, remainingSeconds: seconds, running: true }]);
  };

  const toggleTimer = (id: string) => setTimers((prev) => prev.map((t) => t.id === id ? { ...t, running: !t.running } : t));
  const resetTimer = (id: string) => setTimers((prev) => prev.map((t) => t.id === id ? { ...t, remainingSeconds: t.totalSeconds, running: false } : t));
  const dismissTimer = (id: string) => setTimers((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="min-h-screen bg-ivory flex flex-col page-transition">

      {/* Video Modal */}
      {videoModal.open && (
        <VideoModal
          videoId={recipe.videoId}
          timestamp={videoModal.timestamp}
          onClose={() => setVideoModal({ open: false, timestamp: 0 })}
        />
      )}

      {/* Header */}
      <div className="flex-shrink-0 max-w-lg mx-auto w-full px-6">
        <div className="pt-12 pb-5 flex items-center justify-between">
          <Link href="/vault/gochujang-butter-noodles"
            className="inline-flex items-center gap-2 text-sm text-stone hover:text-charcoal transition-colors group">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Recipe
          </Link>
          <p className="text-xs uppercase tracking-label font-medium text-stone-light">Cook Mode</p>
          {/* Step counter (non-done) */}
          {!isDone && (
            <p className="text-sm font-semibold text-stone">
              {stepIndex + 1}<span className="text-stone-light font-normal">/{totalSteps}</span>
            </p>
          )}
          {isDone && <div className="w-8" />}
        </div>
      </div>

      {/* Swipe area */}
      <div className="flex-1 max-w-lg mx-auto w-full px-6 pb-32"
        onPointerDown={isDone ? undefined : onPointerDown}
        onPointerUp={isDone ? undefined : onPointerUp}
        style={{ touchAction: "pan-y" }}>

        {isDone ? (
          <DoneCard recipeName={recipe.name} />
        ) : (
          <StepCard
            step={recipe.steps[stepIndex]}
            index={stepIndex}
            total={totalSteps}
            isVeg={isVeg}
            timers={timers}
            onStartTimer={startTimer}
            onWatchStep={(ts) => setVideoModal({ open: true, timestamp: ts })}
            dir={swipeDir}
          />
        )}

        {/* Swipe hint — show on first step only */}
        {!isDone && stepIndex === 0 && (
          <p className="text-center text-xs text-stone-light mt-5">
            Swipe left for next step · swipe right to go back
          </p>
        )}
      </div>

      {/* Bottom nav — prev / next */}
      {!isDone && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-ivory/95 backdrop-blur border-t border-ivory-border px-6 py-3"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}>
          <div className="max-w-lg mx-auto flex gap-3">
            <button onClick={goPrev} disabled={stepIndex === 0}
              className={`flex-1 flex items-center justify-center gap-2 font-semibold text-sm py-3.5 rounded-2xl border transition-all active:scale-95 ${
                stepIndex === 0
                  ? "border-ivory-border text-stone-light cursor-not-allowed"
                  : "border-ivory-border text-stone hover:border-sienna hover:text-sienna"
              }`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Prev
            </button>
            <button onClick={goNext}
              className="flex-[2] flex items-center justify-center gap-2 bg-sienna text-white font-semibold text-sm py-3.5 rounded-2xl hover:bg-sienna-hover transition-colors active:scale-95">
              {stepIndex === totalSteps - 1 ? "Finish 🎉" : "Next Step"}
              {stepIndex < totalSteps - 1 && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Floating timers */}
      <FloatingTimers timers={timers} onToggle={toggleTimer} onReset={resetTimer} onDismiss={dismissTimer} />
    </div>
  );
}
