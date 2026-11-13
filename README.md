# E-Commerce Multi-Filter

A small e-commerce catalog demo with a responsive filter sidebar, backend-driven
filtering and sorting, and deterministic SVG product thumbnails. The inventory
is held in memory; no database or third-party UI library is used. Below 900px,
the filters open in a keyboard-accessible drawer.

## Tech stack

- **Frontend:** React 18, Vite, JavaScript, and plain CSS
- **Backend:** Node.js ES modules, Express, and in-memory JavaScript inventory
- **Tests:** Node.js built-in test runner and native `fetch`
- **Runtime:** Node.js 20.19+ or 22.12+

## Project structure

```text
.
├── .github/
│   └── copilot-instructions.md
├── client/
│   ├── src/
│   │   ├── api/                 # HTTP client and product API calls
│   │   ├── components/
│   │   │   ├── catalog/         # Product cards, grid, sort, empty/error states
│   │   │   ├── common/          # Shared UI, including star ratings
│   │   │   ├── filters/         # Sidebar and filter controls
│   │   │   └── layout/          # Shop shell and top bar
│   │   ├── hooks/               # Catalog requests and debouncing
│   │   ├── state/               # Filter reducer and selectors
│   │   ├── styles/              # Design tokens and global styles
│   │   └── utils/
│   └── tests/
├── docs/
│   └── VIVA_NOTES.md
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── data/                # Frozen master product inventory
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/            # Filter, sort, and business pipeline
│   │   ├── utils/
│   │   └── validators/
│   └── tests/
├── package.json
└── README.md
```

## Architecture

The browser manages display state and sends query parameters to the API. It
does not calculate product filtering or ordering.

Backend responsibilities are separated by layer:

1. **Routes** map HTTP paths to controller functions.
2. **Controllers** validate request input, call services, and format responses.
3. **Services** orchestrate the business pipeline and metadata.
4. **Repositories** retrieve products, categories, and price bounds from the
   frozen master inventory; they do not filter or sort.
5. **Filter engine** applies the filter semantics.
6. **Sort engine** sorts a copy of the filtered results.

The product pipeline is **inventory → filter → sort a copy → response**.
Filtering before sorting avoids ordering products that will be discarded, and
copying ensures the source inventory is never mutated.

## Filtering and sorting

- Selected categories use OR semantics with each other, and AND semantics with
  price and rating.
- Minimum and maximum prices are inclusive. An absent price boundary is
  unrestricted.
- A minimum rating includes products with `rating >= minRating`. Missing or
  zero rating means Any.
- With no active filters, the complete inventory is returned.
- Sort options are `featured`, `price_asc`, `price_desc`, `rating_desc`, and
  `name_asc`. Sorting always happens in the backend.
- Moving the price slider is debounced by 150 ms. Superseded browser requests
  are aborted and stale results are ignored.

## API

All endpoints are served from the Express API:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/products` | List products with optional filters and sort |
| `GET` | `/api/products/meta` | Category counts, price bounds, histogram, and sort options |
| `GET` | `/api/products/:id/thumbnail.svg` | Deterministic SVG thumbnail |

Example filtered and sorted request:

```text
GET /api/products?categories=Electronics,Books&minPrice=500&maxPrice=5000&minRating=4&sort=price_asc
```

The response contains the product array in `data` and result information in
`meta`:

```json
{
  "data": [],
  "meta": {
    "total": 60,
    "matched": 0,
    "appliedFilters": {
      "categories": ["Books"],
      "minPrice": 500,
      "maxPrice": 5000,
      "minRating": 4
    },
    "sort": "price_asc"
  }
}
```

Metadata example:

```text
GET /api/products/meta
```

The metadata response includes `categories` with counts, `priceBounds`,
`priceHistogram`, and `sortOptions`.

Quick local checks from PowerShell:

```powershell
curl.exe http://localhost:5000/api/health
curl.exe "http://localhost:5000/api/products?categories=Electronics&sort=price_asc"
curl.exe http://localhost:5000/api/products/meta
curl.exe http://localhost:5000/api/products/1/thumbnail.svg --output product.svg
```

Invalid category, price, or rating parameters return HTTP 400 with a consistent
error object:

```json
{
  "error": {
    "message": "minPrice must be a valid number.",
    "status": 400
  }
}
```

## Install and run

Install all workspace dependencies from the repository root:

```powershell
npm run install:all
```

Start the Vite client and Express API together:

```powershell
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` requests to
`http://localhost:5000`. To customize local API configuration, copy
`server/.env.example` to `server/.env`; never commit `.env` files.

Run only the API:

```powershell
npm run dev --workspace server
```

## Tests and build

Run backend tests:

```powershell
npm test
```

Run frontend tests and create a production build:

```powershell
npm test --workspace client
npm run build --workspace client
```
