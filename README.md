# Grocery OS

Developer handoff for the Grocery Concierge MVP deployed at https://grocery-concierge-mvp.vercel.app/.

Grocery OS is a Vite + React + TypeScript prototype for a grocery-planning concierge. It turns simple household constraints into a budget-aware, aisle-by-aisle shopping route and a small set of healthy meal ideas. The current app is intentionally deterministic and front-end only: no backend, auth, database, payments, or live grocery API integrations are required to run it.

## What the MVP does

- Collects shopper constraints: ZIP code, weekly budget, household size, preferred store, dietary preferences, cooking limitations, and foods to avoid.
- Uses seeded pilot data for ZIP `30022` in the Johns Creek / Alpharetta area.
- Selects a nearby store and applies simple brand-level price factors.
- Generates a weekly basket from a staple catalog while respecting dislikes, dietary needs, cooking limitations, and budget buffer.
- Groups items into an aisle-style route: produce, protein, condiments/spices, and pantry/staples.
- Produces meal ideas from the selected basket.
- Includes test coverage for the recommendation engine and the primary UI flow.

## Tech stack

- React 18
- TypeScript
- Vite
- Vitest
- React Testing Library
- ESLint flat config

## Repository structure

```text
.
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.tsx                 # Main product UI and interaction flow
│   ├── App.css                 # App-level styling
│   ├── App.test.tsx            # End-to-end-ish UI flow test
│   ├── index.css               # Global styles
│   ├── main.tsx                # React entrypoint
│   ├── pilotData.ts            # Seeded pilot stores and price overrides for ZIP 30022
│   ├── recommendation.ts       # Core basket, store, substitution, and meal logic
│   ├── recommendation.test.ts  # Unit tests for recommendation behavior
│   └── setupTests.ts           # Testing Library matcher setup
├── index.html
├── package.json
├── package-lock.json
├── tsconfig*.json
├── vite.config.ts
└── eslint.config.js
```

## Getting started

Requirements:

- Node.js 20+ recommended
- npm

Install dependencies:

```bash
npm install
```

Start local development:

```bash
npm run dev
```

Vite will print a local URL, usually `http://localhost:5173/`.

## Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Type-check and create production build in dist/
npm run test     # Run Vitest test suite in jsdom
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Data model and business logic

The main product logic lives in `src/recommendation.ts`.

Important exported types:

- `UserPreferences`: input shape from the UI.
- `GroceryItem`: catalog item shape.
- `MealIdea`: generated meal card shape.
- `Substitution`: replacement suggestion shape.
- `Basket`: full generated output consumed by the UI.

Important functions:

- `getAvailableStores(zipCode)`: returns seeded 30022 stores or a generic fallback store.
- `generateBasket(preferences)`: core deterministic planner that selects a store, prices items, filters conflicts, stays under the target spend when possible, and returns basket/meals/explanations.

The pilot store and price data live in `src/pilotData.ts`.

Current pilot assumptions:

- `pilotZip = '30022'`
- Store list is manually seeded for nearby ALDI, Kroger, Publix, Walmart, and H Mart locations.
- Price overrides are manual MVP estimates, not live retailer data.
- Non-pilot ZIP codes use generic fallback data.

## UI flow

The main app is in `src/App.tsx`.

High-level sections:

1. Hero / positioning preview
2. Product concept cards
3. Planner form for constraints
4. Pilot store card
5. Aisle-by-aisle route board
6. Meal ideas and positioning copy

The UI currently stores all state in React component state. There is no persistence beyond the current browser session.

## Testing

Run:

```bash
npm run test
```

Current coverage focuses on:

- Budget-aware basket generation
- Pilot ZIP store behavior
- Fallback behavior for unknown ZIP codes
- Dietary/dislike filtering and substitutions
- Meal idea generation
- Main user flow in `App.test.tsx`

If you change `generateBasket`, update or extend `src/recommendation.test.ts` first. The recommendation engine is deliberately separate from React so business rules can be tested without rendering the UI.

## Production build

Run:

```bash
npm run build
```

This performs TypeScript project build checks and creates a Vite production build in `dist/`.

`dist/` is intentionally gitignored and should not be committed.

## Deployment

The public MVP is currently deployed at:

https://grocery-concierge-mvp.vercel.app/

This repository does not require committed Vercel config for the current static Vite app. Vercel can build it with:

- Framework preset: Vite
- Install command: `npm install` or default
- Build command: `npm run build`
- Output directory: `dist`

No environment variables are required for the current MVP.

## Known limitations

- No live retailer inventory or pricing integration.
- No user accounts, saved lists, or shopping history.
- ZIP coverage is seeded for `30022`; other ZIPs use a generic fallback.
- Household-size and `days` fields are part of the preference model, but the current basket logic is still a simple MVP heuristic rather than full nutritional/serving optimization.
- Aisle grouping is hardcoded in the UI rather than driven by store-specific planograms.
- Recommendations are deterministic and rules-based; there is no LLM, search, scraping, or personalization backend yet.
- Prices are estimates and should be verified before checkout.

## Safe next steps for the next developer

1. Preserve deterministic tests around `generateBasket` before adding complexity.
2. Replace manual pilot prices with a data adapter layer instead of wiring APIs directly into React.
3. Add a clear source/confidence field to any live inventory or price data.
4. Expand ZIP/store support behind `getAvailableStores` or a new store service module.
5. Move aisle bucketing out of `App.tsx` if it becomes store-specific business logic.
6. Add saved lists only after the recommendation output shape stabilizes.
7. If adding a backend, keep API credentials server-side and add `.env.example` without real secrets.

## Handoff checklist

Before handing off a branch or deployment, run:

```bash
npm run lint
npm run test
npm run build
git status --short --branch
```

Expected baseline at handoff:

- Tests pass.
- Production build succeeds.
- No `node_modules/`, `dist/`, `.vercel/`, or `.env*` files are committed.
- README reflects any new backend, API, or deployment requirements.

## GitHub

Public repository:

https://github.com/Syrexle/grocery-os
