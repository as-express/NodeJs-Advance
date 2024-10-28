import { parentPort } from 'worker_threads'

export const bigData = function(req, res) {
    let data = 0;
    for(let i = 0; i < 10000000000; i++) {
        data ++;
    }

    parentPort.postMessage(data)
    // res.status(200).send({result: data})
}

export const getMessage = function(req, res) {
    res.send('This is message endpoint of server')
}