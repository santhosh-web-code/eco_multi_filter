import assert from 'node:assert/strict'
import { test } from 'node:test'
import { formatCount, formatPrice } from '../src/utils/format.js'

test('formats prices and counts with Indian digit grouping', () => {
  assert.equal(formatPrice(79999), '₹79,999')
  assert.equal(formatCount(1234567), '12,34,567')
})

test('formats invalid numeric values safely', () => {
  assert.equal(formatPrice(Number.NaN), '₹0')
  assert.equal(formatCount(Number.POSITIVE_INFINITY), '0')
})
