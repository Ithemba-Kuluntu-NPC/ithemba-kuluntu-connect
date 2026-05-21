# Asset folder

All planned image, logo and icon files live here. The list of expected paths
is in `src/data/assets.ts`. Components use `<SmartImage>`, `<SmartIcon>` and
`<SmartLogo>` from `src/components/site/Asset.tsx` — if a file is missing
they show a visible placeholder + a `[[MISSING: upload asset file at ...]]`
note instead of breaking the layout.

## Folder map

- `logos/` — organisation and project logos (PNG, transparent background)
  - `ithemba-round-color.png`     header logo, links to homepage
  - `ithemba-text-white.png`      hero wordmark, dark/photo backgrounds only
  - `pureflow-amanzi-logo.png`    PureFlow Amanzi project card + page
  - `no1-ecd-logo.png`            No.1 ECD Centre project card + page
  - `pondo-dogs-logo.png`         Pondo Dogs project card + page

- `icons/focus-areas/` — custom PNG icons (transparent background)
  - `education.png`
  - `safe-water.png`
  - `food-security.png`
  - `skills-livelihoods.png`
  - `community-health.png`
  - `animal-welfare.png`
  - `disaster-relief.png`

- `photos/home/`, `photos/about/`, `photos/projects/`,
  `photos/ecd/`, `photos/pureflow/`, `photos/greenhouse/`,
  `photos/food-security/`, `photos/pondo-dogs/`,
  `photos/disaster-relief/`, `photos/media/`, `photos/partners/`
  — JPG photography (see `src/data/assets.ts` for the exact filenames).

## Image rules

- Logos: PNG with transparent background. Do not stretch, recolor or crop.
- Focus area icons: PNG with transparent background, ample padding.
- Photos: JPG, sized for web. Square or 4:5 work well for bubble masks.
