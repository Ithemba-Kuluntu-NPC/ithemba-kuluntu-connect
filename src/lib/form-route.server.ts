import type { FormResult } from "./forms.server";

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return origin !== null && origin === new URL(request.url).origin;
}

export async function readJson(request: Request): Promise<unknown | undefined> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return undefined;
  }
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

export function publicResponse(result: FormResult): Response {
  if (result.ok) return Response.json({ ok: true });
  const status = result.kind === "validation" ? 400 : result.kind === "security" ? 403 : 503;
  return Response.json({ ok: false, error: result.kind }, { status });
}
