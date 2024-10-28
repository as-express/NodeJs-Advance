import { Worker } from 'worker_threads';
import path from 'path';
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

function workerGenerator(threadCount) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, '../workers/many-threads.worker.js'), { // Correctly instantiate Worker
            workerData: { count_of_threads: threadCount } 
        });

        worker.on('message', (data) => {
            resolve(data);
        });
    
        worker.on('error', (error) => {
            reject(new Error('Worker error: ' + error.message));
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error('Worker stopped with exit code ' + code));
            }
        });
    });
}

export const bigDataByManyThreads = async (req, res) => {
    const threadCount = 4; // Number of threads you want to create
    const workers = [];

    for (let i = 0; i < threadCount; i++) {
        workers.push(workerGenerator(threadCount)); // Pass the thread count to the worker generator
    }

    try {
        const threads = await Promise.all(workers);
        const result = threads.reduce((sum, value) => sum + value, 0); // Sum up the results from all threads

        res.status(200).send({ result: result });
    } catch (error) {
        res.status(500).send({ error: error.message }); // Catch any errors and respond
    }
};

export const getMessage = function(req, res) {
    res.send('This is message endpoint of server');
};


