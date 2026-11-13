import * as productRepository from '../repositories/productRepository.js'
import { filterProducts } from './filterEngine.js'
import { SORT_OPTIONS, sortProducts } from './sortEngine.js'

const HISTOGRAM_BUCKET_COUNT = 12

export function queryProducts(criteria, sortKey = 'featured') {
  const all = productRepository.getAll()

  // Filtering first limits sorting to matching products and preserves the required business pipeline.
  const filtered = filterProducts(all, criteria)
  const sorted = sortProducts(filtered, sortKey)

  return {
    items: sorted,
    total: all.length,
    matched: sorted.length,
    appliedFilters: criteria,
    sort: sortKey,
  }
}

function createPriceHistogram(products, priceBounds) {
  const priceRange = priceBounds.max - priceBounds.min + 1
  const buckets = Array.from({ length: HISTOGRAM_BUCKET_COUNT }, (_, index) => {
    const min = priceBounds.min + Math.floor((index * priceRange) / HISTOGRAM_BUCKET_COUNT)
    const max = priceBounds.min
      + Math.floor(((index + 1) * priceRange) / HISTOGRAM_BUCKET_COUNT)
      - 1

    return {
      min,
      max: index === HISTOGRAM_BUCKET_COUNT - 1 ? priceBounds.max : max,
      count: 0,
    }
  })

  for (const product of products) {
    const bucketIndex = Math.min(
      HISTOGRAM_BUCKET_COUNT - 1,
      Math.floor(((product.price - priceBounds.min) * HISTOGRAM_BUCKET_COUNT) / priceRange),
    )
    buckets[bucketIndex].count += 1
  }

  return buckets
}

export function getMeta() {
  const all = productRepository.getAll()
  const categoryCounts = new Map()

  for (const product of all) {
    categoryCounts.set(
      product.category,
      (categoryCounts.get(product.category) ?? 0) + 1,
    )
  }

  const priceBounds = productRepository.getPriceBounds()

  return {
    categories: productRepository.getCategories().map((category) => ({
      category,
      count: categoryCounts.get(category) ?? 0,
    })),
    priceBounds,
    priceHistogram: createPriceHistogram(all, priceBounds),
    sortOptions: SORT_OPTIONS,
  }
}
