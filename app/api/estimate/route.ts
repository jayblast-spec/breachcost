export const maxDuration = 30;

export type BreakdownItem = {
  category: string;
  low: number;
  high: number;
  description: string;
};

export type RegulatoryRisk = {
  regulation: string;
  maxFine: string;
  applicable: boolean;
  likelihood: "Low" | "Medium" | "High";
};

export type RecoveryPhase = {
  phase: string;
  duration: string;
  description: string;
};

export type BreachCostOutput = {
  totalLow: number;
  totalHigh: number;
  breakdown: BreakdownItem[];
  regulatoryRisks: RegulatoryRisk[];
  recoveryTimeline: RecoveryPhase[];
  churnRate: number;
  riskScore: number;
  topActions: string[];
  keyDrivers: string[];
};

const DEMO: BreachCostOutput = {
  totalLow: 280000,
  totalHigh: 950000,
  breakdown: [
    { category: "Detection & Escalation", low: 45000, high: 120000, description: "Forensic investigation, crisis management, and executive communication costs." },
    { category: "Notification", low: 35000, high: 80000, description: "Customer notification letters, call centre setup, and identity protection services." },
    { category: "Post-Breach Response", low: 80000, high: 250000, description: "Legal fees, PR agency, regulatory liaison, and security remediation." },
    { category: "Lost Business", low: 120000, high: 500000, description: "Customer churn, reputational damage, and new customer acquisition slowdown." },
  ],
  regulatoryRisks: [
    { regulation: "GDPR", maxFine: "€20M or 4% of annual turnover", applicable: true, likelihood: "Medium" },
    { regulation: "UK GDPR / ICO", maxFine: "£17.5M or 4% of turnover", applicable: true, likelihood: "Low" },
    { regulation: "PCI DSS", maxFine: "$5,000–$100,000/month", applicable: false, likelihood: "Low" },
  ],
  recoveryTimeline: [
    { phase: "Containment", duration: "1–3 days", description: "Isolate affected systems, reset credentials, engage IR team." },
    { phase: "Notification", duration: "Days 3–30", description: "Notify affected individuals and regulators within legal deadlines." },
    { phase: "Remediation", duration: "1–3 months", description: "Patch vulnerabilities, implement new controls, rebuild trust." },
    { phase: "Recovery", duration: "3–12 months", description: "Restore customer trust, complete regulatory investigations, close claims." },
  ],
  churnRate: 8,
  riskScore: 58,
  topActions: [
    "Implement multi-factor authentication across all user accounts immediately",
    "Encrypt all personally identifiable information (PII) at rest and in transit",
    "Conduct a third-party penetration test within the next 90 days",
    "Draft and test an incident response plan before a breach occurs",
  ],
  keyDrivers: [
    "SMB size: lower detection budgets extend the breach lifecycle and increase cost",
    "Customer PII stored: notification and remediation costs scale with affected individuals",
    "No MFA: credential attacks account for 36% of all breaches",
  ],
};

const SYSTEM = `You are a cybersecurity financial analyst. Based on the business profile provided, calculate a realistic data breach cost estimate grounded in IBM Cost of a Data Breach Report 2024 data.

Key benchmarks to use:
- Global average breach cost: $4.88M
- SMB (<1000 employees) average: $2.98M
- Large enterprise (>10,000 employees) average: $5.31M
- By industry: Healthcare $9.77M, Finance $6.08M, Technology $5.45M, Retail $3.48M, Education $3.79M, Government $2.55M
- Breakdown typically: Detection 25%, Notification 15%, Post-breach 25%, Lost business 35%
- GDPR: up to €20M or 4% annual global turnover (whichever higher)
- HIPAA: $100–$50,000 per violation, max $1.9M/year per category
- PCI DSS: $5,000–$100,000/month until compliant

Scale estimates DOWN significantly for small businesses. A 10-person startup stores 500 customers — their costs are very different from a 500-person firm with 50,000 customers.

Return ONLY valid JSON with this exact structure:
{
  "totalLow": number (USD, no commas),
  "totalHigh": number (USD, no commas),
  "breakdown": [
    { "category": string, "low": number, "high": number, "description": string }
  ],
  "regulatoryRisks": [
    { "regulation": string, "maxFine": string, "applicable": boolean, "likelihood": "Low"|"Medium"|"High" }
  ],
  "recoveryTimeline": [
    { "phase": string, "duration": string, "description": string }
  ],
  "churnRate": number (percentage 1-40),
  "riskScore": number (0-100, higher = more risk),
  "topActions": string[] (4 specific, actionable items),
  "keyDrivers": string[] (3 factors most affecting this business's cost)
}

No markdown fences, no explanation. Only JSON.`;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const employees = body?.employees as string;
  const industry = body?.industry as string;
  const dataTypes = Array.isArray(body?.dataTypes) ? (body.dataTypes as string[]) : [];
  const region = body?.region as string;

  if (!employees || !industry || dataTypes.length === 0 || !region) {
    return Response.json({ error: "Please fill in all fields before estimating." }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 1800));
    return Response.json({ demo: true, estimate: DEMO });
  }

  const prompt = `Business profile:
- Company size: ${employees} employees
- Industry: ${industry}
- Data stored: ${dataTypes.join(", ")}
- Primary region / jurisdiction: ${region}

Estimate the realistic cost range for a data breach at this company. Scale appropriately for their size and industry.`;

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 1600,
      }),
    });

    if (!groqRes.ok) {
      return Response.json({ error: "AI service unavailable. Try again shortly." }, { status: 502 });
    }

    const data = await groqRes.json();
    const raw = data?.choices?.[0]?.message?.content ?? "";

    let estimate: BreachCostOutput;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      estimate = JSON.parse(jsonMatch ? jsonMatch[0] : raw) as BreachCostOutput;
    } catch {
      return Response.json({ error: "AI returned an unexpected response. Try again." }, { status: 500 });
    }

    return Response.json({ demo: false, estimate });
  } catch {
    return Response.json({ error: "Something went wrong. Try again shortly." }, { status: 502 });
  }
}
