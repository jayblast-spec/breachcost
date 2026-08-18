<div align="center">

# BreachCost

### Estimate the Financial Cost of a Breach Before It Becomes a Board Surprise

BreachCost helps founders, operators, and security leads translate an incident scenario into a financial estimate: response cost, notification cost, regulatory exposure, recovery timeline, and customer churn — so a security decision can be made with a number attached instead of a guess.

<p>
  <a href="https://breachcost.vercel.app"><img alt="Live Demo" src="https://img.shields.io/badge/Live-Demo-1D4ED8?style=for-the-badge&logo=vercel&logoColor=white"></a>
  <a href="https://github.com/jayblast-spec/breachcost"><img alt="GitHub Repo" src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white"></a>
</p>

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-App%20Router-000000?style=flat-square&logo=next.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-38BDF8?style=flat-square&logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Product%20Layer-1D4ED8?style=flat-square&logo=typescript&logoColor=white">
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-Design%20System-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white">
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer%20Motion-Interface%20Motion-1D4ED8?style=flat-square&logo=framer&logoColor=white">
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-Functions-000000?style=flat-square&logo=vercel&logoColor=white">
</p>

<p>
  <img alt="Animated headline" src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=18&duration=2600&pause=650&color=38BDF8&center=true&vCenter=true&width=760&lines=Incident+scenario+%E2%86%92+dollar+estimate;Detection%2C+notification%2C+recovery%2C+churn;Regulatory+exposure+by+likelihood;A+decision-ready+board+memo">
</p>

</div>

## What It Does

BreachCost turns a described incident (company size, data type, exposure scenario) into a structured cost estimate:

- **Cost breakdown** — a low/high range across detection and escalation, customer notification, post-breach response, and recovery categories, each with its own description.
- **Regulatory risk** — flags applicable regulations, their maximum fine, and likelihood of enforcement for the described scenario.
- **Recovery timeline** — phased recovery plan with expected duration per phase.
- **Churn and risk score** — an estimated customer churn rate and an overall risk score tied to the scenario.
- **Prevention priorities and key drivers** — the top actions and cost drivers a team should act on first, so the estimate becomes a security budget argument, not just a number.

## How It Works

- Built on Next.js App Router with TypeScript, Tailwind CSS 4, and Framer Motion for interface transitions, deployed as Vercel serverless functions.
- `app/api/estimate` computes the structured cost model (breakdown, regulatory risks, recovery timeline, churn rate, risk score, top actions) from the submitted scenario.
- `app/api/intelligence` powers the homepage command studio with a deterministic scoring model, returning a cost-confidence score, an intelligence map, and an action queue.
- Output is deterministic and scenario-driven rather than sourced from a live claims database, framed as a modeling tool for prioritization rather than an actuarial guarantee.

## Engineering Notes

**The real problem:** Founders and operators need a breach-cost gut-check today, not after a $400/hr forensics consult they can't afford yet — but a static calculator is either useless (too generic) or dishonest (fake precision).

**The approach:** `/api/estimate` sends the scenario to Groq with a strict structured-output schema (`BreachCostOutput`) so the model returns typed categories — not prose — and falls back to a fixed demo estimate when no `GROQ_API_KEY` is set, so the UI degrades gracefully instead of breaking.

**One real number:** the demo fallback isn't a random placeholder — it's a $280K–$950K range built from real cost categories (detection/escalation, notification, response, recovery), the same schema the live model fills in.

**Not handled yet:** the homepage "intelligence score" widget (`/api/intelligence`) is a decorative teaser using a string-length heuristic, not a scoring model — it's cosmetic, and shouldn't be read as part of the cost engine.

## Live

[breachcost.vercel.app](https://breachcost.vercel.app)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| UI | React 19, Tailwind CSS 4, Framer Motion |
| Language | TypeScript |
| Cost engine | Deterministic scenario-driven cost model |
| Deployment | Vercel serverless functions |

<div align="center">

<img alt="Footer" src="https://capsule-render.vercel.app/api?type=rect&height=60&color=0:1D4ED8,55:0B1E3D,100:020617&text=michael%40arknet.digital&fontColor=FAFAFA&fontSize=18&fontAlign=50&animation=fadeIn">

</div>
