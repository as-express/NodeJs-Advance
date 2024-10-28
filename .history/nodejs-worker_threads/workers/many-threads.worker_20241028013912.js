import { parentPort, workerData } from 'worker_threads';

let data = 0;
for (let i = 0; i < 100000000000 / workerData.count_of_threads; i++) {
    data++;
}

parentPort.postMessage(data);
