import { getJson } from './httpClient.js'

export function fetchProducts(filters = {}, sort = 'featured', signal) {
  const params = new URLSearchParams()
  const categories = Array.isArray(filters.categories) ? filters.categories : []

  if (categories.length > 0) {
    params.set('categories', categories.join(','))
  }

  if (filters.minPrice !== null && filters.minPrice !== undefined) {
    params.set('minPrice', String(filters.minPrice))
  }

  if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
    params.set('maxPrice', String(filters.maxPrice))
  }

  if (filters.minRating !== null && filters.minRating !== undefined) {
    params.set('minRating', String(filters.minRating))
  }

  params.set('sort', sort || 'featured')

  return getJson(`/api/products?${params.toString()}`, { signal })
}

export function fetchMeta(signal) {
  return getJson('/api/products/meta', { signal })
}
