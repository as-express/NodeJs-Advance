import express from 'express'
import 'colors'


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


app.listen(port, () => {
    console.log(`Server start on port ${port}`.bgGreen)
})
