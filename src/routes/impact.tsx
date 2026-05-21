import { createFileRoute, redirect } from "@tanstack/react-router";

// The standalone Impact page has been removed. Impact lives on the homepage
// counters and (where relevant) on individual project pages. We keep the
// /impact path resolvable by redirecting any inbound links to the homepage.
export const Route = createFileRoute("/impact")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});
