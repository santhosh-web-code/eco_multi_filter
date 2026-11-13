import { Router } from 'express'
import {
  getProductMeta,
  getThumbnail,
  listProducts,
} from '../controllers/productController.js'

const router = Router()

router.get('/meta', getProductMeta)
router.get('/:id/thumbnail.svg', getThumbnail)
router.get('/', listProducts)

export default router
