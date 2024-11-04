import 'colors'
import express from 'express'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express'
import appRoutes from './routes/app.routes.js'
import { limit } from './utils/express-rate-limit.util.js';

const app = express()
const port = process.env.PORT || 3000


const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Simple Winston Logging Illustrate API',        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./routes/*.js'],
};
const swaggerDoc = swaggerJSDoc(swaggerOptions)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.use(limit)
app.use('/', appRoutes)


app.listen(port, () => {
    console.log(`Server start on port ${port}`.bgGreen)
})
