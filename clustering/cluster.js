import cluster from 'cluster'
import os from 'os'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const countOfCpu = os.cpus().length

console.log(`Cpus count ${countOfCpu}`)
cluster.setupPrimary({
    exec: __dirname + '/main.js'
})

for(let i = 0; i < countOfCpu; i++) {
    cluster.fork()
} 

cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid}`)
    console.log('Starting another worker')
    cluster.fork()
})
