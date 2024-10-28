import express from "express";
import "colors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"

dotenv.config()

const app = express()
const port = 3000

app.use(express.json())
app.use('/api/auth', authRoutes)


app.listen(port, () => {
  console.log(`Server run on port ${port}`.italic.bgBlue)
})
