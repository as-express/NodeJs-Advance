// import path from 'path'
// import { Worker } from 'worker_threads'

// export const bigData = function(req, res) {
//     const worker = new Worker('../workers/data.worker.js')

//     worker.on('message', (event) => {
//         res.status(200).send({result: event.data})
//     })

//     worker.on('error', (error) => {
//         res.status(500).send({error: error.message})
//     })
// }

import path from 'path';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';

// Create __filename and __dirname for module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const bigData = function(req, res) {
    const worker = new Worker(path.resolve(__dirname, '../workers/data.worker.js'));

    worker.on('message', (data) => {
        res.status(200).send({ result: data });
    });

    worker.on('error', (error) => {
        res.status(500).send({ error: 'Worker error: ' + error.message });
    });
};


export const getMessage = function(req, res) {
    res.send('This is message endpoint of server')
}