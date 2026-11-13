function toFiniteNumber(value) {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return null
  }

  if (typeof value === 'string' && value.trim() === '') {
    return null
  }

  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function normalizeCriteria(criteria) {
  const categories = Array.isArray(criteria?.categories)
    ? criteria.categories
      .filter((category) => typeof category === 'string' && category.trim() !== '')
      .map((category) => category.trim().toLowerCase())
    : []
  const minRating = toFiniteNumber(criteria?.minRating)

  return {
    categories: new Set(categories),
    minPrice: toFiniteNumber(criteria?.minPrice),
    maxPrice: toFiniteNumber(criteria?.maxPrice),
    minRating: minRating === 0 ? null : minRating,
  }
}

function hasActiveCriteria(normalized) {
  return normalized.categories.size > 0
    || normalized.minPrice !== null
    || normalized.maxPrice !== null
    || normalized.minRating !== null
}

export function hasActiveFilters(criteria) {
  return hasActiveCriteria(normalizeCriteria(criteria))
}

export function filterProducts(products, criteria) {
  const inventory = Array.isArray(products) ? products : []
  const normalized = normalizeCriteria(criteria)

  if (!hasActiveCriteria(normalized)) {
    return [...inventory]
  }

  const filteredProducts = []

  for (const product of inventory) {
    if (product === null || typeof product !== 'object') {
      continue
    }

    if (normalized.categories.size > 0) {
      const category = product.category

      if (
        typeof category !== 'string'
        || !normalized.categories.has(category.toLowerCase())
      ) {
        continue
      }
    }

    const price = toFiniteNumber(product.price)

    if (
      normalized.minPrice !== null
      && (price === null || price < normalized.minPrice)
    ) {
      continue
    }

    if (
      normalized.maxPrice !== null
      && (price === null || price > normalized.maxPrice)
    ) {
      continue
    }

    const rating = toFiniteNumber(product.rating)

    if (
      normalized.minRating !== null
      && (rating === null || rating < normalized.minRating)
    ) {
      continue
    }

    filteredProducts.push(product)
  }

  return filteredProducts
}
