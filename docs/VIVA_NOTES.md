# Viva Notes

These notes describe the project in simple terms. The main idea is that the
browser owns interface state while the server owns product business logic.

## Architecture at a glance

The project is a React/Vite client and an Express API in one npm-workspaces
repository. The inventory is a frozen JavaScript array in memory.

The API uses these layers:

```text
HTTP request
  → Route
  → Controller and validator
  → Product service
  → Repository reads master inventory
  → Filter engine
  → Sort engine sorts a copy
  → Controller returns JSON
```

The repository is deliberately small: it retrieves products, categories, and
price bounds. The service coordinates the pipeline. The filter and sort
engines each own one kind of business logic.

## Request lifecycle

1. A user changes a category, price, rating, or sort control.
2. The React reducer updates UI state.
3. The catalog hook turns selected filters into query parameters and requests
   `/api/products`.
4. The Express route passes the request to a thin controller.
5. The validator checks query values and normalizes them.
6. The service reads inventory from the repository, filters it, then sorts a
   copied result array.
7. The controller returns products and result metadata as JSON.
8. React displays the API response; it does not filter or sort products.

## Why use layers?

Layers make each part easier to understand and test. Routes handle URL
matching, controllers handle HTTP, validators check input, services coordinate
work, repositories access inventory, and engines contain filter/sort rules.
Changing an API response does not require placing business rules in the
repository or React UI.

## Filtering and sorting

- Multiple categories are combined with OR: a product can match any selected
  category.
- Category, price, and rating groups are combined with AND.
- Price minimum and maximum are inclusive.
- A rating filter accepts products whose rating is at least the selected
  minimum.
- Missing or zero minimum rating means Any.
- With no active filters, the API returns all 60 products.
- The filter engine runs before the sort engine. Sorting only the matching
  products is more efficient and follows the requested business pipeline.
- The sort engine sorts a copy, so it cannot change the master inventory.

## Dual-range slider

The slider uses two overlapping native range inputs, one for the minimum and
one for the maximum. Each input is clamped so the thumbs cannot cross. The
backend supplies the minimum and maximum prices and the histogram buckets.
Changing the price range updates the UI immediately, while the hook waits 150
ms before sending a request.

## Requests, loading, and stale responses

The catalog hook requests metadata once and requests products whenever filters
or sorting change. It keeps existing products visible during refresh, displays
skeleton cards on initial loading, and exposes API errors with a Retry action.

Each request gets an `AbortController`. When a newer request replaces it, the
previous request is aborted. A request identifier is also checked before
updating the UI, so a response that arrives late cannot replace newer results.

## Why keep the inventory immutable?

The inventory is the single source of truth. If filtering or sorting changed
it in place, the next request could start from incomplete or incorrectly
ordered data. A frozen inventory and copied result arrays keep every request
independent and predictable.

## Likely interview questions

### 1. Why did you choose a layered backend?

It separates HTTP handling, input validation, business rules, and data access.
Each part has one clear job and can be tested independently.

### 2. What does the repository do?

It reads the master inventory and returns products, categories, or price
bounds. It does not filter or sort.

### 3. Where is query validation performed?

The controller calls a dedicated validator before calling the product service.
Invalid values produce a useful HTTP 400 response.

### 4. How are multiple selected categories combined?

They use OR semantics. A product can match any one of the selected categories.

### 5. How do price and rating combine with categories?

The filter groups use AND semantics. A product must match a selected category
and the active price and rating requirements.

### 6. Are price boundaries inclusive?

Yes. The filter accepts a product priced exactly at the minimum or maximum.

### 7. Why filter before sorting?

It avoids sorting products that will be removed and makes the required business
pipeline explicit.

### 8. How do you protect the master inventory?

It is frozen, and both filtering and sorting return new arrays instead of
mutating it.

### 9. Why is filtering not done in React?

The backend is the source of truth for product results. React only sends the
selected criteria and renders the response.

### 10. What does `AbortController` do here?

It cancels a previous fetch when the user changes criteria again, reducing
unnecessary work and preventing stale updates.

### 11. How do you handle responses that finish out of order?

The hook checks a request identifier before saving a response. Only the latest
request is allowed to update catalog state.

### 12. Why debounce the price slider?

Dragging can produce many changes in a short time. Waiting 150 ms reduces
requests while keeping the interface responsive.

### 13. How does sorting work?

React sends the selected sort key to the API. The backend sort engine sorts a
copy of the filtered products and returns the ordered array.

### 14. How does Reset filters affect sorting?

The reducer resets category, price, and rating selections but copies the
current sort value into the new state.

### 15. What is the purpose of the metadata endpoint?

It supplies category counts, price bounds, the histogram, and available sort
keys so the UI can build controls without duplicating inventory calculations.

### 16. How does the mobile filter drawer remain keyboard accessible?

It has dialog semantics, moves focus into the drawer, traps Tab navigation,
closes on Escape or Show Results, and restores focus to the Filters button.
