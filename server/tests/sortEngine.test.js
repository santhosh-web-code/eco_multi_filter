import assert from 'node:assert/strict'
import { test } from 'node:test'
import { filterProducts } from '../src/services/filterEngine.js'
import { SORT_OPTIONS, sortProducts } from '../src/services/sortEngine.js'

const products = [
  { id: 'b', name: 'Beta', price: 200, rating: 4.8, reviewCount: 10 },
  { id: 'a', name: 'Alpha', price: 100, rating: 4.8, reviewCount: 10 },
  { id: 'c', name: 'Gamma', price: 100, rating: 4.9, reviewCount: 2 },
  { id: 'd', name: 'Delta', price: 100, rating: 4.8, reviewCount: 20 },
  { id: 'e', name: 'Epsilon', price: 300, rating: 3.7, reviewCount: 99 },
]

function getIds(items) {
  return items.map((product) => product.id)
}

test('SORT_OPTIONS lists every supported sort key', () => {
  assert.deepEqual(SORT_OPTIONS, [
    'featured',
    'price_asc',
    'price_desc',
    'rating_desc',
    'name_asc',
  ])
})

test('featured preserves input order and returns a copy', () => {
  const sorted = sortProducts(products, 'featured')

  assert.deepEqual(getIds(sorted), ['b', 'a', 'c', 'd', 'e'])
  assert.notStrictEqual(sorted, products)
})

test('price sorting orders low to high and high to low', () => {
  assert.deepEqual(getIds(sortProducts(products, 'price_asc')), ['a', 'c', 'd', 'b', 'e'])
  assert.deepEqual(getIds(sortProducts(products, 'price_desc')), ['e', 'b', 'a', 'c', 'd'])
})

test('rating sorting uses review count and price to break ties', () => {
  assert.deepEqual(getIds(sortProducts(products, 'rating_desc')), ['c', 'd', 'a', 'b', 'e'])
})

test('name sorting is alphabetical', () => {
  assert.deepEqual(getIds(sortProducts(products, 'name_asc')), ['a', 'b', 'd', 'e', 'c'])
})

test('unknown sort keys fall back to featured order', () => {
  const sorted = sortProducts(products, 'unknown')

  assert.deepEqual(getIds(sorted), ['b', 'a', 'c', 'd', 'e'])
  assert.notStrictEqual(sorted, products)
})

test('sorting never mutates the source array', () => {
  const original = [...products]

  for (const sortKey of SORT_OPTIONS) {
    sortProducts(products, sortKey)
  }

  assert.deepEqual(products, original)
})

test('filter-then-sort returns only matches in the requested order', () => {
  const filtered = filterProducts(products, { minPrice: 100, maxPrice: 200 })

  assert.deepEqual(getIds(sortProducts(filtered, 'price_desc')), ['b', 'a', 'c', 'd'])
})
