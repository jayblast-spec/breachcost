"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BreachCostOutput } from "../api/estimate/route";

const INDUSTRIES = ["Healthcare", "Finance & Banking", "Technology / SaaS", "Retail & E-commerce", "Education", "Government / Public Sector", "Legal", "Manufacturing", "Other"];
const EMPLOYEE_OPTIONS = ["1–10", "11–50", "51–250", "251–1,000", "1,001–10,000", "10,000+"];
const DATA_TYPES = [
  { id: "pii", label: "Personal info (names, emails, addresses)" },
  { id: "financial", label: "Financial data (bank accounts, income)" },
  { id: "health", label: "Health / medical records" },
  { id: "payment", label: "Payment card data (credit/debit)" },
  { id: "credentials", label: "Passwords / credentials" },
  { id: "ip", label: "Intellectual property / trade secrets" },
  { id: "biometric", label: "Biometric data" },
];
const REGIONS = ["North America (US/Canada)", "Europe (EU / GDPR)", "United Kingdom", "Asia Pacific", "Latin America", "Middle East & Africa", "Global / Multiple regions"];

const LIKELIHOOD_COLORS: Record<string, string> = {
  Low: "text-success border-success/30 bg-success/10",
  Medium: "text-warn border-warn/30 bg-warn/10",
  High: "text-danger border-danger/30 bg-danger/10",
};

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function CalculatorForm() {
  const [employees, setEmployees] = useState("");
  const [industry, setIndustry] = useState("");
  const [dataTypes, setDataTypes] = useState<string[]>([]);
  const [region, setRegion] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<BreachCostOutput | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function toggleDataType(id: string) {
    setDataTypes((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]);
  }

  const estimate = useCallback(async () => {
    if (!employees || !industry || dataTypes.length === 0 || !region) return;
    setState("loading");
    setResult(null);
    setErrorMsg("");

    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employees, industry, dataTypes: dataTypes.map(id => DATA_TYPES.find(d => d.id === id)?.label ?? id), region }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Estimation failed. Try again.");
        setState("error");
        return;
      }
      setResult(data.estimate as BreachCostOutput);
      setIsDemo(data.demo === true);
      setState("done");
    } catch {
      setErrorMsg("Network error. Check your connection and try again.");
      setState("error");
    }
  }, [employees, industry, dataTypes, region]);

  const ready = employees && industry && dataTypes.length > 0 && region;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24">
      <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">

        {/* Company size */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted block mb-3">Company size</label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {EMPLOYEE_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setEmployees(opt)}
                className={`rounded-lg border px-2 py-2 text-xs font-medium transition-all ${
                  employees === opt
                    ? "border-accent bg-accent-soft text-accent-2"
                    : "border-border bg-surface-2 text-muted hover:border-accent/40"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Industry */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted block mb-3">Industry</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-foreground outline-none focus:border-accent/60 transition-colors"
          >
            <option value="">Select your industry...</option>
            {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
          </select>
        </div>

        {/* Data types */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted block mb-3">
            Data you store <span className="normal-case text-muted/60">(select all that apply)</span>
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {DATA_TYPES.map((dt) => (
              <button
                key={dt.id}
                onClick={() => toggleDataType(dt.id)}
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition-all ${
                  dataTypes.includes(dt.id)
                    ? "border-accent bg-accent-soft text-foreground"
                    : "border-border bg-surface-2 text-muted hover:border-accent/40"
                }`}
              >
                <span className={`h-4 w-4 rounded flex-shrink-0 border flex items-center justify-center transition-colors ${
                  dataTypes.includes(dt.id) ? "bg-accent border-accent" : "border-border"
                }`}>
                  {dataTypes.includes(dt.id) && <span className="text-white text-[10px]">✓</span>}
                </span>
                {dt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Region */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted block mb-3">Primary region / jurisdiction</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-foreground outline-none focus:border-accent/60 transition-colors"
          >
            <option value="">Select your region...</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <button
          onClick={estimate}
          disabled={!ready || state === "loading"}
          className="w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-white hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {state === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent"
              />
              Calculating...
            </span>
          ) : (
            "Estimate my breach cost →"
          )}
        </button>
      </div>

      {/* Error */}
      <AnimatePresence>
        {state === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger"
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {state === "done" && result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            {isDemo && (
              <div className="rounded-xl border border-warn/30 bg-warn/10 px-4 py-2 text-xs text-warn">
                Demo estimate — add a Groq API key to get a real calculation for your business.
              </div>
            )}

            {/* Total cost */}
            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Estimated breach cost</p>
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div>
                  <p className="text-4xl font-bold text-accent-2">{fmt(result.totalLow)}</p>
                  <p className="text-sm text-muted mt-0.5">minimum estimate</p>
                </div>
                <p className="text-2xl text-muted/40 hidden sm:block">→</p>
                <div>
                  <p className="text-4xl font-bold text-accent">{fmt(result.totalHigh)}</p>
                  <p className="text-sm text-muted mt-0.5">maximum estimate</p>
                </div>
              </div>

              {/* Risk score bar */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted">Risk score</span>
                  <span className={`text-xs font-bold ${result.riskScore >= 70 ? "text-danger" : result.riskScore >= 40 ? "text-warn" : "text-success"}`}>
                    {result.riskScore}/100
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.riskScore}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={`h-full rounded-full ${result.riskScore >= 70 ? "bg-danger" : result.riskScore >= 40 ? "bg-warn" : "bg-success"}`}
                  />
                </div>
              </div>

              {/* Customer churn */}
              <div className="mt-4 rounded-xl bg-surface-2 border border-border/60 px-4 py-3">
                <p className="text-xs text-muted">Estimated customer churn following breach</p>
                <p className="text-xl font-bold text-accent-2 mt-0.5">{result.churnRate}%</p>
              </div>
            </div>

            {/* Cost breakdown */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Cost breakdown</p>
              <div className="space-y-3">
                {result.breakdown.map((item, i) => {
                  const pct = Math.round((item.high / result.totalHigh) * 100);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{item.category}</span>
                        <span className="text-xs text-muted">{fmt(item.low)}–{fmt(item.high)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden mb-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 + i * 0.08 }}
                          className="h-full rounded-full bg-accent/60"
                        />
                      </div>
                      <p className="text-xs text-muted">{item.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Regulatory risks */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Regulatory exposure</p>
              <div className="space-y-2">
                {result.regulatoryRisks.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`rounded-xl border p-3 ${r.applicable ? "border-border bg-surface-2" : "border-border/40 bg-surface/50 opacity-50"}`}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`text-sm font-semibold ${r.applicable ? "text-foreground" : "text-muted"}`}>{r.regulation}</span>
                      <span className={`text-xs font-medium rounded-full border px-2 py-0.5 ${LIKELIHOOD_COLORS[r.likelihood]}`}>
                        {r.likelihood} likelihood
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-1">Max fine: {r.maxFine}</p>
                    {!r.applicable && <p className="text-[10px] text-muted/50 mt-0.5">Not applicable to your profile</p>}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recovery timeline */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Recovery timeline</p>
              <div className="space-y-3">
                {result.recoveryTimeline.map((phase, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-3"
                  >
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-accent flex-shrink-0 mt-0.5" />
                      {i < result.recoveryTimeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                    </div>
                    <div className="pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">{phase.phase}</span>
                        <span className="text-xs text-accent-2 bg-accent-soft rounded-full px-2 py-0.5">{phase.duration}</span>
                      </div>
                      <p className="text-xs text-muted mt-0.5">{phase.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Key drivers */}
            <div className="rounded-2xl border border-warn/20 bg-warn/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-warn/80 mb-3">Key cost drivers for your profile</p>
              <div className="space-y-2">
                {result.keyDrivers.map((d, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }} className="flex gap-2">
                    <span className="text-warn text-xs mt-0.5 flex-shrink-0">▸</span>
                    <p className="text-sm text-muted">{d}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Top actions */}
            <div className="rounded-2xl border border-success/20 bg-success/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-success/80 mb-3">Top actions to reduce your risk</p>
              <div className="space-y-2">
                {result.topActions.map((action, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }} className="flex gap-2">
                    <span className="text-success text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
                    <p className="text-sm text-muted">{action}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-muted/50 text-center pb-4">
              Estimates are based on IBM Cost of a Data Breach Report 2024 benchmarks and are for informational purposes only. Not legal or financial advice.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
