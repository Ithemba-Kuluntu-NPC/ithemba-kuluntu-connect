# Complete the PureFlow Amanzi impact map

## Scope
- Update only the existing PureFlow event-map component and its map-section labels on the PureFlow page.
- Keep `/content/projects/pureflow-events.json` as the sole event source; do not alter the verified JSON or backup record.
- Leave the hero, video, counters, navigation, footer, and every other page section untouched.

## Implementation
- Replace the demo event shape and display with the three verified event categories and category-specific fields.
- Fetch and validate the external JSON with clear loading and error states, then default to all events and select the first verified event.
- Group events sharing exact coordinates into one marker with a count and an accessible event chooser.
- Add category filters, legend, category-colored custom markers, selected-marker emphasis, and automatic bounds fitting.
- Build a responsive event panel with the correct metrics, activities, supporter/partner details, and event-specific photo carousel.
- Load only the current carousel image immediately; lazy-load any image after navigation and avoid importing the map photo folder.

## Verification
- Confirm 29 events, 24 community / 3 ECD / 2 training, and the expected unique location-group count.
- Test filters, every shared-location event, marker selection, carousel controls, one-photo behavior, and data-specific fields.
- Check desktop, tablet, and phone layouts for map usability, readable crops, no broken photos, and no horizontal overflow.
- Confirm the PureFlow hero and all non-map sections remain unchanged.
