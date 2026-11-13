# E-Commerce Multi-Filter project instructions

## Stack

- Frontend: React 18, Vite, JavaScript, and plain CSS.
- Backend: Node.js, Express, and in-memory JavaScript inventory; no database.
- Tests: Node.js built-in test runner and native `fetch`.
- Do not add Tailwind, Bootstrap, UI component libraries, or unnecessary
  dependencies.

## Architecture

Backend request flow:

`Routes -> Controllers -> Services -> Repositories`

- Repositories access master inventory and retrieve products, categories, and
  price bounds. They contain no filtering or sorting logic.
- Services orchestrate the business pipeline.
- Filter engines contain all filtering business logic.
- Sort engines contain all sorting business logic.
- Validators, middleware, and utilities stay in their own modules.
- Controllers validate input, call services, and return API responses. Keep
  controllers thin.
- Frontend maintains UI state, sends selected filters to the backend, and
  displays API responses. It must never filter, sort, or calculate product
  business results locally.

## Product filtering behavior

- Selected categories use OR semantics with each other, and AND semantics with
  price and rating. No selected categories means no category restriction.
- Price minimum and maximum are inclusive; a missing bound is unrestricted.
- A product matches a minimum rating when `product.rating >= minRating`.
  Missing, null, or zero minimum rating means Any.
- If all filters are inactive, return the complete inventory.
- Always filter before sorting. Sort a copy and never mutate master inventory.

## API contract

- `GET /api/products`
- `GET /api/products/meta`
- `GET /api/products/:id/thumbnail.svg`
- `GET /api/health`

## Frontend experience

- Filtering updates immediately without a submit button.
- Debounce price-slider requests by 150 ms.
- Abort superseded requests, prevent stale responses, and keep prior results
  visible while loading.
- Show loading skeletons, API errors with retry, and a playful empty state.
- Reset filters while preserving selected sorting.
- Follow the print-shop editorial design: warm paper `#F6EFE3`, ink borders
  `#1B1B1B`, tangerine `#FF6B2C`, lime `#C6F135`, sky blue `#7DB7FF`,
  Fraunces display type, Space Grotesk UI type, JetBrains Mono prices, hard
  offset shadows, stamp labels, a custom dual-thumb price slider, and a live
  price histogram.

## Working rules

- Work only on the stage explicitly requested. Do not start a later stage
  automatically.
- Inspect existing files before modifying them and reuse existing
  implementations.
- Make precise, scoped changes; ask before major architecture changes.
- Use readable, beginner-friendly JavaScript and preserve type safety where
  applicable.
- Do not leave TODO placeholders for required functionality.
- Run relevant tests and builds before reporting success; do not claim checks
  that were not run.
- Keep secrets out of source control. Never commit `.env` files.
- Update directly related documentation and report changed files, commands,
  verification results, and remaining issues at stage completion.
