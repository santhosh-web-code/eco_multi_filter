import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { CLIENT_ORIGIN } from './config/env.js'
import apiRoutes from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'

const app = express()

app.use(cors({ origin: CLIENT_ORIGIN }))
app.use(express.json())
app.use(morgan('dev'))
app.use('/api', apiRoutes)
app.use(notFound)
app.use(errorHandler)

export default app
