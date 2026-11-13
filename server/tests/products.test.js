import assert from 'node:assert/strict'
import { test } from 'node:test'
import products from '../src/data/products.js'
import {
  getAll,
  getById,
  getCategories,
  getPriceBounds,
} from '../src/repositories/productRepository.js'

const validCategories = [
  'Electronics',
  'Apparel',
  'Footwear',
  'Home & Kitchen',
  'Books',
  'Beauty',
]
const validTags = ['New', 'Bestseller', 'Limited', null]

test('master inventory contains 60 valid, immutable products', () => {
  assert.equal(products.length, 60)
  assert.equal(new Set(products.map((product) => product.id)).size, 60)
  assert.ok(Object.isFrozen(products))

  for (const product of products) {
    assert.ok(Object.isFrozen(product))
    assert.ok(Number.isInteger(product.id))
    assert.ok(validCategories.includes(product.category))
    assert.ok(Number.isInteger(product.price))
    assert.ok(product.price >= 99 && product.price <= 79999)
    assert.ok(Number.isFinite(product.rating))
    assert.ok(product.rating >= 1 && product.rating <= 5)
    assert.ok(Number.isInteger(product.rating * 10))
    assert.ok(Number.isInteger(product.reviewCount))
    assert.ok(product.reviewCount >= 0)
    assert.ok(validTags.includes(product.tag))
  }

  for (const category of validCategories) {
    const categoryCount = products.filter(
      (product) => product.category === category,
    ).length

    assert.ok(categoryCount >= 8 && categoryCount <= 12)
  }
})

test('repository exposes the master inventory and retrieves products', () => {
  assert.strictEqual(getAll(), products)
  assert.strictEqual(getById(1), products[0])
  assert.strictEqual(getById('60'), products[59])
  assert.equal(getById(61), null)
})

test('repository returns unique sorted categories and calculated price bounds', () => {
  assert.deepEqual(getCategories(), [...validCategories].sort((a, b) => a.localeCompare(b)))

  const prices = products.map((product) => product.price)
  assert.deepEqual(getPriceBounds(), {
    min: Math.min(...prices),
    max: Math.max(...prices),
  })
})
