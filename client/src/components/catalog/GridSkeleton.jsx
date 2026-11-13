const SKELETON_CARD_COUNT = 8

export function GridSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading products" className="grid-skeleton" role="status">
      {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
        <div aria-hidden="true" className="skeleton-card" key={index}>
          <div className="skeleton-card__media skeleton-shimmer" />
          <div className="skeleton-card__body">
            <div className="skeleton-line skeleton-line--short skeleton-shimmer" />
            <div className="skeleton-line skeleton-line--title skeleton-shimmer" />
            <div className="skeleton-line skeleton-line--rating skeleton-shimmer" />
            <div className="skeleton-line skeleton-line--price skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  )
}
