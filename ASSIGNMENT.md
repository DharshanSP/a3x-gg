# Gharpayy Lead Management CRM — Assignment Submission

## Live App
- **Vercel**: Deploy via `npx vercel --prod` or connect GitHub repo
- **Reference**: https://a3x-gg.lovable.app

---

## What Was Done

### 3 Existing Modules Activated (with full backend data flow)

| Module | Route | Description |
|--------|-------|-------------|
| **Movement OS** | `/movement` | Customer journey: draft → priority → live work → handoff → outcome. Connected to Zustand store with WhatsApp bridge syncing lead identity, unread counts, and claim ownership. |
| **Admin Movement Control** | `/admin` | Founder/Zone Manager console: zone league, funnel grid, people desk, checkpoints, war room, SLA analytics, and comparison-period tracking via `useAdminFocus()`. |
| **Closing Desk** | `/closing` | Promise tracking board: quote → decision → booking → payment → check-in. Live kept/broken promise accuracy, at-risk triage, and broken-promise reason breakdown. |

### 2 New Growth Features Built

---

### Feature 1: Automated Lead Nurturing (`/nurturing`)

**What it does:** Automatically generates follow-up tasks and simulated WhatsApp/SMS messages when lead status changes.

**Key capabilities:**
- Auto-detects overdue next actions and creates urgent follow-up tasks
- Flags stale leads (2+ days since last update) for re-engagement
- Generates contextual greeting messages for new leads
- Creates tour confirmation reminders when tours are scheduled but unconfirmed
- Priority scoring: High (overdue + stale), Medium (stale), Low (new leads)
- One-click "Send All Pending" for batch task execution
- Send log tracking with timestamps
- Message template library per funnel stage

**Trigger logic:**
| Trigger | Task Type | Priority |
|---------|-----------|----------|
| Overdue next action | Auto-followup | High |
| Stale lead (5+ days) | WhatsApp | High |
| Stale lead (2-4 days) | WhatsApp | Medium |
| Unconfirmed tour | WhatsApp | High |
| New shadow lead | Status update | Low |

---

### Feature 2: Lead Scoring & Analytics (`/analytics`)

**What it does:** Scores every lead 0-100 using a multi-signal algorithm and classifies into Hot/Warm/Cold/Dead tiers.

**Scoring algorithm:**
```
Score = Budget(0-20) + MoveInDate(0-25) + Stage(0-20)
      + Engagement(0-15) + GoodLead(0-10) + Prebook(0-10)
      - LossPenalty(0-30)
```

**Signal breakdown:**
| Signal | Max Points | Logic |
|--------|------------|-------|
| Budget | 20 | ₹15K+ = 20, ₹10K+ = 15, ₹7K+ = 10, else 5 |
| Move-in Date | 25 | ≤3d = 25, ≤7d = 20, ≤14d = 15, ≤30d = 10, else 5 |
| Funnel Stage | 20 | Payment/Booked = 20, Quote = 16, Post-tour = 14, Tour scheduled = 12, Matched = 10, Qualified = 6, New = 2 |
| Engagement | 15 | Unread msgs = 5, Recent reply = 5, Full identity = 5 |
| Good Lead Flag | 10 | System-flagged = +10 |
| Prebook Pipeline | 10 | Paid = 10, Payment intent = 8, Interested = 6, Pitched = 4, Eligible = 2 |
| Loss Penalty | -30 | Lost lead = -30, Loss reason = -10 |

**Tier classification:**
| Tier | Score Range | Action |
|------|-------------|--------|
| Hot | 75-100 | Immediate closing focus |
| Warm | 50-74 | Active nurturing |
| Cold | 25-49 | Re-engagement campaign |
| Dead | 0-24 | Archive or revival |

**Dashboard features:**
- Per-lead scoring with signal breakdown
- Conversion probability calculation
- Pipeline value estimation (annual revenue potential)
- Funnel stage distribution chart
- Top conversion signals panel
- Risk signals panel
- Sort by score / revenue / probability
- Filter by tier

---

## Files Created/Modified

```
src/routes/nurturing.tsx                          — New route
src/routes/analytics.tsx                          — New route
src/components/nurturing/LeadNurturingDashboard.tsx — Nurturing UI (390 lines)
src/components/analytics/LeadAnalyticsDashboard.tsx — Analytics UI (380 lines)
src/components/AppShell.tsx                       — Added nav items (all 4 roles)
src/routeTree.gen.ts                              — Auto-generated route tree
```

## Tech Stack

- React 19 + TanStack Router
- Zustand (state management)
- Supabase (backend)
- Tailwind CSS + Radix UI
- Vite + TypeScript
