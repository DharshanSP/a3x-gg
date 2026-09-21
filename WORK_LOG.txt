============================================================
GHARPayy LEAD MANAGEMENT CRM — ASSIGNMENT WORK LOG
============================================================
Candidate: Dharshan SP
Date: 21 September 2026
GitHub: https://github.com/DharshanSP/a3x-gg
============================================================

OVERVIEW
--------
This document explains the work done on the Gharpayy Lead Management CRM MVP
assignment. The task was to:
  1. Clone and understand the existing codebase
  2. Activate 3 existing modules with working backend data flow
  3. Build 2 new growth features
  4. Deploy the application

============================================================
PART 1: CODEBASE EXPLORATION
============================================================

The repository uses:
  - React 19 + TanStack Router (file-based routing)
  - Zustand for state management (multiple stores)
  - Supabase as the backend database (~40 tables)
  - Tailwind CSS + Radix UI for components
  - Vite as the build tool

Key stores identified:
  - useMovement() — Customer journey state (672 lines)
  - useCommitments() — Promise tracking for Closing Board
  - useAdminFocus() — Zone/person analytics aggregation
  - useIdentityStore() — Lead identity management
  - useWa() — WhatsApp conversation state

Data flow: Components read from local Zustand stores, which sync
with Supabase via the movement bridge (bridge.ts) and identity store.

============================================================
PART 2: 3 ACTIVATED MODULES
============================================================

MODULE 1: MOVEMENT OS (/movement)
----------------------------------
Route: src/routes/movement.tsx
Component: src/movement/MovementOS.tsx
Store: src/movement/store.ts (672 lines)

What it does:
  - Tracks every customer through a 6-dimension journey
  - Draft system: D1 (Immediate), D2 (Active), D3 (Future), D4 (Cold)
  - Priority engine: P0-P6 buckets with automatic classification
  - Live work locks with TTL to prevent conflicts
  - Next action scheduling with owner assignment
  - Handoff system between teams (flow-ops, tcm, closing, ops)
  - Batch drafting for bulk operations
  - Checkpoint system (1PM, 5PM, EOD) with target tracking

Backend connection:
  - useMovementSync() bridge syncs lead identity + WhatsApp unread counts
  - Each action writes exactly one append-only event
  - Dashboards read from events for real-time metrics


MODULE 2: ADMIN MOVEMENT CONTROL (/admin)
------------------------------------------
Route: src/routes/admin.tsx
Component: src/routes/admin.index.tsx (552 lines)

What it does:
  - Zone-centric command view for founders
  - Zone League: each zone shows bookings, calls, tours, quotes, stuck
  - Result Strip: headline funnel numbers with drill-down
  - Moments: handover conversion metrics
  - Zero Output / Ghosts / Stars: people performance tracking
  - Recovery War Room: recoverable bookings and revenue
  - Company Funnel Grid: stage-by-stage with conversion rates
  - Checkpoints: done/late/missed person counts
  - People Desk: full performance table
  - Live Feed: real-time events

Backend connection:
  - useAdminFocus() aggregates all CRM data
  - Comparison period support for delta tracking
  - Zone filtering cascades to all views


MODULE 3: CLOSING DESK (/closing)
-----------------------------------
Route: src/routes/closing.tsx
Component: src/components/commitments/ClosingBoard.tsx (483 lines)

What it does:
  - Tracks every promise made to customers
  - Promise states: pending, kept, broken, re-promised
  - At-risk triage: top 6 commitments at risk of breaking
  - Board KPIs: today count, expired, open, kept, broken, accuracy %
  - Reliability by person: per-person accuracy stats
  - Problem breakdown: why promises broke
  - Time-bucketed groups: overdue, next 3h, later today
  - Closing Candidates: suggests who to promise next

Backend connection:
  - useCommitments() local store drives all data
  - Closing candidates pull from useBookingFlow() for post-tour leads
  - Board digest copies today's list to clipboard

============================================================
PART 3: 2 NEW GROWTH FEATURES
============================================================

FEATURE 1: AUTOMATED LEAD NURTURING (/nurturing)
--------------------------------------------------
File: src/components/nurturing/LeadNurturingDashboard.tsx

PURPOSE:
  Never miss a follow-up. The system auto-generates tasks and sends
  simulated WhatsApp/SMS messages when leads move through the funnel.

HOW IT WORKS:
  1. On mount, generateNurturingTasks() scans all leads in the movement store
  2. For each lead, it checks multiple conditions:
     - Is there an overdue next action? → Create urgent follow-up task
     - Has it been 2+ days since last update? → Create re-engagement task
     - Is it a new shadow lead? → Create greeting task
     - Is a tour scheduled but unconfirmed? → Create confirmation task
  3. Tasks are priority-sorted (high → medium → low)
  4. User can send individual tasks or batch-send all pending
  5. Each send is logged with timestamp, lead name, and message type

MESSAGE TEMPLATES (per stage):
  - new: "Thanks for your interest in Gharpayy! How can we help?"
  - qualified: "Great news! You've been matched with amazing options."
  - matched: "We've curated some PG options just for you."
  - tour-scheduled: "Your PG visit is confirmed. See you soon!"
  - tour-done: "Thanks for visiting! We'd love your feedback."
  - quotation: "Here's your personalized quote."
  - payment: "Your payment is pending. Complete it now!"
  - booked: "Congratulations! Your booking is confirmed."

UI COMPONENTS:
  - Stats cards: Pending, Sent, High Priority, Total
  - Filter bar: by status (all/pending/sent/failed) and type
  - Task cards: lead name, priority badge, type badge, message preview, send button
  - Send log: timestamped history of all sent messages
  - Templates tab: view all auto-generated message templates


FEATURE 2: LEAD SCORING & ANALYTICS (/analytics)
--------------------------------------------------
File: src/components/analytics/LeadAnalyticsDashboard.tsx

PURPOSE:
  Identify the hottest leads instantly. Score based on qualification,
  engagement, and conversion signals.

SCORING ALGORITHM (0-100):
  The algorithm evaluates 6 dimensions:

  1. BUDGET (0-20 points)
     - ₹15,000+ → 20 pts (High budget signal)
     - ₹10,000-14,999 → 15 pts (Good budget)
     - ₹7,000-9,999 → 10 pts (Moderate budget)
     - Below ₹7,000 → 5 pts (Low budget)

  2. MOVE-IN DATE URGENCY (0-25 points)
     - Within 3 days → 25 pts (Immediate need)
     - Within 7 days → 20 pts (Urgent)
     - Within 14 days → 15 pts (Soon)
     - Within 30 days → 10 pts (Planning)
     - Beyond 30 days → 5 pts (Future)

  3. FUNNEL STAGE (0-20 points)
     - Payment/Booked → 20 pts (Closing)
     - Quotation/Negotiation → 16 pts (Decision time)
     - Tour Done → 14 pts (Post-tour)
     - Tour Scheduled → 12 pts ( committed)
     - Matched → 10 pts (Options shared)
     - Qualified → 6 pts (Scored)
     - New → 2 pts (Fresh)

  4. ENGAGEMENT (0-15 points)
     - Unread messages → 5 pts (Customer waiting)
     - Replied < 1h ago → 5 pts (Active conversation)
     - Full identity → 5 pts (Fully qualified)

  5. GOOD LEAD FLAG (+10 bonus)
     - System-flagged good lead → +10 pts

  6. PREBOOK PIPELINE (0-10 points)
     - Paid → 10 pts
     - Payment intent → 8 pts
     - Interested → 6 pts
     - Pitched → 4 pts
     - Eligible → 2 pts

  7. LOSS DEDUCTIONS (-30 max)
     - Lost lead → -30 pts
     - Loss reason documented → -10 pts

TIER CLASSIFICATION:
  Hot:   75-100 points → Immediate closing focus
  Warm:  50-74 points  → Active nurturing
  Cold:  25-49 points  → Re-engagement campaign
  Dead:  0-24 points   → Archive or revival

CONVERSION PROBABILITY:
  formula: min(95, max(5, score * 0.9 + (goodLead ? 10 : 0)))
  - A hot lead with good lead flag: ~95% probability
  - A warm lead: ~55-65% probability
  - A cold lead: ~25-40% probability

PIPELINE VALUE:
  Estimated annual revenue = monthly budget * 12
  Used for prioritization and forecasting.

UI COMPONENTS:
  - Stats cards: Hot Leads, Warm Leads, Avg Score, Pipeline Value
  - Scored Leads tab: per-lead cards with score, tier, signals, progress bar
  - Funnel Analysis tab: stage distribution bar chart
  - Insights tab: top conversion signals, risk signals, algorithm breakdown
  - Sort by: score / revenue / probability
  - Filter by: tier (Hot/Warm/Cold/Dead)

============================================================
PART 4: NAVIGATION INTEGRATION
============================================================

Added nav items to AppShell.tsx for all 4 roles:

  HR role:
    - Lead Nurturing (Bot icon)
    - Lead Analytics (BarChart3 icon)

  Flow-Ops role:
    - Lead Nurturing (Bot icon)
    - Lead Analytics (BarChart3 icon)

  TCM role:
    - Lead Nurturing (Bot icon)
    - Lead Analytics (BarChart3 icon)

  Owner role:
    - Lead Nurturing (Bot icon)
    - Lead Analytics (BarChart3 icon)

Both features appear in the sidebar navigation with accent styling
for visibility.

============================================================
PART 5: BUILD & DEPLOYMENT
============================================================

Build command: npx vite build
Build time: ~12 seconds
Build status: SUCCESS

Deployment steps:
  1. npx vercel login (first time only)
  2. npx vercel --prod
  3. Or connect GitHub repo at vercel.com/new

============================================================
SUMMARY
============================================================

Modules activated: 3
  - Movement OS (/movement)
  - Admin Movement Control (/admin)
  - Closing Desk (/closing)

New features built: 2
  - Automated Lead Nurturing (/nurturing)
  - Lead Scoring & Analytics (/analytics)

Files created: 4 new files
Files modified: 2 existing files

Total lines of new code: ~770 lines
Build status: PASS
Deployment: Ready

============================================================
