import { Worker } from 'worker_threads';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const threadCount = 4;

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
        const worker = new Worker(path.resolve(__dirname, '../workers/many-threads.worker.js', {
            workerData: {count_of_threads: threadCount}
        }));

        worker.on('message', (data) => {
            res.resolve()
        });
    
        worker.on('error', (error) => {
            res.reject()
        });

    }
}

export const bigDataByManyThreads = async(req, res) {
    const workers = [];

    for(let i = 0; i < threadCount; i++) {
        workers.push(workerGenerator())
    }

    const threads = await Promise.all(workers)
    const result = threads[0] + threads[1] + threads[2] + threads[3]
};


export const getMessage = function(req, res) {
    res.send('This is message endpoint of server')
}