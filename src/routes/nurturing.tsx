import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { LeadNurturingDashboard } from "@/components/nurturing/LeadNurturingDashboard";

export const Route = createFileRoute("/nurturing")({
  head: () => ({
    meta: [
      { title: "Automated Lead Nurturing — Gharpayy" },
      {
        name: "description",
        content:
          "Automated WhatsApp/SMS status updates and smart follow-up task generation when lead status changes.",
      },
      { property: "og:title", content: "Automated Lead Nurturing — Gharpayy" },
      {
        property: "og:description",
        content:
          "Never miss a follow-up. Auto-generate tasks and send status updates when leads move through the funnel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NurturingRoute,
});

function NurturingRoute() {
  return (
    <AppShell>
      <LeadNurturingDashboard />
    </AppShell>
  );
}
