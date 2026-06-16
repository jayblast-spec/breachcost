export type IntelligenceInput = { input?: string };
const product = {
  "repo": "breachcost",
  "brand": "BreachCost",
  "suite": "Professional Utility",
  "domain": "Cyber risk finance",
  "accent": "from-orange-300 via-red-300 to-fuchsia-300",
  "hero": "Estimate the business cost of a breach before it becomes a board surprise.",
  "sub": "BreachCost helps founders, operators, and security leads translate incident scenarios into financial exposure, recovery work, trust loss, and prevention priorities.",
  "input": "SaaS company, 25k users, payment data handled by processor, possible credential stuffing incident",
  "cta": "Estimate breach cost",
  "score": "Cost confidence",
  "modules": [
    [
      "Scenario intake",
      "Capture company size, data type, impact, and exposure."
    ],
    [
      "Cost model",
      "Estimate response, downtime, support, legal, and trust impact."
    ],
    [
      "Prevention ROI",
      "Compare likely cost against security improvements."
    ],
    [
      "Board memo",
      "Turn risk into a decision-ready financial brief."
    ]
  ],
  "rows": [
    [
      "Incident response",
      "Recovery",
      "High",
      "Estimate technical and external response costs."
    ],
    [
      "Downtime impact",
      "Revenue",
      "Medium",
      "Model lost sales, churn, and operational delay."
    ],
    [
      "Trust repair",
      "Brand",
      "High",
      "Plan communication and retention work."
    ],
    [
      "Prevention budget",
      "Strategy",
      "Medium",
      "Prioritize fixes by avoided cost."
    ]
  ],
  "missions": [
    [
      "Cost benchmark library",
      "Improve assumptions using public breach cost sources."
    ],
    [
      "Scenario templates",
      "Add SaaS, ecommerce, healthcare, nonprofit, and agency models."
    ],
    [
      "Prevention ROI engine",
      "Compare fix cost against likely loss."
    ],
    [
      "Board report export",
      "Create a concise decision memo for leaders."
    ]
  ]
} as const;
function scoreFor(subject: string) { let score = 56 + Math.min(31, Math.floor(subject.length / 6)); if (/risk|breach|trust|domain|role|ops|cost|email|launch|customer|incident/i.test(subject)) score += 8; return Math.min(98, score); }
export function generateIntelligence({ input = '' }: IntelligenceInput) { const subject = input.trim() || product.input; const score = scoreFor(subject); return { product: product.brand, suite: product.suite, domain: product.domain, subject, score, status: score >= 86 ? 'strong' : score >= 72 ? 'ready' : 'needs review', executive_summary: product.sub, intelligence_map: product.modules.map(([label,value]) => ({ label, value, status: score >= 72 ? 'priority' : 'review' })), action_queue: product.rows.slice(0,3).map(([item,owner,priority,note]) => ({ action: item + ' - ' + owner, priority, impact: note })), contributor_lanes: product.missions.map(([lane,mission]) => ({ lane, mission })), generated_at: new Date().toISOString() }; }
