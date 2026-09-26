import { createFileRoute } from "@tanstack/react-router";
import { isSameOrigin, publicResponse, readJson } from "@/lib/form-route.server";
import { subscribeToNewsletter } from "@/lib/forms.server";

export const Route = createFileRoute("/api/newsletter")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isSameOrigin(request)) {
          return Response.json({ ok: false, error: "security" }, { status: 403 });
        }
        const payload = await readJson(request);
        if (payload === undefined) {
          return Response.json({ ok: false, error: "validation" }, { status: 400 });
        }
        return publicResponse(
          await subscribeToNewsletter(
            payload,
            request.headers.get("CF-Connecting-IP") ?? undefined,
          ),
        );
      },
    },
  },
});
