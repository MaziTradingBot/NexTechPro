"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Sparkles, Smartphone, Laptop, Gamepad2, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

const slideLinks = ["/catalog?category=phones", "/catalog?category=laptops", "/catalog?category=gaming"];

export function Hero() {
  const { messages, t } = useI18n();
  const slides = messages.hero.slides;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(id);
  }, [slides.length]);

  const slide = slides[index];

  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div className="absolute inset-0 grid-bg opacity-60" aria-hidden />
      <div
        className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-accent-500/30 blur-3xl"
        aria-hidden
      />

      <div className="wrap relative grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-brand-100">
            <Sparkles size={14} className="text-accent-400" />
            {t("hero.badge")}
          </span>

          <div className="mt-6 min-h-[220px] sm:min-h-[210px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <p className="text-sm font-semibold uppercase tracking-wider text-accent-400">
                  {slide.eyebrow}
                </p>
                <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  {slide.title}
                </h1>
                <p className="mt-4 max-w-md text-base text-slate-300 sm:text-lg">
                  {slide.subtitle}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href={slideLinks[index]}
                    className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-ink-950 transition hover:bg-brand-50"
                  >
                    {slide.cta}
                    <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {t("nav.catalog")}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {["#6366f1", "#06b6d4", "#a855f7", "#f43f5e"].map((c) => (
                <span
                  key={c}
                  className="h-8 w-8 rounded-full border-2 border-ink-950"
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-300">
              <Star size={15} className="text-amber-400" fill="currentColor" />
              <span className="font-semibold text-white">4.9</span>
              <span>· {t("hero.trusted")}</span>
            </div>
          </div>

          {/* slide dots */}
          <div className="mt-6 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-white" : "w-3 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* floating device composition */}
        <div className="relative hidden h-[420px] lg:block">
          <FloatCard className="left-6 top-4" delay={0} accent="#6366f1" icon={<Smartphone />} big />
          <FloatCard className="right-8 top-24" delay={1.2} accent="#06b6d4" icon={<Laptop />} />
          <FloatCard className="bottom-6 left-24" delay={0.6} accent="#a855f7" icon={<Gamepad2 />} />
          <div className="absolute inset-0 -z-10 m-auto h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute inset-0 -z-10 m-auto h-96 w-96 rounded-full border border-white/5" />
        </div>
      </div>
    </section>
  );
}

function FloatCard({
  className,
  accent,
  icon,
  delay,
  big,
}: {
  className?: string;
  accent: string;
  icon: React.ReactNode;
  delay: number;
  big?: boolean;
}) {
  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute grid place-items-center rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl ${
        big ? "h-40 w-40" : "h-32 w-32"
      } ${className}`}
    >
      <div
        className="grid h-16 w-16 place-items-center rounded-2xl text-white"
        style={{ background: `linear-gradient(150deg, ${accent}, ${accent}bb)` }}
      >
        <span className="[&>svg]:h-8 [&>svg]:w-8">{icon}</span>
      </div>
    </motion.div>
  );
}
