import express from 'express'
import 'colors'


const app = express()
const port = process.env.PORT || 3000


const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Simple Winston Logging Illustrate API',
            version: '1.0.0', // Version of the API
            description: 'API documentation using Swagger', // Description
        },
        servers: [
            {
                url: 'http://localhost:3000', // Server URL
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

app.listen(port, () => {
    console.log(`Server start on port ${port}`.bgGreen)
})
