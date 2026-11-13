function normalizeRating(rating) {
  if (!Number.isFinite(rating)) {
    return 0
  }

  return Math.min(5, Math.max(0, Math.round(rating * 2) / 2))
}

export function StarRating({ rating }) {
  const normalizedRating = normalizeRating(rating)
  const label = `${Number.isInteger(normalizedRating)
    ? normalizedRating
    : normalizedRating.toFixed(1)} out of 5 stars`

  return (
    <span aria-label={label} className="star-rating" role="img">
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.min(1, Math.max(0, normalizedRating - index))

        return (
          <span aria-hidden="true" className="star-rating__star" key={index}>
            <span className="star-rating__empty">★</span>
            <span
              className="star-rating__fill"
              style={{ width: `${fill * 100}%` }}
            >
              ★
            </span>
          </span>
        )
      })}
    </span>
  )
}
