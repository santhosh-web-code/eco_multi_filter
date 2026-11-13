import { ShopLayout } from './components/layout/ShopLayout.jsx'
import { FilterSidebar } from './components/filters/FilterSidebar.jsx'
import { EmptyState } from './components/catalog/EmptyState.jsx'
import { ErrorBanner } from './components/catalog/ErrorBanner.jsx'
import { ProductGrid } from './components/catalog/ProductGrid.jsx'
import { ResultsHeader } from './components/catalog/ResultsHeader.jsx'
import { useProductCatalog } from './hooks/useProductCatalog.js'

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
    retry,
  } = useProductCatalog()
  const showEmptyState = status === 'success' && matched === 0

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

      <section aria-label="Product catalog" className="catalog-panel">
        <ResultsHeader
          matched={matched}
          onSortChange={(sort) => dispatch({ type: 'SET_SORT', sort })}
          sort={state.sort}
          sortOptions={meta?.sortOptions ?? []}
          total={total}
        />
        {status === 'error' && error && (
          <ErrorBanner error={error} onRetry={retry} />
        )}
        {showEmptyState
          ? <EmptyState onReset={() => dispatch({ type: 'RESET_FILTERS' })} />
          : <ProductGrid items={items} status={status} />}
      </section>
    </ShopLayout>
  )
}

export default App
