import express from 'express'
import cors from 'cors' 
import logger from './middleware/logger.js'
import router from './views/router.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()

app.use(express.json())

// Enable CORS for specific origin (localhost:3000 for React frontend)
const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests only from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow the specific methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  };

app.use(cors(corsOptions))

app.use(logger)

app.use('/api', router)

app.use(errorHandler)

export default app