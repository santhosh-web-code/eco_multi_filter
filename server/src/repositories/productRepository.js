import products from '../data/products.js'

export function getAll() {
  return products
}

export function getById(id) {
  return products.find((product) => product.id === Number(id)) ?? null
}

export function getCategories() {
  return [...new Set(products.map((product) => product.category))]
    .sort((first, second) => first.localeCompare(second))
}

export function getPriceBounds() {
  const prices = products.map((product) => product.price)

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}
