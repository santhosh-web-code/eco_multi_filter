import { getCategories } from '../repositories/productRepository.js'
import { SORT_OPTIONS } from '../services/sortEngine.js'
import { ApiError } from '../utils/ApiError.js'

const categoriesByLowercaseName = new Map(
  getCategories().map((category) => [category.toLowerCase(), category]),
)

function parseCategories(value) {
  if (value === undefined || value === '') {
    return []
  }

  if (typeof value !== 'string') {
    throw new ApiError(400, 'categories must be a comma-separated string.')
  }

  const requestedCategories = value
    .split(',')
    .map((category) => category.trim())
    .filter(Boolean)
  const categories = []

  for (const requestedCategory of requestedCategories) {
    const category = categoriesByLowercaseName.get(requestedCategory.toLowerCase())

    if (!category) {
      const validCategories = [...categoriesByLowercaseName.values()].join(', ')
      throw new ApiError(
        400,
        `Unknown category "${requestedCategory}". Valid categories: ${validCategories}.`,
      )
    }

    if (!categories.includes(category)) {
      categories.push(category)
    }
  }

  return categories
}

function parseOptionalNumber(value, name) {
  if (value === undefined) {
    return null
  }

  if (typeof value !== 'string' || value.trim() === '') {
    throw new ApiError(400, `${name} must be a valid number.`)
  }

  const number = Number(value)

  if (!Number.isFinite(number)) {
    throw new ApiError(400, `${name} must be a valid number.`)
  }

  return number
}

export function validateProductQuery(query = {}) {
  const categories = parseCategories(query.categories)
  let minPrice = parseOptionalNumber(query.minPrice, 'minPrice')
  let maxPrice = parseOptionalNumber(query.maxPrice, 'maxPrice')
  const requestedRating = parseOptionalNumber(query.minRating, 'minRating')

  for (const [name, price] of [['minPrice', minPrice], ['maxPrice', maxPrice]]) {
    if (price !== null && price < 0) {
      throw new ApiError(400, `${name} must be greater than or equal to 0.`)
    }
  }

  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    const previousMinPrice = minPrice
    minPrice = maxPrice
    maxPrice = previousMinPrice
  }

  if (
    requestedRating !== null
    && (!Number.isInteger(requestedRating) || requestedRating < 0 || requestedRating > 5)
  ) {
    throw new ApiError(400, 'minRating must be an integer from 0 to 5.')
  }

  const minRating = requestedRating === 0 ? null : requestedRating
  const requestedSort = query.sort
  const sort = SORT_OPTIONS.includes(requestedSort) ? requestedSort : 'featured'

  return {
    criteria: {
      categories,
      minPrice,
      maxPrice,
      minRating,
    },
    sort,
  }
}
