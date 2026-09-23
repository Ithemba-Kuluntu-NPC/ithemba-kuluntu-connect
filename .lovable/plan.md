# Update the PureFlow Amanzi project page

## Scope
- Change only `src/routes/projects/pureflow.index.tsx` and `src/components/blocks/PureFlowEventMap.tsx`.
- Keep the hero/video, verified programme counters, event JSON/data, navigation, footer content, copy, and all other pages unchanged.
- Use the exact existing `.jpg` files requested; all 29 requested photo filenames were found in `public/assets/photos/projects/pureflow/`.

## Page sections and visual rhythm
- Restyle “The Blueprint” from cream to established deep blue while preserving its six-step structure and illustrations; adapt headings, descriptions, arrows, and markers for contrast.
- Keep “Watch & Verify” as a standalone blue section, move the existing eight verified metrics above its existing video, and retain the existing wording and playback behavior.
- Move “Field Map” into its own warm-cream section with deep-blue/dark text and the existing yellow script label.
- Tighten section padding and content gaps consistently without changing section order or making the page cramped.

## Field map
- Remove only the “29 events” and “27 locations” footer labels, preserving OpenStreetMap attribution, markers, filters, grouping, event details, photos, and all map behavior.
- On desktop, use a stretching grid so the map and selected-event card share one fixed overall height and align top-to-bottom; allow the card’s content area to scroll internally when needed rather than cropping information.
- Keep natural stacked heights on tablet and mobile.

## Photography and collages
- Update the photo manifest and section mappings to the exact requested files:
  - Structural Problem: four requested water-burden/home-boiling photos.
  - PureFlow Model: installation family, training-station woman, and ECD WASH education.
  - Delivery loop: replace only Listen and Assemble with the requested meeting and assembly-table photos.
  - System Shifts: four requested comparison, child-use, backwash, and resident-training photos.
  - Wider Community Gains: three requested celebration, G20 booth, and assembly-team photos.
  - Long-term Transformation: four requested child, recipient, Bholani training, and Step 06 photos.
  - Climate Resilience: four requested drinking, SDG, family-guidance, and training-station photos.
  - Together We Grow Stronger: replace the single image with the four requested community/ECD group photos.
- Preserve the existing editorial collage language: individual rounded images, tight gaps, subtle depth, cover crops, and face/action-aware focal positions.

## Donation and actions
- Replace the custom PureFlow donation box with the standard project donation form structure used by ECD: frequency tabs, preset/custom amounts, gift designation, donor details, payment choices, primary action, and trust indicators.
- Keep the PureFlow section heading, supporting context, background, destination, and existing prototype payment behavior; default the gift designation to Safe Water and do not add providers.
- Remove every future PureFlow deep-dive control: the Structural Problem route link, all Step 02–06 read-more controls, and the Climate Resilience read-more control. Keep donation, map, video, and Explore All Projects actions.

## Page ending
- Give the final section a page-specific identifier and cancel the shared footer’s built-in top margin only after that section, matching the existing clean page-scoped pattern. This removes the blank cream/white band without changing the footer or using a negative-margin hack.

## Verification
- Run the focused type check and inspect the live page at desktop, tablet, and mobile widths.
- Confirm exact image requests load, Blueprint is blue, metrics precede video, map is light, desktop columns end evenly, map counts are absent, donation controls fit, deep-dive controls are gone, footer follows the final section directly, and no horizontal overflow occurs.
- Confirm the hero and video are unchanged and the event JSON remains untouched.
