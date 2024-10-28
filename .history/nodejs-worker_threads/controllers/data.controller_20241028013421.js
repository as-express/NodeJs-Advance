import path from 'path'
import { Worker } from 'worker_threads'
import { fileURLToPath } from 'url';

export const bigData = function(req, res) {
    const worker = new Worker(path.resolve(__dirname, '../workers/data.worker.js'))

    worker.on('message', (event) => {
        res.status(200).send({result: event.data})
    })

    worker.on('error', (error) => {
        res.status(500).send({error: error.message})
    })
}

export const getMessage = function(req, res) {
    res.send('This is message endpoint of server')
}