import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  filterReducer,
  initialFilterState,
  selectFilterCriteria,
  selectHasActiveFilters,
} from '../src/state/filterReducer.js'

test('category actions toggle selected categories without mutating prior state', () => {
  const selected = filterReducer(initialFilterState, {
    type: 'TOGGLE_CATEGORY',
    category: 'Books',
  })
  const deselected = filterReducer(selected, {
    type: 'TOGGLE_CATEGORY',
    category: 'Books',
  })

  assert.deepEqual(selected.categories, ['Books'])
  assert.deepEqual(deselected.categories, [])
  assert.deepEqual(initialFilterState.categories, [])
})

test('filter actions update price range, rating, and sort', () => {
  const withRange = filterReducer(initialFilterState, {
    type: 'SET_PRICE_RANGE',
    priceRange: { min: 500, max: 2500 },
  })
  const withRating = filterReducer(withRange, {
    type: 'SET_MIN_RATING',
    minRating: 4,
  })
  const withSort = filterReducer(withRating, {
    type: 'SET_SORT',
    sort: 'price_asc',
  })

  assert.deepEqual(withSort, {
    categories: [],
    priceRange: { min: 500, max: 2500 },
    minRating: 4,
    sort: 'price_asc',
  })
})

test('reset clears filters while preserving sorting', () => {
  const filtered = {
    categories: ['Books'],
    priceRange: { min: 500, max: 2500 },
    minRating: 4,
    sort: 'price_desc',
  }
  const reset = filterReducer(filtered, { type: 'RESET_FILTERS' })

  assert.deepEqual(reset, {
    categories: [],
    priceRange: null,
    minRating: 0,
    sort: 'price_desc',
  })
})

test('full backend price range is inactive in filter selectors', () => {
  const state = {
    ...initialFilterState,
    priceRange: { min: 99, max: 79999 },
  }
  const criteria = selectFilterCriteria(state, { min: 99, max: 79999 })

  assert.deepEqual(criteria, {
    categories: [],
    minPrice: null,
    maxPrice: null,
    minRating: null,
  })
  assert.equal(selectHasActiveFilters(state, { min: 99, max: 79999 }), false)
})

test('partial price ranges and other filter values are active', () => {
  const state = {
    categories: ['Electronics'],
    priceRange: { min: 500, max: 2500 },
    minRating: 4,
    sort: 'featured',
  }

  assert.equal(selectHasActiveFilters(state, { min: 99, max: 79999 }), true)
  assert.deepEqual(selectFilterCriteria(state, { min: 99, max: 79999 }), {
    categories: ['Electronics'],
    minPrice: 500,
    maxPrice: 2500,
    minRating: 4,
  })
})
