import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { LeadAnalyticsDashboard } from "@/components/analytics/LeadAnalyticsDashboard";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Lead Scoring & Analytics — Gharpayy" },
      {
        name: "description",
        content:
          "Smart lead scoring algorithm that flags high-intent leads based on budget, move-in date, and interaction history.",
      },
      { property: "og:title", content: "Lead Scoring & Analytics — Gharpayy" },
      {
        property: "og:description",
        content:
          "Identify your hottest leads instantly. Score based on qualification, engagement, and conversion signals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyticsRoute,
});

function AnalyticsRoute() {
  return (
    <AppShell>
      <LeadAnalyticsDashboard />
    </AppShell>
  );
}
