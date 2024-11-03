import express from 'express'
import 'colors'


const app = express()

app.get('/data', (req, res) => {
    let data = 0;
    for(let i = 0;i< 60_000_000; i++) {
        data ++;
    }

    res.status(200)
    .send({message: 'The result is ',result: data})
})

app.listen(3000, () => {
    console.log('Server run on port 3000'.bgGreen)
})