import { Worker } from 'worker_threads'

export const bigData = function(req, res) {
    const worker = new Worker('../workers/data.worker.js')

    worker.onmessage((event) => {
        res.status(200).send({result: event.data})
    })

    worker.onerror((error) => {
        res.status(500).send({error: error.message})
    })
}

export const getMessage = function(req, res) {
    res.send('This is message endpoint of server')
}