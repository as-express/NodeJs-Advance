import { parentPort } from 'worker_threads'

export const bigData = function(req, res) {
    const worker = new Worker('../workers/data.worker.js')

    worker.onmessage((event) => {
        res.status(200).send({result: event.data})
    })

}

export const getMessage = function(req, res) {
    res.send('This is message endpoint of server')
}