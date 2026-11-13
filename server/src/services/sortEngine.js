export const SORT_OPTIONS = Object.freeze([
  'featured',
  'price_asc',
  'price_desc',
  'rating_desc',
  'name_asc',
])

function compareNumbers(firstValue, secondValue, direction = 1) {
  const firstIsValid = Number.isFinite(firstValue)
  const secondIsValid = Number.isFinite(secondValue)

  if (!firstIsValid && !secondIsValid) {
    return 0
  }

  if (!firstIsValid) {
    return 1
  }

  if (!secondIsValid) {
    return -1
  }

  return (firstValue - secondValue) * direction
}

function compareProducts(firstProduct, secondProduct, sortKey) {
  switch (sortKey) {
    case 'price_asc':
      return compareNumbers(firstProduct?.price, secondProduct?.price)
    case 'price_desc':
      return compareNumbers(firstProduct?.price, secondProduct?.price, -1)
    case 'rating_desc':
      return compareNumbers(firstProduct?.rating, secondProduct?.rating, -1)
        || compareNumbers(firstProduct?.reviewCount, secondProduct?.reviewCount, -1)
        || compareNumbers(firstProduct?.price, secondProduct?.price)
    case 'name_asc': {
      const firstName = typeof firstProduct?.name === 'string' ? firstProduct.name : ''
      const secondName = typeof secondProduct?.name === 'string' ? secondProduct.name : ''

      return firstName.localeCompare(secondName, 'en', { sensitivity: 'base' })
    }
    default:
      return 0
  }
}

export function sortProducts(products, sortKey) {
  const inventory = Array.isArray(products) ? products : []

  if (!SORT_OPTIONS.includes(sortKey) || sortKey === 'featured') {
    return [...inventory]
  }

  return inventory
    .map((product, index) => ({ product, index }))
    .sort((first, second) => {
      const result = compareProducts(first.product, second.product, sortKey)
      return result || first.index - second.index
    })
    .map(({ product }) => product)
}
