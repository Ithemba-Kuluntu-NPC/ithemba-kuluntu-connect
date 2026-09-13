# Finalise Disaster Relief Photography

Update only the live Disaster Relief project page using the verified 65-photo field library. Preserve all copy, translations, navigation, icons, impact figures, donation behavior, section order, spacing system, and shared site code.

## Media implementation

- Remove the page-only video constants, reduced-motion/video state, video element, video source, and video placeholder badge.
- Use the approved large community gathering photograph as the eager, full-bleed hero image with separate desktop/mobile focal positioning and a restrained deep-blue readability overlay.
- Add a small page-local photo manifest containing only displayed Disaster Relief files.
- Add reusable page-local two-, three-, and four-image collage primitives with meaningful alt text, lazy loading below the hero, rounded documentary crops, and explicit per-photo object positions.

## Existing section placements

- **At a glance:** one dominant community distribution image with two supporting scale/delivery images.
- **Why emergency support matters:** respectful vulnerability and fire-damage composition showing the circumstances behind the work.
- **Practical care:** one dominant relief bundle plus mattress delivery, school shoes, and wheelchair support; retain the existing icon list and text.
- **Local trust:** relationship-led collage featuring community workers with an older woman and a child, with fire-response imagery integrated as the crisis-to-response thread.
- **Connected care:** warm children, caregiver, and mother-and-child composition; retain focus-area icons.
- **Your support:** practical household relief photograph/collage without changing donation-support copy or icons.
- **Give monthly:** use the specified family-with-relief-bundle photograph as the background with a balanced blue overlay.
- **Closing:** add a distinct positive, dignity-led Disaster Relief image not reused elsewhere.

## Validation

- Verify every selected filename exists and every page photo comes only from `/assets/photos/projects/disaster-relief/`.
- Confirm no displayed photo is repeated unnecessarily, no old generic assets or placeholders remain, and no Disaster Relief video code remains.
- Confirm the four impact values are unchanged and all EN/DE/NL copy remains unchanged.
- Typecheck, then inspect the full page on desktop and mobile for hero framing, readable overlays, clean collage stacking, faces and relief items in frame, no overflow, no broken images, and working donation links/components.

## Technical scope

- Single implementation file: `src/routes/projects/disaster-relief.tsx`.
- No event map work and no changes to other project pages or shared site styling.
