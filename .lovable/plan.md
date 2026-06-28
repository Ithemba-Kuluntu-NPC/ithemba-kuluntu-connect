# Rebuild PureFlow Amanzi Compact Concept Page

Full replacement of `src/routes/projects/pureflow-amanzi-compact.tsx` only. The existing live page at `src/routes/projects/pureflow.tsx` is **not** touched.

## 1. Content binding (v3)

- Switch the dynamic loader from `*-v2.txt` to `*-v3.txt` for EN / DE / NL.
- Keep the in-file `parseContent` helper (key/value with dot-paths), expanded to surface every v3 key listed in the brief (hero, pathway 1–6, showcase, impact counters, step1–6 + step2.loop.1–5, sdg 1/3/4/5/6/8/10/11/12/13/17, partners, donation amt 1–5 + trust_points, closing).
- Driven by `useLang()` so the global EN/DE/NL toggle instantly re-renders all strings.
- Top-of-file comment exactly: `// This is a compact comparison concept for PureFlow Amanzi built around the Transformation Pathway, focusing on women's livelihoods.`
- Graceful fallback to EN strings if a key is missing in DE/NL.

## 2. Visual identity

- Alternating **deep blue** and **warm cream** section backgrounds.
- Decorative script accents in **bright yellow** (existing `font-script` / brand yellow tokens).
- Main and sub headings in the brand **serif** font.
- Soft SVG **wave dividers** between every major zone (reuse the wave pattern used on disaster-relief / food-security pages).
- All PNG illustrations from `/assets/icons/projects/pureflow/` masked inside soft circular / blob frames (`rounded-full` or organic SVG clip), drop shadows, no hard boxes or borders.
- No "Missing info" badges, no broken-image fallbacks visible.

## 3. Page structure

1. **Hero** — full-bleed dark blue overlay on community imagery, yellow script `hero.script_heading`, serif `hero.main_heading`, sub heading, long lede, small line, patent trust line, two CTAs (`hero.cta.monthly` → DonationWidget monthly, `hero.cta.once` → one-time). Bottom wave divider.

2. **Transformation Pathway stepper** — sticky-ish horizontal 6-step tracker (numbers + titles + short desc) on desktop; swipeable horizontal-scroll carousel on mobile. Each step is a button that smooth-scrolls to its `#step-N` anchor below.

3. **Overview video + track record matrix** — two-column split.
   - Left: 16:9 YouTube embed of `showcase.video.url` with thumbnail/poster overlay (lite-embed pattern, no autoplay), captioned with `showcase.video.title` / `.description`.
   - Right: 3×2 condensed counter grid for the 6 `impact.counters.*` keys with large numerals over translated labels; `impact.note` below.

4. **Deep dive — 6 steps** (`#step-1` … `#step-6`). Alternating text/image sides, cream/blue alternating backgrounds, wave between each. Each step:
   - Big numeral, `tag` chip, serif `heading`, narrative `text_block`.
   - Premium "Read more" button (`stepX.cta_label`) opens a side **Sheet** (Radix Sheet from `@/components/ui/sheet`) with extended narrative.
   - Step 1: triptych of `pureflow-problem.png`, `pureflow-womentime-problem.png`, `pureflow-medical-problem.png` in offset circular frames.
   - Step 2: `pureflow-solution.png` hero illustration, plus a vertical **5-stop delivery loop** timeline (Listen → Assemble → Deliver → Teach → Stay) using `step2.loop.heading` / `sub_heading` and `step2.loop.1..5.title|desc`.
   - Step 3: `pureflow-school.png` + `pureflow-ecd.png` paired.
   - Step 4: `pureflow-wash.png`.
   - Step 5: `pureflow-jobs.png`.
   - Step 6: layered `pureflow-cleanwater.png` + `pureflow-village.png` + `pureflow-community.png`.

5. **SDG alignment grid** — cream section, responsive 3-col (1-col mobile, 2-col tablet) minimalist cards for SDGs 1, 3, 4, 5, 6, 8, 10, 11, 12, 13, 17 from `sdg.[n].title` / `.desc`.

6. **Partnerships strip** — script + serif heading + intro; horizontal logo strip from `partners.list` using existing `partners` data in `src/data/projects.ts` when available, gracefully hiding any partner without a logo asset (no broken-image boxes).

7. **Premium donation box** — wraps the existing `DonationWidget` with `defaultProject="pureflow"` and EUR `€`, plus a custom amount-tier display rendering `donation.amt.1..5` value + `_desc` impact tag, monthly/once tab labels, CTA buttons from `donation.btn.*`, and a comma-split trust-points footer strip from `donation.trust_points`.

8. **Closing brand signature** — deep blue block, brand wave top + bottom, serif `closing.main_heading`, `closing.text`, two CTAs (`closing.btn.monthly` → donation, `closing.btn.projects` → `/projects`).

## 4. Responsiveness & quality bar

- Every section uses `container` / `max-w-*` + `px-*` patterns already used in the project; no fixed widths that cause horizontal scroll on ≤360 px viewports.
- Pathway stepper, counter grid, SDG grid, partner strip, and step image clusters each collapse to single column on mobile.
- Verify with `tsgo` (typecheck) after the file is rewritten; fix any unused-import / type errors before completion.

## Technical notes

- Single-file change: `src/routes/projects/pureflow-amanzi-compact.tsx`.
- Reuse: `useLang`, `DonationWidget`, `Button`, `Sheet`, `Accordion` (mobile pathway fallback if needed), `cn`, partner data from `@/data/projects`.
- v3 parser remains client-side `fetch('/content/projects/pureflow-amanzi-<lang>-v3.txt')` cached by lang in `useState` + `useEffect`.
- No changes to routing config, language provider, or shared components.
