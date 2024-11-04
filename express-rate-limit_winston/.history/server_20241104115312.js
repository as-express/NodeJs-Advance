import express from 'express'
import 'colors'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express'

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
app.use('/docs', swaggerUi)

app.listen(port, () => {
    console.log(`Server start on port ${port}`.bgGreen)
})
