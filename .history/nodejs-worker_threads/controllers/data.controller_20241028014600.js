import { Worker } from 'worker_threads';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';

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

function workerGenerator() {
    return new Promise(resolve, reject) => {
        const threadCount = 4;

        const worker = new Worker(path.resolve(__dirname, '../workers/many-threads.worker.js', {
            workerData: {count_of_threads: threadCount}
        }));

        worker.on('message', (data) => {
            res.status(200).send({ result: data });
        });
    
        worker.on('error', (error) => {
            res.status(500).send({ error: 'Worker error: ' + error.message });
        });

    }
}

export const bigDataByManyThreads = function(req, res) {
    
};


export const getMessage = function(req, res) {
    res.send('This is message endpoint of server')
}