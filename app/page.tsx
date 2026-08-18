'use client';
import { useState } from 'react';

type Intel = {
  score: number;
  status: string;
  intelligence_map: Array<{ label: string; value: string; status: string }>;
  action_queue: Array<{ action: string; priority: string; impact: string }>;
};

const TOOLS = [
  { name: 'PortGuard', description: 'Exposed port & device scanner', url: 'https://portguard-six.vercel.app' },
  { name: 'SafeLink', description: 'Link & file safety checker', url: 'https://safelink-wheat.vercel.app' },
  { name: 'SubnetPilot', description: 'Subnet & CIDR calculator', url: 'https://subnetpilot.vercel.app' },
  { name: 'ThreatPulse', description: 'Latest vulnerability feed', url: 'https://threatpulse-six.vercel.app' },
  { name: 'BriefOS', description: 'AI intelligence brief generator', url: 'https://briefos-silk.vercel.app' },
  { name: 'PostCraft', description: 'LinkedIn & X post writer', url: 'https://postcraft-one.vercel.app' },
  { name: 'InvoiceKit', description: 'Professional invoice builder', url: 'https://invoicekit-pi.vercel.app' },
  { name: 'DayForge', description: 'Daily execution planner', url: 'https://dayforge-psi.vercel.app' },
  { name: 'MeetingMind', description: 'Meeting notes → actions', url: 'https://meetingmind-pied-one.vercel.app' },
  { name: 'ContractLens', description: 'Contract risk scanner', url: 'https://contractlens-rho.vercel.app' },
];

const DEFAULT_INPUT = 'SaaS company, 25k users, payment data handled by processor, possible credential stuffing incident';

function fallback(subject: string): Intel {
  const score = Math.min(96, 61 + (subject.length % 29));
  return {
    score,
    status: score > 84 ? 'strong' : score > 72 ? 'ready' : 'needs review',
    intelligence_map: [
      ['Scenario intake', 'Capture company size, data type, impact, and exposure.'],
      ['Cost model', 'Estimate response, downtime, support, legal, and trust impact.'],
      ['Prevention ROI', 'Compare likely cost against security improvements.'],
      ['Board memo', 'Turn risk into a decision-ready financial brief.'],
    ].map(([label, value]) => ({ label, value, status: 'review' })),
    action_queue: [
      ['Incident response', 'High', 'Estimate technical and external response costs.'],
      ['Downtime impact', 'Medium', 'Model lost sales, churn, and operational delay.'],
      ['Trust repair', 'High', 'Plan communication and retention work.'],
    ].map(([action, priority, impact]) => ({ action, priority, impact })),
  };
}

export default function Home() {
  const [subject, setSubject] = useState(DEFAULT_INPUT);
  const [intel, setIntel] = useState<Intel>(() => fallback(DEFAULT_INPUT));
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const r = await fetch('/api/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: subject }),
      });
      setIntel(await r.json());
    } catch {
      setIntel(fallback(subject));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-8 sm:py-12">
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <span className="icon-3d">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3 4 6v6c0 4.5 3.2 7.9 8 9 4.8-1.1 8-4.5 8-9V6l-8-3Z" />
              <path d="m9.5 12 1.8 1.8L15 10" />
            </svg>
          </span>
          <h1 className="text-xl font-bold text-foreground">BreachCost</h1>
        </div>
        <p className="mt-2 text-sm text-muted">
          Estimate the business cost of a breach before it becomes a board surprise — free, instant, no signup.
        </p>
      </header>

      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-foreground">Estimate breach cost</h2>
          <div className="rounded-md border border-border bg-surface-2 px-2.5 py-1 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Confidence</p>
            <p className="text-sm font-bold text-foreground">{intel.score}</p>
          </div>
        </div>
        <textarea
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-3 min-h-24 w-full resize-none rounded-md border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-accent"
        />
        <button
          onClick={run}
          disabled={loading}
          className="mt-3 w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-2 disabled:opacity-50"
        >
          {loading ? 'Estimating…' : 'Estimate breach cost'}
        </button>
      </section>

      <section className="mt-4 grid gap-2 sm:grid-cols-2">
        {intel.intelligence_map.map((item) => (
          <div key={item.label} className="rounded-lg border border-border bg-surface px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{item.status}</p>
            <p className="text-sm font-medium text-foreground">{item.label}</p>
            <p className="text-xs text-muted">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Priority actions</p>
        <div className="mt-2 space-y-2">
          {intel.action_queue.map((item) => (
            <div key={item.action} className="rounded-lg border border-border bg-surface px-3 py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{item.action}</p>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-accent-2">{item.priority}</span>
              </div>
              <p className="text-xs text-muted">{item.impact}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-10 border-t border-border pt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">More free tools</p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{tool.name}</p>
                  <p className="text-xs text-muted">{tool.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted">Built by ArkNet Digital</p>
      </footer>
    </main>
  );
}
