import { parentPort } from 'worker_threads'


export const bigData = function(req, res) {
    let data;
    for(let i = 0; i < 1000000; i++) {
        data ++;
    }

    res.status(200).send(data)
}

export const getMessage = function(req, res) {
    console.log('this is message endpoint of server')
}