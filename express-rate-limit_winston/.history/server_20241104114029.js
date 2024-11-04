import express from 'express'
import 'colors'


const app = express()
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server start on port ${port}`.bgGreen)
})
