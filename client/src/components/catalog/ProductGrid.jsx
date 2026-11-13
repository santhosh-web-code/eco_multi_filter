import { GridSkeleton } from './GridSkeleton.jsx'
import { ProductCard } from './ProductCard.jsx'

export function ProductGrid({ items, status }) {
  if (status === 'loading' && items.length === 0) {
    return <GridSkeleton />
  }

  if (items.length === 0) {
    return null
  }

  const isRefreshing = status === 'loading'

  return (
    <div className="product-grid-region" aria-busy={isRefreshing}>
      {isRefreshing && (
        <div
          aria-label="Refreshing products"
          className="catalog-progress"
          role="progressbar"
        >
          <span className="catalog-progress__bar" />
        </div>
      )}
      <div className={`product-grid${isRefreshing ? ' is-refreshing' : ''}`}>
        {items.map((product, index) => (
          <ProductCard index={index} key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
