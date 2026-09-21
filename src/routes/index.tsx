import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Rocket, Compass, ShieldCheck, Target, Bot, BarChart3,
  ArrowRight, Flame, TrendingUp, Zap, Users, Star,
  CheckCircle2, GitBranch, Layers, Database, Activity,
  MessageSquare, Clock, IndianRupee, Calendar, Sparkles,
  Play, ChevronRight, Code, Globe,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gharpayy CRM — Assignment Submission" },
      { name: "description", content: "Lead Management CRM with 3 activated modules and 2 new growth features." },
      { property: "og:title", content: "Gharpayy CRM — Assignment Submission" },
    ],
  }),
  component: IndexPage,
});

const MODULES = [
  {
    route: "/movement",
    icon: Compass,
    name: "Movement OS",
    tagline: "One journey, six truths",
    description: "Full customer journey from draft to booking with priority engine, live locks, and append-only event log.",
    color: "from-blue-500 to-cyan-400",
    stats: ["P0-P6 Priority", "Live Locks", "Batch Draft"],
  },
  {
    route: "/admin",
    icon: ShieldCheck,
    name: "Admin Control",
    tagline: "The whole company in one view",
    description: "Zone league, funnel grid, people desk, checkpoints, war room, and SLA analytics for founders.",
    color: "from-purple-500 to-pink-400",
    stats: ["Zone League", "Funnel Grid", "People Desk"],
  },
  {
    route: "/closing",
    icon: Target,
    name: "Closing Desk",
    tagline: "Every promise tracked",
    description: "Promise tracking board with kept/broken accuracy, at-risk triage, and closing candidate suggestions.",
    color: "from-orange-500 to-red-400",
    stats: ["Promise Accuracy", "At-Risk Triage", "Board Digest"],
  },
];

const NEW_FEATURES = [
  {
    route: "/nurturing",
    icon: Bot,
    name: "Lead Nurturing",
    tagline: "Never miss a follow-up",
    description: "Auto-generates follow-up tasks and simulated WhatsApp messages when leads change status.",
    color: "from-emerald-500 to-teal-400",
    badge: "NEW",
    highlights: [
      { icon: Zap, text: "Smart trigger detection" },
      { icon: MessageSquare, text: "8 stage-aware templates" },
      { icon: Users, text: "Priority scoring" },
    ],
  },
  {
    route: "/analytics",
    icon: BarChart3,
    name: "Lead Analytics",
    tagline: "Score every lead 0-100",
    description: "Multi-signal scoring algorithm with 4-tier classification and conversion probability.",
    color: "from-violet-500 to-indigo-400",
    badge: "NEW",
    highlights: [
      { icon: Flame, text: "7 scoring dimensions" },
      { icon: TrendingUp, text: "Conversion probability" },
      { icon: IndianRupee, text: "Pipeline value estimation" },
    ],
  },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-blue-500/5 to-emerald-500/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-violet-500/10 to-transparent rounded-full blur-3xl" />
      <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 backdrop-blur px-4 py-1.5 text-xs mb-6">
          <Globe className="h-3 w-3 text-violet-500" />
          <span className="text-muted-foreground">Assignment Submission</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
          <span className="text-muted-foreground">Gharpayy</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
          Lead Management
          <br />
          <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
            CRM Rebuilt
          </span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-lg">
          3 modules activated end-to-end. 2 new growth features built from scratch.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: Layers, label: "3 Modules" },
            { icon: Sparkles, label: "2 New Features" },
            { icon: Code, label: "770+ Lines" },
            { icon: CheckCircle2, label: "Build Passing" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 rounded-full border bg-card/80 backdrop-blur px-4 py-2 text-xs font-medium">
              <s.icon className="h-3.5 w-3.5 text-violet-500" />
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModuleCard({ module, featured = false }: { module: typeof MODULES[0]; featured?: boolean }) {
  return (
    <Link to={module.route}>
      <div className={`group relative rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden ${featured ? "md:col-span-2" : ""}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg`}>
              <module.icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              Open <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-1">{module.name}</h3>
          <p className="text-xs text-muted-foreground mb-3 italic">{module.tagline}</p>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{module.description}</p>
          <div className="flex flex-wrap gap-2">
            {module.stats.map((s) => (
              <span key={s} className="text-[10px] bg-muted rounded-full px-2.5 py-1 font-medium">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({ feature }: { feature: typeof NEW_FEATURES[0] }) {
  return (
    <Link to={feature.route}>
      <div className="group relative rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
              <feature.icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2 py-0.5">{feature.badge}</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                Open <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
          <h3 className="text-lg font-bold mb-1">{feature.name}</h3>
          <p className="text-xs text-muted-foreground mb-3 italic">{feature.tagline}</p>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{feature.description}</p>
          <div className="space-y-2">
            {feature.highlights.map((h) => (
              <div key={h.text} className="flex items-center gap-2 text-xs">
                <h.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{h.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ScoringPreview() {
  const signals = [
    { name: "Budget", pts: "0-20", w: "80%", color: "bg-emerald-500" },
    { name: "Move-in Date", pts: "0-25", w: "100%", color: "bg-blue-500" },
    { name: "Funnel Stage", pts: "0-20", w: "80%", color: "bg-violet-500" },
    { name: "Engagement", pts: "0-15", w: "60%", color: "bg-orange-500" },
    { name: "Good Lead", pts: "+10", w: "40%", color: "bg-red-500" },
    { name: "Prebook", pts: "0-10", w: "40%", color: "bg-pink-500" },
  ];

  return (
    <Link to="/analytics">
      <div className="group relative rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">Scoring Algorithm</h3>
                <p className="text-[10px] text-muted-foreground">Lead Analytics /analytics</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="space-y-2.5">
            {signals.map((s) => (
              <div key={s.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground">{s.pts} pts</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full`} style={{ width: s.w }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Tiers: Hot (75+) · Warm (50+) · Cold (25+) · Dead</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function NurturingPreview() {
  const triggers = [
    { label: "Overdue action", priority: "High", color: "bg-red-500" },
    { label: "Stale lead (5+ days)", priority: "High", color: "bg-red-500" },
    { label: "Unconfirmed tour", priority: "High", color: "bg-red-500" },
    { label: "Stale lead (2-4 days)", priority: "Med", color: "bg-orange-500" },
    { label: "New shadow lead", priority: "Low", color: "bg-blue-500" },
  ];

  return (
    <Link to="/nurturing">
      <div className="group relative rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">Nurture Engine</h3>
                <p className="text-[10px] text-muted-foreground">Lead Nurturing /nurturing</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="space-y-1.5">
            {triggers.map((t) => (
              <div key={t.label} className="flex items-center gap-2 text-xs py-1">
                <div className={`w-1.5 h-1.5 rounded-full ${t.color}`} />
                <span className="flex-1">{t.label}</span>
                <span className="text-[10px] text-muted-foreground">{t.priority}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs">
            <span className="text-muted-foreground">8 templates · Priority scoring · Batch send</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      {/* Existing Modules */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Layers className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">3 Activated Modules</h2>
            <p className="text-xs text-muted-foreground">Backend-connected with full data flow</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MODULES.map((m) => (
            <ModuleCard key={m.route} module={m} />
          ))}
        </div>
      </section>

      {/* New Features */}
      <section className="max-w-6xl mx-auto px-4 py-12 border-t">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">2 New Growth Features</h2>
            <p className="text-xs text-muted-foreground">Designed and built from scratch</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {NEW_FEATURES.map((f) => (
            <FeatureCard key={f.route} feature={f} />
          ))}
        </div>
      </section>

      {/* Deep Dives */}
      <section className="max-w-6xl mx-auto px-4 py-12 border-t">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <Activity className="h-4 w-4 text-violet-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Under the Hood</h2>
            <p className="text-xs text-muted-foreground">Algorithm and engine previews</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ScoringPreview />
          <NurturingPreview />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitBranch className="h-4 w-4" />
            <a href="https://github.com/DharshanSP/a3x-gg" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              github.com/DharshanSP/a3x-gg
            </a>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>React 19</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <span>TanStack Router</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <span>Zustand</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <span>Supabase</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
