import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/pureflow-amanzi-compact")({
  beforeLoad: () => {
    throw redirect({ to: "/projects/pureflow" });
  },
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: () => null,
});
