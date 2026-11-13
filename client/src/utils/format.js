const priceFormatter = new Intl.NumberFormat('en-IN', {
  currency: 'INR',
  maximumFractionDigits: 0,
  style: 'currency',
})

const countFormatter = new Intl.NumberFormat('en-IN')

export function formatPrice(value) {
  return priceFormatter.format(Number.isFinite(value) ? value : 0)
}

export function formatCount(value) {
  return countFormatter.format(Number.isFinite(value) ? value : 0)
}
