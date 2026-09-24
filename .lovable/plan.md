# Food Security targeted page update

## Scope
Update only `src/routes/projects/food-security.tsx`. Preserve the hero media/layout, all copy except the three requested hero eyebrow values, donation behavior, navigation, footer content, verified figures, and every unrelated page.

## Implementation
1. **Synchronize hero eyebrow copy**
   - Update only the inline EN/DE/NL `hero.eyebrow` values to exactly match the existing v1.1 content files.
   - Do not edit or replace those TXT files.

2. **Compact “At a glance”**
   - Change the section to the established deep-blue treatment with yellow accents and high-contrast white/light text.
   - Use a balanced desktop split: heading and all three paragraphs on the left, all seven facts in a compact two-column grid on the right.
   - Reduce section padding, icon size, and grid gaps while preserving every fact and maintaining natural stacking on smaller screens.

3. **Standardize four collages**
   - Remove the shared white outer card/frame and its padding.
   - Keep one anchor image plus two supporting images with tight gaps, individually rounded corners, subtle image-level depth, and cover crops.
   - Apply this same editorial treatment to Monthly care, Community care, Children first, and Fresh support.
   - Replace only Monthly care’s bottom-right photo with `food-security-food-distribution-family-with-food-parcels-24.jpg`.
   - Replace only Children first’s bottom-right photo with `food-security-ecd-nutrition-ecd-children-eating-in-row-03.jpg`.

4. **Create the requested colour rhythm**
   - Keep Monthly care and Children first light/cream.
   - Change Community care and Fresh support to deep blue, adapting only text, badge, decorative accent, and CTA colours needed for contrast.
   - Tighten vertical padding in these four modified sections without changing their content or order.

5. **Remove the footer gap**
   - Give the final Food Security section a page-specific identifier.
   - Cancel the shared footer’s built-in top spacing only when it immediately follows this page, leaving the footer itself and all other pages unchanged.

## Verification
- Check English, German, and Dutch hero eyebrow switching.
- Verify exact replacement image URLs and that the other collage images remain unchanged.
- Check desktop, tablet, and mobile for compact spacing, intended blue/light alternation, clean collage crops, readable contrast, no overlap, and no horizontal overflow.
- Confirm the final section meets the footer with no blank band and run the project’s TypeScript check.
