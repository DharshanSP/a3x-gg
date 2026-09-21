import { Link } from "@tanstack/react-router";
import {
  Rocket, Target, BarChart3, Bot, Compass, ShieldCheck, CheckCircle2,
  ArrowRight, Flame, Users, TrendingUp, Zap, MessageSquare, Clock,
  Star, IndianRupee, Calendar, AlertTriangle, Sparkles, Play,
  GitBranch, Code, Layers, Database, Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATS = [
  { label: "Modules Activated", value: "3", icon: Layers, color: "text-blue-600" },
  { label: "New Features", value: "2", icon: Sparkles, color: "text-violet-600" },
  { label: "Lines of Code", value: "770+", icon: Code, color: "text-emerald-600" },
  { label: "Build Status", value: "PASS", icon: CheckCircle2, color: "text-green-600" },
];

const MODULES = [
  {
    icon: Compass,
    name: "Movement OS",
    route: "/movement",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    description: "Full customer journey: draft → priority → live work → handoff → outcome",
    features: [
      "6-dimension customer state tracking",
      "Priority engine (P0-P6) with auto-classification",
      "Live work locks with TTL conflict prevention",
      "Batch drafting for bulk operations",
      "Checkpoint system (1PM / 5PM / EOD)",
      "Append-only event log for full audit trail",
    ],
    backend: "Zustand store synced via bridge.ts → Supabase",
  },
  {
    icon: ShieldCheck,
    name: "Admin Control",
    route: "/admin",
    color: "from-purple-500 to-pink-500",
    bg: "bg-purple-50",
    border: "border-purple-200",
    description: "Founder/Zone Manager command center with full company visibility",
    features: [
      "Zone League with per-zone performance metrics",
      "Company Funnel Grid with conversion rates",
      "People Desk with grade/score/calls/bookings",
      "Checkpoints: done / late / missed tracking",
      "Recovery War Room for lost revenue",
      "Comparison period for delta tracking",
    ],
    backend: "useAdminFocus() aggregates live CRM snapshot",
  },
  {
    icon: Target,
    name: "Closing Desk",
    route: "/closing",
    color: "from-orange-500 to-red-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    description: "Promise tracking board — every commitment tracked to resolution",
    features: [
      "Kept / Broken promise accuracy per person",
      "At-risk triage with top 6 flagged commitments",
      "Time-bucketed groups (overdue / next 3h / later)",
      "Broken-promise reason breakdown",
      "Closing Candidates auto-suggestion",
      "Board digest export to clipboard",
    ],
    backend: "useCommitments() local store with full CRUD",
  },
];

const FEATURES = [
  {
    icon: Bot,
    name: "Automated Lead Nurturing",
    route: "/nurturing",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "NEW",
    description: "Never miss a follow-up. Auto-generated tasks + simulated WhatsApp/SMS when leads change status.",
    highlights: [
      {
        title: "Smart Trigger Detection",
        items: [
          "Overdue next actions → urgent follow-up",
          "Stale leads (2+ days) → re-engagement",
          "New shadow leads → auto-greeting",
          "Unconfirmed tours → confirmation reminder",
        ],
      },
      {
        title: "Message Templates",
        items: [
          "8 context-aware templates per funnel stage",
          "Priority scoring: High / Medium / Low",
          "Batch send with one click",
          "Full send log with timestamps",
        ],
      },
      {
        title: "Dashboard UI",
        items: [
          "Stats cards: Pending / Sent / High Priority",
          "Filter by status and message type",
          "Task cards with lead info + message preview",
          "Message template library browser",
        ],
      },
    ],
    metrics: [
      { label: "Auto-tasks generated", value: "Per lead" },
      { label: "Message templates", value: "8 stages" },
      { label: "Trigger conditions", value: "4 types" },
      { label: "Priority levels", value: "3 tiers" },
    ],
  },
  {
    icon: BarChart3,
    name: "Lead Scoring & Analytics",
    route: "/analytics",
    color: "from-violet-500 to-indigo-500",
    bg: "bg-violet-50",
    border: "border-violet-200",
    badge: "NEW",
    description: "Score every lead 0-100. Identify hot leads instantly with multi-signal algorithm.",
    highlights: [
      {
        title: "Scoring Algorithm (0-100)",
        items: [
          "Budget: 0-20 pts (₹15K+ = max)",
          "Move-in Date: 0-25 pts (≤3d = max)",
          "Funnel Stage: 0-20 pts (Payment = max)",
          "Engagement: 0-15 pts (recent reply = max)",
          "Good Lead Flag: +10 bonus",
          "Prebook Pipeline: 0-10 pts",
          "Loss Penalty: -30 max",
        ],
      },
      {
        title: "Tier Classification",
        items: [
          "Hot (75+): Immediate closing focus",
          "Warm (50-74): Active nurturing",
          "Cold (25-49): Re-engagement needed",
          "Dead (0-24): Archive or revive",
        ],
      },
      {
        title: "Analytics Dashboard",
        items: [
          "Per-lead score with signal breakdown",
          "Conversion probability calculation",
          "Pipeline value estimation (annual ₹)",
          "Funnel stage distribution chart",
          "Top conversion + risk signal panels",
          "Sort by score / revenue / probability",
        ],
      },
    ],
    metrics: [
      { label: "Scoring signals", value: "7 dimensions" },
      { label: "Max score", value: "100 pts" },
      { label: "Tier levels", value: "4 tiers" },
      { label: "Revenue est.", value: "Annual ₹" },
    ],
  },
];

const TECH_STACK = [
  { name: "React 19", icon: Code, color: "text-cyan-500" },
  { name: "TanStack Router", icon: GitBranch, color: "text-blue-500" },
  { name: "Zustand", icon: Database, color: "text-yellow-500" },
  { name: "Supabase", icon: Layers, color: "text-green-500" },
  { name: "Tailwind CSS", icon: Sparkles, color: "text-teal-500" },
  { name: "Vite", icon: Zap, color: "text-purple-500" },
];

function ScoreBreakdown() {
  const signals = [
    { name: "Budget", max: 20, color: "bg-emerald-500", detail: "₹15K+ = 20 · ₹10K+ = 15 · ₹7K+ = 10" },
    { name: "Move-in Date", max: 25, color: "bg-blue-500", detail: "≤3d = 25 · ≤7d = 20 · ≤14d = 15 · ≤30d = 10" },
    { name: "Funnel Stage", max: 20, color: "bg-violet-500", detail: "Payment = 20 · Quote = 16 · Tour = 14 · Matched = 10" },
    { name: "Engagement", max: 15, color: "bg-orange-500", detail: "Unread = 5 · Reply <1h = 5 · Full ID = 5" },
    { name: "Good Lead", max: 10, color: "bg-red-500", detail: "System flag = +10" },
    { name: "Prebook", max: 10, color: "bg-pink-500", detail: "Paid = 10 · Intent = 8 · Interested = 6" },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white p-4">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Scoring Algorithm Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {signals.map((s) => (
          <div key={s.name} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{s.name}</span>
              <span className="text-muted-foreground">0-{s.max} pts</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${s.color} rounded-full`} style={{ width: `${(s.max / 25) * 100}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground">{s.detail}</p>
          </div>
        ))}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs font-medium">
            <span>Loss Penalty</span>
            <span className="text-red-500">-30 pts max</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Lost lead = -30 · Loss reason = -10</p>
        </div>
      </CardContent>
    </Card>
  );
}

function NurturingFlow() {
  const triggers = [
    { icon: AlertTriangle, label: "Overdue Action", task: "Auto-followup", priority: "High", color: "text-red-500" },
    { icon: Clock, label: "Stale Lead (5+ days)", task: "Re-engagement", priority: "High", color: "text-red-500" },
    { icon: Clock, label: "Stale Lead (2-4 days)", task: "Check-in", priority: "Medium", color: "text-orange-500" },
    { icon: Calendar, label: "Unconfirmed Tour", task: "Confirmation", priority: "High", color: "text-red-500" },
    { icon: Users, label: "New Shadow Lead", task: "Greeting", priority: "Low", color: "text-blue-500" },
  ];

  const templates = [
    { stage: "New", msg: "Thanks for your interest! How can we help?" },
    { stage: "Qualified", msg: "You've been matched with amazing options." },
    { stage: "Tour Scheduled", msg: "Your visit is confirmed. See you soon!" },
    { stage: "Tour Done", msg: "Thanks for visiting! We'd love your feedback." },
    { stage: "Quotation", msg: "Here's your personalized quote." },
    { stage: "Payment", msg: "Your payment is pending. Complete now!" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-500" />
            Auto-Trigger Logic
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          {triggers.map((t) => (
            <div key={t.label} className="flex items-center gap-3 text-xs py-2 border-b last:border-0">
              <t.icon className={`h-4 w-4 ${t.color} shrink-0`} />
              <div className="flex-1">
                <div className="font-medium">{t.label}</div>
                <div className="text-muted-foreground">→ {t.task}</div>
              </div>
              <Badge variant={t.priority === "High" ? "destructive" : t.priority === "Medium" ? "default" : "secondary"} className="text-[10px]">
                {t.priority}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-emerald-500" />
            Message Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          {templates.map((t) => (
            <div key={t.stage} className="text-xs py-2 border-b last:border-0">
              <div className="font-medium text-emerald-600 mb-0.5">{t.stage}</div>
              <div className="text-muted-foreground bg-muted/50 rounded p-2 font-mono text-[11px]">
                "{t.msg}"
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function ShowcasePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-blue-500/5 to-emerald-500/5" />
        <div className="relative max-w-5xl mx-auto px-4 py-16 text-center">
          <Badge variant="outline" className="mb-4 text-xs">
            <GitBranch className="h-3 w-3 mr-1" /> Assignment Submission
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Gharpayy CRM
            <span className="bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text text-transparent"> Improvements</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            3 modules activated with full backend data flow. 2 new growth features built from scratch.
            770+ lines of production-ready code.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
            {STATS.map((s) => (
              <Card key={s.label} className="text-center">
                <CardContent className="p-3">
                  <s.icon className={`h-5 w-5 ${s.color} mx-auto mb-1`} />
                  <div className="text-xl font-bold">{s.value}</div>
                  <div className="text-[10px] text-muted-foreground">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <Link to="/movement">
              <Button size="sm">
                <Play className="h-3 w-3 mr-1" /> View Live Modules
              </Button>
            </Link>
            <a href="https://github.com/DharshanSP/a3x-gg" target="_blank" rel="noreferrer">
              <Button size="sm" variant="outline">
                <GitBranch className="h-3 w-3 mr-1" /> View Code
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-2 text-xs">PART 1</Badge>
          <h2 className="text-2xl font-bold">3 Activated Modules</h2>
          <p className="text-sm text-muted-foreground mt-1">Existing modules with full backend data flow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MODULES.map((m) => (
            <Card key={m.name} className={`${m.border} hover:shadow-lg transition-all group`}>
              <CardHeader className={`${m.bg} p-4`}>
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                    <m.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{m.name}</CardTitle>
                    <Link to={m.route} className="text-[10px] text-primary hover:underline flex items-center gap-1">
                      {m.route} <ArrowRight className="h-2.5 w-2.5" />
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground">{m.description}</p>
                <ul className="space-y-1">
                  {m.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-[11px]">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t">
                  <p className="text-[10px] text-muted-foreground">
                    <Database className="h-2.5 w-2.5 inline mr-1" />
                    {m.backend}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* New Features */}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t">
        <div className="text-center mb-8">
          <Badge variant="default" className="mb-2 text-xs bg-violet-600">NEW FEATURES</Badge>
          <h2 className="text-2xl font-bold">2 Growth Features Built</h2>
          <p className="text-sm text-muted-foreground mt-1">Designed and implemented from scratch</p>
        </div>

        {/* Feature 1 */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Automated Lead Nurturing</h3>
              <Link to="/nurturing" className="text-xs text-primary hover:underline flex items-center gap-1">
                /nurturing <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <Badge variant="default" className="ml-auto bg-emerald-600">NEW</Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
            Never miss a follow-up. The system auto-generates tasks and sends simulated WhatsApp/SMS messages
            when leads move through the funnel. Context-aware templates, priority scoring, and batch execution.
          </p>

          <NurturingFlow />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {FEATURES[0].metrics.map((m) => (
              <Card key={m.label}>
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold text-emerald-600">{m.value}</div>
                  <div className="text-[10px] text-muted-foreground">{m.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature 2 */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Lead Scoring & Analytics</h3>
              <Link to="/analytics" className="text-xs text-primary hover:underline flex items-center gap-1">
                /analytics <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <Badge variant="default" className="ml-auto bg-violet-600">NEW</Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
            Score every lead 0-100 using a multi-signal algorithm. 7 dimensions evaluated including budget,
            move-in urgency, funnel stage, engagement, and prebook pipeline. 4-tier classification for instant prioritization.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScoreBreakdown />

            <div className="space-y-4">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Flame className="h-4 w-4 text-red-500" />
                    Tier Classification
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  {[
                    { tier: "Hot", range: "75-100", action: "Immediate closing focus", color: "bg-red-500", text: "text-red-600" },
                    { tier: "Warm", range: "50-74", action: "Active nurturing", color: "bg-orange-500", text: "text-orange-600" },
                    { tier: "Cold", range: "25-49", action: "Re-engagement needed", color: "bg-blue-500", text: "text-blue-600" },
                    { tier: "Dead", range: "0-24", action: "Archive or revive", color: "bg-gray-400", text: "text-gray-500" },
                  ].map((t) => (
                    <div key={t.tier} className="flex items-center gap-3 text-xs py-1.5">
                      <div className={`w-3 h-3 rounded-full ${t.color}`} />
                      <span className={`font-medium ${t.text} w-12`}>{t.tier}</span>
                      <span className="text-muted-foreground w-16">{t.range}</span>
                      <span className="flex-1">{t.action}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-violet-500" />
                    Conversion Formula
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xs bg-muted/50 rounded p-3 font-mono space-y-1">
                    <div>probability = min(95, max(5,</div>
                    <div className="pl-4">score × 0.9</div>
                    <div className="pl-4">+ (goodLead ? 10 : 0)</div>
                    <div>))</div>
                  </div>
                  <div className="mt-2 text-[10px] text-muted-foreground">
                    Hot lead + good flag → 95% · Warm → 55-65% · Cold → 25-40%
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {FEATURES[1].metrics.map((m) => (
              <Card key={m.label}>
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold text-violet-600">{m.value}</div>
                  <div className="text-[10px] text-muted-foreground">{m.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold">Tech Stack</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {TECH_STACK.map((t) => (
            <div key={t.name} className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2">
              <t.icon className={`h-4 w-4 ${t.color}`} />
              <span className="text-xs font-medium">{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Live Links */}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t">
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Explore Live</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { to: "/movement", label: "Movement OS", icon: Compass },
              { to: "/admin", label: "Admin Control", icon: ShieldCheck },
              { to: "/closing", label: "Closing Desk", icon: Target },
              { to: "/nurturing", label: "Lead Nurturing", icon: Bot },
              { to: "/analytics", label: "Lead Analytics", icon: BarChart3 },
            ].map((l) => (
              <Link key={l.to} to={l.to}>
                <Button variant="outline" size="sm" className="gap-2">
                  <l.icon className="h-3.5 w-3.5" />
                  {l.label}
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
