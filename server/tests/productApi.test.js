import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import app from '../src/app.js'

let server
let baseUrl

before(async () => {
  server = app.listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()))
  })
})

async function requestJson(path) {
  const response = await fetch(`${baseUrl}${path}`)
  return { response, body: await response.json() }
}

test('health endpoint returns the API status', async () => {
  const { response, body } = await requestJson('/api/health')

  assert.equal(response.status, 200)
  assert.deepEqual(body, { status: 'ok' })
})

test('product endpoint returns all products and thumbnail URLs without filters', async () => {
  const { response, body } = await requestJson('/api/products')

  assert.equal(response.status, 200)
  assert.equal(body.data.length, 60)
  assert.equal(body.meta.total, 60)
  assert.equal(body.meta.matched, 60)
  assert.deepEqual(body.meta.appliedFilters, {
    categories: [],
    minPrice: null,
    maxPrice: null,
    minRating: null,
  })
  assert.equal(body.meta.sort, 'featured')
  assert.equal(body.data[0].thumbnailUrl, '/api/products/1/thumbnail.svg')
})

test('metadata endpoint includes categories, bounds, histogram, and sort options', async () => {
  const { response, body } = await requestJson('/api/products/meta')

  assert.equal(response.status, 200)
  assert.equal(body.categories.length, 6)
  assert.ok(body.categories.every((category) => category.count === 10))
  assert.deepEqual(body.priceBounds, { min: 99, max: 79999 })
  assert.equal(body.priceHistogram.length, 12)
  assert.equal(
    body.priceHistogram.reduce((total, bucket) => total + bucket.count, 0),
    60,
  )
  assert.deepEqual(body.sortOptions, [
    'featured',
    'price_asc',
    'price_desc',
    'rating_desc',
    'name_asc',
  ])
})

test('category query filters products', async () => {
  const { response, body } = await requestJson('/api/products?categories=%20electronics%20')

  assert.equal(response.status, 200)
  assert.equal(body.meta.matched, 10)
  assert.ok(body.data.every((product) => product.category === 'Electronics'))
})

test('combined filters, swapped price bounds, and sorting are applied', async () => {
  const { response, body } = await requestJson(
    '/api/products?categories=Electronics&minPrice=6000&maxPrice=2000&minRating=4&sort=price_asc',
  )

  assert.equal(response.status, 200)
  assert.deepEqual(body.data.map((product) => product.id), [1, 3, 4])
  assert.equal(body.meta.matched, 3)
  assert.deepEqual(body.meta.appliedFilters, {
    categories: ['Electronics'],
    minPrice: 2000,
    maxPrice: 6000,
    minRating: 4,
  })
  assert.equal(body.meta.sort, 'price_asc')
})

test('sort query applies descending price order and unknown sort defaults to featured', async () => {
  const descending = await requestJson('/api/products?sort=price_desc')
  const fallback = await requestJson('/api/products?sort=unknown')

  assert.equal(descending.body.data[0].id, 10)
  assert.equal(descending.body.meta.sort, 'price_desc')
  assert.equal(fallback.body.data[0].id, 1)
  assert.equal(fallback.body.meta.sort, 'featured')
})

test('valid filters can return zero matches', async () => {
  const { response, body } = await requestJson('/api/products?categories=Books&minPrice=1000')

  assert.equal(response.status, 200)
  assert.deepEqual(body.data, [])
  assert.equal(body.meta.matched, 0)
})

test('invalid categories, prices, and ratings return consistent 400 errors', async () => {
  const invalidPaths = [
    '/api/products?categories=Unknown',
    '/api/products?minPrice=abc',
    '/api/products?maxPrice=-1',
    '/api/products?minRating=2.5',
  ]

  for (const path of invalidPaths) {
    const { response, body } = await requestJson(path)

    assert.equal(response.status, 400)
    assert.equal(body.error.status, 400)
    assert.ok(body.error.message)
    assert.equal('stack' in body.error, false)
  }
})

test('unknown routes return the consistent error response', async () => {
  const { response, body } = await requestJson('/api/missing')

  assert.equal(response.status, 404)
  assert.deepEqual(body.error, {
    message: 'Route not found: GET /api/missing',
    status: 404,
  })
})

test('thumbnail endpoint returns deterministic cached SVG', async () => {
  const firstResponse = await fetch(`${baseUrl}/api/products/1/thumbnail.svg`)
  const firstSvg = await firstResponse.text()
  const secondResponse = await fetch(`${baseUrl}/api/products/1/thumbnail.svg`)
  const secondSvg = await secondResponse.text()

  assert.equal(firstResponse.status, 200)
  assert.match(firstResponse.headers.get('content-type'), /^image\/svg\+xml/)
  assert.match(firstResponse.headers.get('cache-control'), /max-age=86400/)
  assert.match(firstSvg, /<svg/)
  assert.match(firstSvg, /Wireless Headphones/)
  assert.equal(firstSvg, secondSvg)
})

test('unknown thumbnail IDs return a 404 API error', async () => {
  const { response, body } = await requestJson('/api/products/999/thumbnail.svg')

  assert.equal(response.status, 404)
  assert.equal(body.error.status, 404)
})
