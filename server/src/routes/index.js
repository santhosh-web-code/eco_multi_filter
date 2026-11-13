import { Router } from 'express'
import healthRoutes from './health.routes.js'
import productRoutes from './productRoutes.js'

const router = Router()

router.use('/health', healthRoutes)
router.use('/products', productRoutes)

export default router
