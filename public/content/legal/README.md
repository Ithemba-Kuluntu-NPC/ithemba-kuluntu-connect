legal content

Cookie Policy: `src/data/legal/cookie-policy-{en,de,nl}-v1.json` is the rendered source imported
by `src/routes/cookie-policy.tsx`. Keep all three language files in sync with the
actual services and consent behaviour. The version in the filename is the content
revision; the structured browser preference version lives in
`src/lib/cookie-consent.ts` and is independent of editorial changes.

The Cookie Policy content is bundled from src/data/legal to support server rendering
and immediate language changes without importing Vite public assets or fetching legal text at runtime.
