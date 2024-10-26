import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import 'colors'
import cookieParser from 'cookie-parser'

import authRoutes from './src/routes/auth.routes.js'

dotenv.config()


const app = express()
const port = process.env.PORT || 4000
const url = process.env.URL

app.use(cookieParser())
app.use(express.json())
app.use('/api/auth', authRoutes)

const connect = async () => {
    await mongoose.connect(url)
    .then(console.log('DB is Connected successfully'.italic.bgGreen))

    app.listen(port, () => {
        console.log(`Server is run on port ${port}`.italic.bgBlue)
    })
}

connect()
export default app