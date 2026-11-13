import * as productRepository from '../repositories/productRepository.js'
import { getMeta, queryProducts } from '../services/productService.js'
import { validateProductQuery } from '../validators/productQueryValidator.js'
import { ApiError } from '../utils/ApiError.js'
import { generateThumbnail } from '../utils/thumbnail.js'

export function listProducts(request, response) {
  const { criteria, sort } = validateProductQuery(request.query)
  const result = queryProducts(criteria, sort)
  const data = result.items.map((product) => ({
    ...product,
    thumbnailUrl: `/api/products/${product.id}/thumbnail.svg`,
  }))

  response.json({
    data,
    meta: {
      total: result.total,
      matched: result.matched,
      appliedFilters: result.appliedFilters,
      sort: result.sort,
    },
  })
}

export function getProductMeta(_request, response) {
  response.json(getMeta())
}

export function getThumbnail(request, response) {
  const product = productRepository.getById(request.params.id)

  if (!product) {
    throw new ApiError(404, `Product ${request.params.id} was not found.`)
  }

  response
    .set('Cache-Control', 'public, max-age=86400, immutable')
    .type('image/svg+xml')
    .send(generateThumbnail(product))
}
