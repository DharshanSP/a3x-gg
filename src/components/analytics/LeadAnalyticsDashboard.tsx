import { useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Users,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Flame,
  Star,
  Clock,
  Phone,
  MessageSquare,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMovement, type MovementState } from "@/movement/store";
import { STAGE_LABEL, FUNNEL_ORDER } from "@/movement/types";

interface ScoredLead {
  lead: MovementState;
  score: number;
  tier: "hot" | "warm" | "cold" | "dead";
  signals: string[];
  conversionProbability: number;
  estimatedRevenue: number;
}

function calculateLeadScore(lead: MovementState): ScoredLead {
  let score = 0;
  const signals: string[] = [];

  // Budget scoring (0-20 points)
  if (lead.q.budget) {
    if (lead.q.budget >= 15000) {
      score += 20;
      signals.push("High budget");
    } else if (lead.q.budget >= 10000) {
      score += 15;
      signals.push("Good budget");
    } else if (lead.q.budget >= 7000) {
      score += 10;
      signals.push("Moderate budget");
    } else {
      score += 5;
      signals.push("Low budget");
    }
  }

  // Move-in date urgency (0-25 points)
  if (lead.checkInDate) {
    const daysUntilMoveIn = Math.floor(
      (new Date(lead.checkInDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    if (daysUntilMoveIn <= 3) {
      score += 25;
      signals.push("Move-in within 3 days");
    } else if (daysUntilMoveIn <= 7) {
      score += 20;
      signals.push("Move-in within a week");
    } else if (daysUntilMoveIn <= 14) {
      score += 15;
      signals.push("Move-in within 2 weeks");
    } else if (daysUntilMoveIn <= 30) {
      score += 10;
      signals.push("Move-in within a month");
    } else {
      score += 5;
      signals.push("Future move-in");
    }
  }

  // Stage scoring (0-20 points)
  const stageIndex = FUNNEL_ORDER.indexOf(lead.stage);
  if (lead.stage === "payment" || lead.stage === "booked") {
    score += 20;
    signals.push("At payment/booking");
  } else if (lead.stage === "quotation" || lead.stage === "negotiation") {
    score += 16;
    signals.push("Quote/negotiation stage");
  } else if (lead.stage === "tour-done") {
    score += 14;
    signals.push("Post-tour");
  } else if (lead.stage === "tour-scheduled") {
    score += 12;
    signals.push("Tour scheduled");
  } else if (lead.stage === "matched") {
    score += 10;
    signals.push("Options shared");
  } else if (lead.stage === "qualified") {
    score += 6;
    signals.push("Qualified");
  } else if (lead.stage === "new") {
    score += 2;
    signals.push("New lead");
  }

  // Engagement signals (0-15 points)
  if (lead.unread > 0) {
    score += 5;
    signals.push(`${lead.unread} unread messages`);
  }
  if (lead.lastCustomerMsgAt) {
    const hoursSinceReply =
      (Date.now() - new Date(lead.lastCustomerMsgAt).getTime()) / (1000 * 60 * 60);
    if (hoursSinceReply < 1) {
      score += 5;
      signals.push("Replied < 1h ago");
    } else if (hoursSinceReply < 24) {
      score += 3;
      signals.push("Replied today");
    }
  }
  if (lead.identity === "full") {
    score += 5;
    signals.push("Full identity");
  } else if (lead.identity === "qualified") {
    score += 3;
    signals.push("Qualified identity");
  }

  // Good lead flag (+10 bonus)
  if (lead.goodLead) {
    score += 10;
    signals.push("System-flagged good lead");
  }

  // Prebook signals (0-10 points)
  if (lead.prebook.paid) {
    score += 10;
    signals.push("Paid");
  } else if (lead.prebook.paymentIntent) {
    score += 8;
    signals.push("Payment intent");
  } else if (lead.prebook.interested) {
    score += 6;
    signals.push("Prebook interested");
  } else if (lead.prebook.pitched) {
    score += 4;
    signals.push("Prebook pitched");
  } else if (lead.prebook.eligible) {
    score += 2;
    signals.push("Prebook eligible");
  }

  // Loss deductions
  if (lead.stage === "lost") {
    score = Math.max(0, score - 30);
    signals.push("Lost lead");
  }
  if (lead.lossReason) {
    score = Math.max(0, score - 10);
    signals.push(`Loss: ${lead.lossReason}`);
  }

  // Normalize to 0-100
  score = Math.min(100, Math.max(0, score));

  let tier: ScoredLead["tier"];
  if (score >= 75) tier = "hot";
  else if (score >= 50) tier = "warm";
  else if (score >= 25) tier = "cold";
  else tier = "dead";

  const conversionProbability = Math.min(95, Math.max(5, score * 0.9 + (lead.goodLead ? 10 : 0)));
  const estimatedRevenue = lead.q.budget ? lead.q.budget * 12 : 120000;

  return { lead, score, tier, signals, conversionProbability, estimatedRevenue };
}

const TIER_COLORS = {
  hot: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    badge: "destructive" as const,
  },
  warm: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    badge: "default" as const,
  },
  cold: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "secondary" as const,
  },
  dead: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-500",
    badge: "outline" as const,
  },
};

export function LeadAnalyticsDashboard() {
  const { list } = useMovement();
  const [sortBy, setSortBy] = useState<"score" | "revenue" | "probability">("score");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const scoredLeads = useMemo(() => {
    return list.map(calculateLeadScore).sort((a, b) => {
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "revenue") return b.estimatedRevenue - a.estimatedRevenue;
      return b.conversionProbability - a.conversionProbability;
    });
  }, [list, sortBy]);

  const filteredLeads = useMemo(() => {
    return scoredLeads.filter((s) => {
      if (tierFilter !== "all" && s.tier !== tierFilter) return false;
      return true;
    });
  }, [scoredLeads, tierFilter]);

  const stats = useMemo(() => {
    const total = scoredLeads.length;
    const hot = scoredLeads.filter((s) => s.tier === "hot").length;
    const warm = scoredLeads.filter((s) => s.tier === "warm").length;
    const cold = scoredLeads.filter((s) => s.tier === "cold").length;
    const dead = scoredLeads.filter((s) => s.tier === "dead").length;
    const avgScore =
      total > 0 ? Math.round(scoredLeads.reduce((a, s) => a + s.score, 0) / total) : 0;
    const totalRevenue = scoredLeads.reduce((a, s) => a + s.estimatedRevenue, 0);
    const avgConversion =
      total > 0
        ? Math.round(scoredLeads.reduce((a, s) => a + s.conversionProbability, 0) / total)
        : 0;
    return { total, hot, warm, cold, dead, avgScore, totalRevenue, avgConversion };
  }, [scoredLeads]);

  const stageDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    for (const s of scoredLeads) {
      dist[s.lead.stage] = (dist[s.lead.stage] || 0) + 1;
    }
    return Object.entries(dist)
      .map(([stage, count]) => ({
        stage,
        count,
        pct: Math.round((count / scoredLeads.length) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [scoredLeads]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-violet-600" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-tight">Lead Scoring & Analytics</h1>
            <p className="text-[10px] text-muted-foreground leading-tight">
              Smart scoring · High-intent detection · Conversion probability
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Hot Leads</div>
                <div className="text-2xl font-bold text-red-700">{stats.hot}</div>
              </div>
              <Flame className="h-6 w-6 text-red-400" />
            </div>
            <div className="text-[10px] text-red-600 mt-1">Score 75+</div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Warm Leads</div>
                <div className="text-2xl font-bold text-orange-700">{stats.warm}</div>
              </div>
              <Star className="h-6 w-6 text-orange-400" />
            </div>
            <div className="text-[10px] text-orange-600 mt-1">Score 50-74</div>
          </CardContent>
        </Card>
        <Card className="border-violet-200 bg-violet-50/50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Avg Score</div>
                <div className="text-2xl font-bold text-violet-700">{stats.avgScore}</div>
              </div>
              <Target className="h-6 w-6 text-violet-400" />
            </div>
            <div className="text-[10px] text-violet-600 mt-1">
              {stats.avgConversion}% avg conversion
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Pipeline Value</div>
                <div className="text-2xl font-bold text-emerald-700">
                  ₹{(stats.totalRevenue / 100000).toFixed(1)}L
                </div>
              </div>
              <IndianRupee className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="text-[10px] text-emerald-600 mt-1">Annual potential</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scored">
        <TabsList>
          <TabsTrigger value="scored">Scored Leads</TabsTrigger>
          <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="scored" className="mt-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1">
              {(["all", "hot", "warm", "cold", "dead"] as const).map((t) => (
                <Button
                  key={t}
                  variant={tierFilter === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTierFilter(t)}
                  className="text-xs h-7"
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                  {t !== "all" && (
                    <span className="ml-1 text-[10px]">
                      (
                      {t === "hot"
                        ? stats.hot
                        : t === "warm"
                          ? stats.warm
                          : t === "cold"
                            ? stats.cold
                            : stats.dead}
                      )
                    </span>
                  )}
                </Button>
              ))}
            </div>
            <div className="flex gap-1 ml-auto">
              {(["score", "revenue", "probability"] as const).map((s) => (
                <Button
                  key={s}
                  variant={sortBy === s ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy(s)}
                  className="text-xs h-7"
                >
                  Sort: {s}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredLeads.length === 0 ? (
              <Card className="p-8 text-center">
                <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No leads match the filter.</p>
              </Card>
            ) : (
              filteredLeads.map((s) => {
                const colors = TIER_COLORS[s.tier];
                return (
                  <Card
                    key={s.lead.ulid}
                    className={`${colors.border} hover:shadow-sm transition-shadow`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}
                        >
                          <span className={`text-lg font-bold ${colors.text}`}>{s.score}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{s.lead.name || "Unknown"}</span>
                            <Badge variant={colors.badge} className="text-[10px] px-1.5 py-0">
                              {s.tier}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {STAGE_LABEL[s.lead.stage]}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-1">
                            {s.signals.slice(0, 4).map((sig) => (
                              <span
                                key={sig}
                                className="text-[10px] bg-muted/70 rounded px-1.5 py-0.5"
                              >
                                {sig}
                              </span>
                            ))}
                            {s.signals.length > 4 && (
                              <span className="text-[10px] text-muted-foreground">
                                +{s.signals.length - 4} more
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                            <span>Owner: {s.lead.primaryOwnerName}</span>
                            <span>Zone: {s.lead.zone}</span>
                            {s.lead.q.budget && (
                              <span>Budget: ₹{s.lead.q.budget.toLocaleString("en-IN")}</span>
                            )}
                            {s.lead.checkInDate && (
                              <span>
                                Move-in: {new Date(s.lead.checkInDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <div className="text-right">
                            <div className="text-xs font-medium">
                              {s.conversionProbability}% conv.
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              ₹{(s.estimatedRevenue / 1000).toFixed(0)}K/yr
                            </div>
                          </div>
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                s.tier === "hot"
                                  ? "bg-red-500"
                                  : s.tier === "warm"
                                    ? "bg-orange-500"
                                    : s.tier === "cold"
                                      ? "bg-blue-500"
                                      : "bg-gray-400"
                              }`}
                              style={{ width: `${s.score}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="mt-3">
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm">Stage Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="space-y-2">
                {stageDistribution.map(({ stage, count, pct }) => (
                  <div key={stage} className="flex items-center gap-3">
                    <span className="text-xs w-28 text-right text-muted-foreground">
                      {STAGE_LABEL[stage as keyof typeof STAGE_LABEL] || stage}
                    </span>
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium w-12 text-right">{count}</span>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{pct}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-xs flex items-center gap-2">
                  <Zap className="h-3 w-3" /> Top Conversion Signals
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-1">
                  {[
                    { signal: "Move-in within 3 days", impact: "+25 pts", icon: Calendar },
                    { signal: "High budget (₹15K+)", impact: "+20 pts", icon: IndianRupee },
                    { signal: "At payment stage", impact: "+20 pts", icon: TrendingUp },
                    { signal: "Good lead flag", impact: "+10 pts", icon: Star },
                    { signal: "Replied < 1h ago", impact: "+5 pts", icon: MessageSquare },
                  ].map((s) => (
                    <div key={s.signal} className="flex items-center gap-2 text-xs py-1">
                      <s.icon className="h-3 w-3 text-muted-foreground" />
                      <span className="flex-1">{s.signal}</span>
                      <Badge variant="default" className="text-[10px]">
                        {s.impact}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-xs flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3" /> Risk Signals
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-1">
                  {[
                    { signal: "Lost lead", impact: "-30 pts", icon: TrendingDown },
                    { signal: "No move-in date", impact: "No urgency", icon: Clock },
                    { signal: "Low budget (<₹7K)", impact: "+5 pts only", icon: IndianRupee },
                    { signal: "No unread messages", impact: "Stale lead", icon: MessageSquare },
                    { signal: "Shadow identity", impact: "Not qualified", icon: Users },
                  ].map((s) => (
                    <div key={s.signal} className="flex items-center gap-2 text-xs py-1">
                      <s.icon className="h-3 w-3 text-muted-foreground" />
                      <span className="flex-1">{s.signal}</span>
                      <Badge variant="destructive" className="text-[10px]">
                        {s.impact}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader className="p-3">
                <CardTitle className="text-xs flex items-center gap-2">
                  <Target className="h-3 w-3" /> Scoring Algorithm
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="text-xs bg-muted/50 rounded p-3 font-mono space-y-1">
                  <div>Score = Budget(0-20) + MoveInDate(0-25) + Stage(0-20)</div>
                  <div> + Engagement(0-15) + GoodLead(0-10) + Prebook(0-10)</div>
                  <div> - LossPenalty(0-30)</div>
                  <div className="pt-1 text-muted-foreground">
                    Tiers: Hot(75+) | Warm(50-74) | Cold(25-49) | Dead(0-24)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
