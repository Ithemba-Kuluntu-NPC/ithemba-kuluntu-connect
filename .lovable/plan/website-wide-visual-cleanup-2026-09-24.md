# Website-wide visual cleanup

## Scope

- Remove only the excess space before the footer on Our Team and Donate.
- Tighten the Project Overview card section and its transition into the footer without changing any cards.
- Remove public-facing development markers while preserving real media, forms, validation, and fallback behavior.
- Rework only the homepage newsletter spacing into a compact responsive signup band, keeping its existing wording and controls.

## Implementation

1. **Footer transitions**
   - Give the final Our Team and Donate sections page-specific identifiers and remove the shared footer's top margin only when it follows those pages.
   - Apply the same page-scoped footer transition to Project Overview, while reducing only the project-grid section's bottom padding.
   - Preserve the Donate divider, all final-section styling, and the footer itself.

2. **Public development-label cleanup**
   - Make the dedicated missing-information badge/placeholder helpers render no public UI, preserving their call sites and the underlying form/media structures for later integrations.
   - Remove the Project Overview's explicit hero-video placeholder chip while keeping the real video and poster fallback logic.
   - Remove prototype/setup wording from donation and contact submission states without changing fields, validation, choices, or controls.
   - Keep the unlinked internal missing-information checklist available; it uses its own checklist UI rather than the public placeholder helpers.

3. **Homepage newsletter**
   - Convert the current tall card into a concise two-column band on desktop/tablet: copy on the left, email field and Subscribe button on the right.
   - Use a compact stacked arrangement on phones with a comfortable full-width button.
   - Reduce outer padding, panel padding, decorative footprint, and internal gaps while preserving all EN/DE/NL copy, the email input, button, and semantic form.
   - Remove provider/setup badges and the current fake subscribed state. Submission will remain safely inactive until a real provider is connected.

## Verification

- Check Our Team, Project Overview, Donate, and homepage at desktop, tablet, and mobile sizes.
- Confirm the three footer transitions have no blank band, project cards remain unchanged, newsletter controls fit without overflow, and no public development labels remain.
- Run the focused type check supplied by the project harness and inspect browser console errors during responsive checks.
