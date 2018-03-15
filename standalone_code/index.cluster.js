
// to make benchmark interpretation easier
// each process has one thread
process.env.UV_THREADPOOL_SIZE = 1;

const cluster = require('cluster');

// console.log(cluster.isMaster); // true for the master process (ie.: the cluster manager)

// Is the file being executed in master mode?
if(cluster.isMaster) {
    // Cause index.js to be executed *again* but in child mode

    // Create four processes (ie.: four different threadpools)
    // matching this with the number of cores of the CPU is a good rule of thumb.
    // In practice use pm2: https://github.com/Unitech/pm2
    cluster.fork();
    cluster.fork();
    cluster.fork();
    cluster.fork();
} else {
    // Child, will act like a server and do nothing else
    const express = require('express');
    const app = express();
    const crypto = express();
    
    // function doWork(duration) {
    //     const start = Date.now();
    //     while(Date.now() - start < duration) {}
    // }
    
    app.get('/', (req, res) => {
        // doWork(5000);
        crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
            res.send('Hi there');
        });
    });

    app.get('/fast', (req, res) => {
        res.send('This was fast!');
    });
    
    app.listen(3000);    
}
