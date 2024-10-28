import express from 'express'
import 'colors'

const app = express()

app.listen(3000, () => {
    console.log(`Server run on port 3000`.bgGreen)
})