import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import routes from './routes/index.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'

export const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api', routes)

app.use(notFoundHandler)
app.use(errorHandler)
