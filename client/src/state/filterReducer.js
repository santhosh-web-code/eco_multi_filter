export const initialFilterState = Object.freeze({
  categories: Object.freeze([]),
  priceRange: null,
  minRating: 0,
  sort: 'featured',
})

export function filterReducer(state = initialFilterState, action) {
  switch (action.type) {
    case 'TOGGLE_CATEGORY': {
      if (typeof action.category !== 'string' || action.category.trim() === '') {
        return state
      }

      const categories = state.categories.includes(action.category)
        ? state.categories.filter((category) => category !== action.category)
        : [...state.categories, action.category]

      return { ...state, categories }
    }
    case 'SET_PRICE_RANGE': {
      const priceRange = action.priceRange

      return {
        ...state,
        priceRange: priceRange == null
          ? null
          : { min: priceRange.min, max: priceRange.max },
      }
    }
    case 'SET_MIN_RATING': {
      const minRating = action.minRating ?? 0

      if (!Number.isInteger(minRating) || minRating < 0 || minRating > 5) {
        return state
      }

      return { ...state, minRating }
    }
    case 'SET_SORT':
      return typeof action.sort === 'string'
        ? { ...state, sort: action.sort }
        : state
    case 'RESET_FILTERS':
      return { ...initialFilterState, categories: [], sort: state.sort }
    default:
      return state
  }
}

export function selectFilterCriteria(state, priceBounds) {
  const priceRange = state?.priceRange
  const hasPriceRange = priceRange !== null
    && priceRange !== undefined
    && priceRange.min !== undefined
    && priceRange.max !== undefined
  const isFullPriceRange = hasPriceRange
    && priceBounds?.min !== undefined
    && priceBounds?.max !== undefined
    && priceRange.min === priceBounds.min
    && priceRange.max === priceBounds.max
  const selectedPriceRange = hasPriceRange && !isFullPriceRange
    ? priceRange
    : null

  return {
    categories: Array.isArray(state?.categories) ? [...state.categories] : [],
    minPrice: selectedPriceRange?.min ?? null,
    maxPrice: selectedPriceRange?.max ?? null,
    minRating: state?.minRating || null,
  }
}

export function selectHasActiveFilters(state, priceBounds) {
  const criteria = selectFilterCriteria(state, priceBounds)

  return criteria.categories.length > 0
    || criteria.minPrice !== null
    || criteria.maxPrice !== null
    || criteria.minRating !== null
}
