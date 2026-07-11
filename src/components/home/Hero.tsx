"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

const slideLinks = [
  "/catalog?category=phones",
  "/catalog?category=laptops",
  "/catalog?category=gaming",
];
// Accent wash per slide (evokes the product hero photo).
const slideWash = [
  "radial-gradient(90% 120% at 75% 30%, rgba(139,92,246,0.55), transparent 60%), radial-gradient(80% 120% at 100% 100%, rgba(34,211,238,0.4), transparent 55%)",
  "radial-gradient(90% 120% at 75% 20%, rgba(59,130,246,0.55), transparent 60%), radial-gradient(80% 120% at 95% 100%, rgba(236,72,153,0.4), transparent 55%)",
  "radial-gradient(90% 120% at 75% 30%, rgba(168,85,247,0.55), transparent 60%), radial-gradient(80% 120% at 100% 90%, rgba(6,182,212,0.45), transparent 55%)",
];

export function Hero() {
  const { messages, t } = useI18n();
  const slides = messages.hero.slides;
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(id);
  }, [slides.length]);

  const slide = slides[index];

  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <motion.div
        key={`wash-${index}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
        style={{ backgroundImage: slideWash[index] }}
        aria-hidden
      />

      {/* arrows */}
      <button
        onClick={() => go(-1)}
        aria-label="Previous"
        className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/5 p-2 text-white backdrop-blur transition hover:bg-white/15 sm:grid"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next"
        className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/5 p-2 text-white backdrop-blur transition hover:bg-white/15 sm:grid"
      >
        <ChevronRight size={20} />
      </button>

      <div className="wrap relative flex min-h-[440px] items-center py-16 md:min-h-[520px] md:py-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-300 ring-1 ring-violet-400/30">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              {slide.eyebrow}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-md text-base text-slate-300 sm:text-lg">{slide.subtitle}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={slideLinks[index]}
                className="group inline-flex items-center gap-2 rounded-xl brand-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(34,211,238,0.7)] transition hover:opacity-90"
              >
                {slide.cta}
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-xl border border-brand-400/50 px-6 py-3.5 text-sm font-semibold text-brand-300 transition hover:bg-brand-500/10"
              >
                {t("common.viewAll")}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* dots + counter */}
        <div className="absolute bottom-6 left-0 right-0">
          <div className="wrap flex items-center justify-between">
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-8 bg-brand-400" : "w-3 bg-white/25"
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-sm text-slate-400">
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
