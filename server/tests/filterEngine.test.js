import assert from 'node:assert/strict'
import { test } from 'node:test'
import { filterProducts, hasActiveFilters } from '../src/services/filterEngine.js'

const products = [
  { id: 1, category: 'Electronics', price: 100, rating: 4.5 },
  { id: 2, category: 'Apparel', price: 150, rating: 3.8 },
  { id: 3, category: 'Footwear', price: 200, rating: 4.5 },
  { id: 4, category: 'Electronics', price: 250, rating: 5.0 },
  { id: 5, category: 'Beauty', price: 99, rating: 0 },
]

function getIds(items) {
  return items.map((product) => product.id)
}

test('category filters match case-insensitively and use OR semantics', () => {
  assert.deepEqual(
    getIds(filterProducts(products, { categories: ['electronics', 'FOOTWEAR'] })),
    [1, 3, 4],
  )
})

test('minimum and maximum price filters work independently and include boundaries', () => {
  assert.deepEqual(getIds(filterProducts(products, { minPrice: 200 })), [3, 4])
  assert.deepEqual(getIds(filterProducts(products, { maxPrice: 100 })), [1, 5])
  assert.deepEqual(
    getIds(filterProducts(products, { minPrice: 100, maxPrice: 200 })),
    [1, 2, 3],
  )
})

test('minimum rating filter works independently and includes its boundary', () => {
  assert.deepEqual(getIds(filterProducts(products, { minRating: 4.5 })), [1, 3, 4])
})

test('combined filter groups are ANDed together', () => {
  assert.deepEqual(
    getIds(filterProducts(products, {
      categories: ['ELECTRONICS', 'Footwear'],
      minPrice: 100,
      maxPrice: 200,
      minRating: 4.5,
    })),
    [1, 3],
  )
})

test('missing, null, NaN, and zero criteria are inactive', () => {
  const inactiveCriteria = {
    categories: null,
    minPrice: null,
    maxPrice: undefined,
    minRating: NaN,
  }

  assert.equal(hasActiveFilters(undefined), false)
  assert.equal(hasActiveFilters(null), false)
  assert.equal(hasActiveFilters({}), false)
  assert.equal(hasActiveFilters(inactiveCriteria), false)
  assert.equal(hasActiveFilters({ minRating: 0 }), false)
  assert.deepEqual(filterProducts(products, inactiveCriteria), products)
})

test('hasActiveFilters detects every supported filter group', () => {
  assert.equal(hasActiveFilters({ categories: ['Electronics'] }), true)
  assert.equal(hasActiveFilters({ minPrice: 0 }), true)
  assert.equal(hasActiveFilters({ maxPrice: 200 }), true)
  assert.equal(hasActiveFilters({ minRating: 4 }), true)
})

test('undefined and empty criteria return a complete copy', () => {
  const fromUndefined = filterProducts(products, undefined)
  const fromEmpty = filterProducts(products, {})

  assert.deepEqual(fromUndefined, products)
  assert.deepEqual(fromEmpty, products)
  assert.notStrictEqual(fromUndefined, products)
  assert.notStrictEqual(fromEmpty, products)
})

test('missing product properties are safe and zero matches return an empty array', () => {
  const incompleteProducts = [
    null,
    {},
    { id: 1, category: 'Electronics', price: 100, rating: 4.5 },
  ]

  assert.deepEqual(
    getIds(filterProducts(incompleteProducts, {
      categories: ['electronics'],
      minPrice: 100,
      minRating: 4,
    })),
    [1],
  )
  assert.deepEqual(filterProducts(products, { categories: ['Books'] }), [])
})

test('filtering does not mutate the source array', () => {
  const original = [...products]
  const filtered = filterProducts(products, { minPrice: 150 })

  assert.deepEqual(products, original)
  assert.notStrictEqual(filtered, products)
})
