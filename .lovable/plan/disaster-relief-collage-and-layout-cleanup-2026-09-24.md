# Disaster Relief collage and layout cleanup

## Scope
Update only `src/routes/projects/disaster-relief.tsx`. Preserve all copy, translations, navigation, donation behavior, footer content, hero, and unrelated pages.

## Changes
- Replace the page’s current collage renderer with the established compact editorial grid pattern used on ECD/PureFlow: individually rounded image cells, balanced asymmetric proportions, tight gaps, consistent crop behavior, and a shared responsive height/width cap.
- Reorder **At a glance** to heading/copy, compact horizontal icon-and-text facts, then the collage; reduce section padding and gaps.
- Keep **Why emergency support matters** blue while applying the shared collage proportions and tighter spacing.
- Reorder **Practical care** and **Your support** to heading/copy, compact icon-and-text items, then equally scaled collages; keep their existing outro text.
- Change **Together / What your support helps make possible** to a photo-backed impact section using `disaster-relief-connected-care-children-and-caregivers-outside-community-building-01.jpg`, with a lighter blue overlay and the existing statistics.
- Convert **When crisis hits** to a solid deep-blue section while preserving its content and actions.
- Remove the final gap by cancelling the shared footer top spacing only when it directly follows the Disaster Relief closing section, without negative margins or global/footer edits.

## Verification
- Check desktop, tablet, and mobile for section order, consistent collage sizing, readable compact icon rows, correct backgrounds, image loading, zero horizontal overflow, and zero gap before the footer.
- Run the focused TypeScript check and confirm only the Disaster Relief source file changed.
