import { ShopLayout } from './components/layout/ShopLayout.jsx'
import { FilterSidebar } from './components/filters/FilterSidebar.jsx'
import { useProductCatalog } from './hooks/useProductCatalog.js'
import { selectHasActiveFilters } from './state/filterReducer.js'

function App() {
  const {
    items,
    matched,
    total,
    meta,
    status,
    error,
    state,
    dispatch,
  } = useProductCatalog()
  const hasActiveFilters = selectHasActiveFilters(state, meta?.priceBounds)

  return (
    <ShopLayout status={status}>
      <FilterSidebar
        metadata={meta}
        onPriceRangeChange={(priceRange) => dispatch({
          type: 'SET_PRICE_RANGE',
          priceRange,
        })}
        onRatingChange={(minRating) => dispatch({
          type: 'SET_MIN_RATING',
          minRating,
        })}
        onReset={() => dispatch({ type: 'RESET_FILTERS' })}
        onToggleCategory={(category) => dispatch({
          type: 'TOGGLE_CATEGORY',
          category,
        })}
        state={state}
      />

      <section className="placeholder-panel" aria-label="Catalog placeholder">
        <p className="eyebrow">Product catalog</p>
        <h2>Catalog overview</h2>
        <p role="status">
          {status === 'loading' ? 'Loading catalog data...' : 'Catalog request complete.'}
        </p>
        <p>{matched} matched of {total} products.</p>
        <p>{items.length} product records received from the API.</p>
        <p>{meta ? `${meta.categories.length} categories loaded from metadata.` : 'Loading metadata...'}</p>
        <p>{hasActiveFilters ? 'Filters are active.' : 'No filters selected.'}</p>
        <p>Sort: {state.sort}</p>
        {error && <p role="alert">API error: {error.message}</p>}
      </section>
    </ShopLayout>
  )
}

export default App
