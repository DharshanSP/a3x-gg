import { createFileRoute, Link } from "@tanstack/react-router";
import { ShowcasePage } from "@/components/showcase/ShowcasePage";

export const Route = createFileRoute("/showcase")({
  head: () => ({
    meta: [
      { title: "Assignment Showcase — Gharpayy CRM" },
      {
        name: "description",
        content: "Showcase of improvements and new growth features built for the Gharpayy Lead Management CRM.",
      },
    ],
  }),
  component: ShowcasePage,
});
