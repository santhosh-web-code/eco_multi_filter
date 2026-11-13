import assert from 'node:assert/strict'
import { test } from 'node:test'
import products from '../src/data/products.js'
import { getCategories, getPriceBounds } from '../src/repositories/productRepository.js'
import { getMeta, queryProducts } from '../src/services/productService.js'

test('queryProducts filters before sorting and returns the response shape', () => {
  const criteria = {
    categories: ['Electronics'],
    minPrice: 1500,
    maxPrice: 7999,
    minRating: 4.5,
  }
  const result = queryProducts(criteria, 'price_desc')

  assert.deepEqual(result.items.map((product) => product.id), [8, 4, 1])
  assert.equal(result.total, products.length)
  assert.equal(result.matched, 3)
  assert.strictEqual(result.appliedFilters, criteria)
  assert.equal(result.sort, 'price_desc')
})

test('getMeta returns category counts, price bounds, histogram, and sort options', () => {
  const meta = getMeta()

  assert.deepEqual(
    meta.categories,
    getCategories().map((category) => ({ category, count: 10 })),
  )
  assert.deepEqual(meta.priceBounds, getPriceBounds())
  assert.equal(meta.priceHistogram.length, 12)
  assert.equal(
    meta.priceHistogram.reduce((total, bucket) => total + bucket.count, 0),
    products.length,
  )
  assert.equal(meta.priceHistogram[0].min, meta.priceBounds.min)
  assert.equal(meta.priceHistogram[11].max, meta.priceBounds.max)
  assert.deepEqual(meta.sortOptions, [
    'featured',
    'price_asc',
    'price_desc',
    'rating_desc',
    'name_asc',
  ])
})
