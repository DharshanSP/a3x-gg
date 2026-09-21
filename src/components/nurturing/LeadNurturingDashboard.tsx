import { useState, useMemo, useCallback } from "react";
import {
  MessageSquare,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Zap,
  ArrowRight,
  Phone,
  Bot,
  Filter,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMovement, type MovementState } from "@/movement/store";
import { STAGE_LABEL, FUNNEL_ORDER } from "@/movement/types";

interface NurturingTask {
  id: string;
  leadUlid: string;
  leadName: string;
  phone: string;
  type: "whatsapp" | "sms" | "auto-followup" | "status-update";
  message: string;
  status: "pending" | "sent" | "delivered" | "read" | "failed";
  scheduledAt: string;
  sentAt?: string;
  triggeredBy: string;
  priority: "high" | "medium" | "low";
}

const AUTO_MESSAGES: Record<string, (name: string, context?: string) => string> = {
  "tour-scheduled": (name) =>
    `Hi ${name}! Your PG visit is confirmed. We're excited to show you around. See you soon! 🏠`,
  "tour-done": (name) =>
    `Hi ${name}, thanks for visiting! We'd love to hear your feedback. Any questions?`,
  quotation: (name) =>
    `Hi ${name}, here's your personalized quote. Let us know if you'd like to proceed!`,
  payment: (name) => `Hi ${name}, your payment is pending. Complete it now to secure your room!`,
  booked: (name) =>
    `Hi ${name}, congratulations! Your booking is confirmed. Welcome to your new home! 🎉`,
  new: (name) =>
    `Hi ${name}, thanks for your interest in Gharpayy! How can we help you find the perfect PG?`,
  qualified: (name) =>
    `Hi ${name}, great news! You've been matched with some amazing options. Want to take a look?`,
  matched: (name) =>
    `Hi ${name}, we've curated some PG options just for you. When would you like to visit?`,
};

function generateNurturingTasks(leads: MovementState[]): NurturingTask[] {
  const tasks: NurturingTask[] = [];
  const now = Date.now();

  for (const lead of leads) {
    if (lead.stage === "lost" || lead.stage === "check-in") continue;

    const daysSinceUpdate = Math.floor(
      (now - new Date(lead.updatedAt).getTime()) / (1000 * 60 * 60 * 24),
    );
    const hasOverdueAction = lead.nextAction && new Date(lead.nextAction.dueAt).getTime() < now;

    if (hasOverdueAction) {
      tasks.push({
        id: `auto-${lead.ulid}-overdue`,
        leadUlid: lead.ulid,
        leadName: lead.name || "Unknown",
        phone: lead.phone || "",
        type: "auto-followup",
        message:
          AUTO_MESSAGES[lead.stage]?.(lead.name || "there") ||
          `Hi ${lead.name || "there"}, following up on your inquiry.`,
        status: "pending",
        scheduledAt: lead.nextAction!.dueAt,
        triggeredBy: `Overdue ${lead.nextAction!.kind}`,
        priority: "high",
      });
    }

    if (daysSinceUpdate >= 2 && lead.stage !== "new") {
      tasks.push({
        id: `nurture-${lead.ulid}-stale`,
        leadUlid: lead.ulid,
        leadName: lead.name || "Unknown",
        phone: lead.phone || "",
        type: "whatsapp",
        message: `Hi ${lead.name || "there"}, just checking in! Any updates on your PG search?`,
        status: "pending",
        scheduledAt: new Date(now + 2 * 60 * 60 * 1000).toISOString(),
        triggeredBy: `${daysSinceUpdate} days since last update`,
        priority: daysSinceUpdate >= 5 ? "high" : "medium",
      });
    }

    if (lead.stage === "new" && lead.identity === "shadow") {
      tasks.push({
        id: `status-${lead.ulid}-new`,
        leadUlid: lead.ulid,
        leadName: lead.name || "Unknown",
        phone: lead.phone || "",
        type: "status-update",
        message: AUTO_MESSAGES["new"](lead.name || "there"),
        status: "pending",
        scheduledAt: new Date(now + 30 * 60 * 1000).toISOString(),
        triggeredBy: "New lead auto-greeting",
        priority: "low",
      });
    }

    if (lead.stage === "tour-scheduled" && !lead.tourConfirmed) {
      tasks.push({
        id: `confirm-${lead.ulid}-tour`,
        leadUlid: lead.ulid,
        leadName: lead.name || "Unknown",
        phone: lead.phone || "",
        type: "whatsapp",
        message: AUTO_MESSAGES["tour-scheduled"](lead.name || "there"),
        status: "pending",
        scheduledAt: new Date(now + 1 * 60 * 60 * 1000).toISOString(),
        triggeredBy: "Tour not confirmed",
        priority: "high",
      });
    }
  }

  return tasks.sort((a, b) => {
    const prio = { high: 0, medium: 1, low: 2 };
    return prio[a.priority] - prio[b.priority];
  });
}

export function LeadNurturingDashboard() {
  const { list } = useMovement();
  const [tasks, setTasks] = useState<NurturingTask[]>(() => generateNurturingTasks(list));
  const [filter, setFilter] = useState<"all" | "pending" | "sent" | "failed">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sentLog, setSentLog] = useState<
    Array<{ ts: string; msg: string; lead: string; type: string }>
  >([]);

  const stats = useMemo(() => {
    const pending = tasks.filter((t) => t.status === "pending").length;
    const sent = tasks.filter((t) => t.status === "sent" || t.status === "delivered").length;
    const failed = tasks.filter((t) => t.status === "failed").length;
    const high = tasks.filter((t) => t.priority === "high" && t.status === "pending").length;
    return { pending, sent, failed, high, total: tasks.length };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filter !== "all" && t.status !== filter) return false;
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      return true;
    });
  }, [tasks, filter, typeFilter]);

  const sendTask = useCallback(
    (taskId: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: "sent" as const, sentAt: new Date().toISOString() } : t,
        ),
      );
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setSentLog((prev) =>
          [
            {
              ts: new Date().toISOString(),
              msg: task.message.slice(0, 60),
              lead: task.leadName,
              type: task.type,
            },
            ...prev,
          ].slice(0, 50),
        );
      }
    },
    [tasks],
  );

  const sendAll = useCallback(() => {
    const pendingIds = tasks.filter((t) => t.status === "pending").map((t) => t.id);
    pendingIds.forEach((id, i) => setTimeout(() => sendTask(id), i * 500));
  }, [tasks, sendTask]);

  const regenerate = useCallback(() => {
    setTasks(generateNurturingTasks(list));
  }, [list]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <Bot className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-tight">Automated Lead Nurturing</h1>
            <p className="text-[10px] text-muted-foreground leading-tight">
              Auto-generated follow-ups · WhatsApp/SMS simulation · Status updates
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={regenerate}>
            <Zap className="h-3 w-3 mr-1" /> Refresh Tasks
          </Button>
          <Button size="sm" onClick={sendAll} className="bg-emerald-600 hover:bg-emerald-700">
            <Send className="h-3 w-3 mr-1" /> Send All Pending ({stats.pending})
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <div className="text-2xl font-bold text-emerald-700">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-muted-foreground">Sent</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{stats.sent}</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-xs text-muted-foreground">High Priority</span>
            </div>
            <div className="text-2xl font-bold text-red-700">{stats.high}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Total Tasks</span>
            </div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Nurturing Queue</TabsTrigger>
          <TabsTrigger value="log">Send Log</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-3">
          <div className="flex gap-2 mb-3">
            <div className="flex gap-1">
              {(["all", "pending", "sent", "failed"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className="text-xs h-7"
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
            <div className="flex gap-1">
              {["all", "whatsapp", "sms", "auto-followup", "status-update"].map((t) => (
                <Button
                  key={t}
                  variant={typeFilter === t ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setTypeFilter(t)}
                  className="text-xs h-7"
                >
                  {t === "all" ? "All Types" : t.replace("-", " ")}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredTasks.length === 0 ? (
              <Card className="p-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">All caught up! No nurturing tasks.</p>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{task.leadName}</span>
                          <Badge
                            variant={
                              task.priority === "high"
                                ? "destructive"
                                : task.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-[10px] px-1.5 py-0"
                          >
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {task.type.replace("-", " ")}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{task.triggeredBy}</p>
                        <p className="text-xs bg-muted/50 rounded p-2 font-mono">{task.message}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(task.scheduledAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {task.status === "pending" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-[10px]"
                            onClick={() => sendTask(task.id)}
                          >
                            <Send className="h-2.5 w-2.5 mr-1" /> Send
                          </Button>
                        ) : (
                          <Badge
                            variant={task.status === "sent" ? "default" : "destructive"}
                            className="text-[10px]"
                          >
                            {task.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="log" className="mt-3">
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm">Recent Sends</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {sentLog.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No messages sent yet.
                </p>
              ) : (
                <div className="space-y-1 max-h-[400px] overflow-y-auto">
                  {sentLog.map((log, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs py-1 border-b last:border-0"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span className="font-medium">{log.lead}</span>
                      <span className="text-muted-foreground truncate flex-1">{log.msg}</span>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {log.type}
                      </Badge>
                      <span className="text-muted-foreground shrink-0">
                        {new Date(log.ts).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(AUTO_MESSAGES).map(([stage, fn]) => (
              <Card key={stage}>
                <CardHeader className="p-3">
                  <CardTitle className="text-xs flex items-center gap-2">
                    <MessageSquare className="h-3 w-3" />
                    {STAGE_LABEL[stage as keyof typeof STAGE_LABEL] || stage}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-xs bg-muted/50 rounded p-2 font-mono">{fn("{{name}}")}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
