import { parentPort } from 'worker_threads';

let data = 0;
for (let i = 0; i < 10000000000; i++) {
    data++;
}

parentPort.postMessage(data);
