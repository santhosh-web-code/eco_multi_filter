import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fetchMeta, fetchProducts } from '../src/api/productApi.js'

async function withMockFetch(mockFetch, callback) {
  const originalFetch = globalThis.fetch
  globalThis.fetch = mockFetch

  try {
    await callback()
  } finally {
    globalThis.fetch = originalFetch
  }
}

test('fetchProducts builds a query string and passes the abort signal', async () => {
  const controller = new AbortController()
  let requestUrl
  let requestOptions

  await withMockFetch(async (url, options) => {
    requestUrl = url
    requestOptions = options
    return new Response(JSON.stringify({ data: [], meta: { matched: 0 } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }, async () => {
    const result = await fetchProducts({
      categories: ['Home & Kitchen', 'Books'],
      minPrice: 200,
      maxPrice: 900,
      minRating: 4,
    }, 'price_asc', controller.signal)

    assert.deepEqual(result, { data: [], meta: { matched: 0 } })
  })

  const url = new URL(requestUrl, 'http://localhost')
  assert.equal(url.pathname, '/api/products')
  assert.equal(url.searchParams.get('categories'), 'Home & Kitchen,Books')
  assert.equal(url.searchParams.get('minPrice'), '200')
  assert.equal(url.searchParams.get('maxPrice'), '900')
  assert.equal(url.searchParams.get('minRating'), '4')
  assert.equal(url.searchParams.get('sort'), 'price_asc')
  assert.strictEqual(requestOptions.signal, controller.signal)
})

test('fetchMeta requests the metadata endpoint', async () => {
  let requestUrl

  await withMockFetch(async (url) => {
    requestUrl = url
    return new Response(JSON.stringify({ categories: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }, async () => {
    assert.deepEqual(await fetchMeta(), { categories: [] })
  })

  assert.equal(requestUrl, '/api/products/meta')
})

test('HTTP errors surface the API error message', async () => {
  await withMockFetch(async () => new Response(
    JSON.stringify({ error: { message: 'Unknown category "Toys".', status: 400 } }),
    { status: 400, headers: { 'Content-Type': 'application/json' } },
  ), async () => {
    await assert.rejects(
      fetchProducts({ categories: ['Toys'] }),
      { message: 'Unknown category "Toys".', status: 400 },
    )
  })
})
