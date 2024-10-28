import express from 'express'
import dataRoutes from './routes/data.routes'
import 'colors'

const app = express()

app.use('/', dataRoutes)

app.listen(3000, () => {
    console.log(`Server run on port 3000`.bgGreen)
})