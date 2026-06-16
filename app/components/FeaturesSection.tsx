"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FEATURES = [
  {
    icon: "💰",
    title: "Real cost ranges",
    body: "Built on IBM Cost of Data Breach 2024 benchmarks. Your estimate is calibrated to your company size, industry, and the type of data you store — not a generic number.",
  },
  {
    icon: "⚖️",
    title: "Regulatory fine exposure",
    body: "GDPR, HIPAA, PCI DSS — your applicable regulations are automatically identified with maximum fine calculations and likelihood ratings.",
  },
  {
    icon: "📅",
    title: "Recovery timeline",
    body: "From containment to full recovery — see exactly what happens in each phase, how long it takes, and what it costs at every stage.",
  },
  {
    icon: "📊",
    title: "Cost breakdown",
    body: "Detection, notification, legal response, and lost business — each cost category broken down so you know where the money goes when a breach happens.",
  },
  {
    icon: "🎯",
    title: "Prioritised action plan",
    body: "The AI surfaces your top 4 security investments ranked by their impact on reducing breach cost — specific to your business profile.",
  },
  {
    icon: "🔒",
    title: "Make the ROI case",
    body: "Security budgets always fight for approval. BreachCost gives you the numbers to show leadership exactly what prevention is worth.",
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="mx-auto max-w-4xl px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          The question is no longer{" "}
          <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
            if you can afford it
          </span>
        </h2>
        <p className="mt-3 text-muted">
          It&apos;s whether you can afford not to. Prevention costs 10× less than recovery.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="rounded-2xl border border-border bg-surface p-5 hover:border-accent/40 transition-colors"
          >
            <div className="mb-3 text-2xl">{f.icon}</div>
            <p className="mb-1 font-semibold text-foreground">{f.title}</p>
            <p className="text-sm text-muted leading-relaxed">{f.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
