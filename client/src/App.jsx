import { ShopLayout } from './components/layout/ShopLayout.jsx'
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
  } = useProductCatalog()
  const hasActiveFilters = selectHasActiveFilters(state, meta?.priceBounds)

  return (
    <ShopLayout status={status}>
      <aside className="placeholder-panel" aria-label="Sidebar placeholder">
        <p className="eyebrow">Filter sidebar</p>
        <h2>Controls go here</h2>
        <p>The filter state is ready for the next UI stage.</p>
        <p>{hasActiveFilters ? 'Filters are active.' : 'No filters selected.'}</p>
      </aside>

      <section className="placeholder-panel" aria-label="Catalog placeholder">
        <p className="eyebrow">Product catalog</p>
        <h2>Catalog data</h2>
        <p role="status">
          {status === 'loading' ? 'Loading catalog data...' : 'Catalog request complete.'}
        </p>
        <p>{matched} matched of {total} products.</p>
        <p>{items.length} product records received from the API.</p>
        <p>{meta ? `${meta.categories.length} categories loaded from metadata.` : 'Loading metadata...'}</p>
        <p>Sort: {state.sort}</p>
        {error && <p role="alert">API error: {error.message}</p>}
      </section>
    </ShopLayout>
  )
}

export default App
