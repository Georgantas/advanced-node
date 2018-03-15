

// WebWorker Threads for executing threads off the event loop:
// Docs: https://www.npmjs.com/package/webworker-threads
// Note: Experimental! Usefulness is not immediately clear, since
// the event loop uses a threadpool already.
// Steph Grider's opinion: Clusters possibly better.

const express = require('express');
const app = express();
const crypto = express();
const Worker = require('webworker-threads').Worker;

app.get('/', (req, res) => {
    // Note: The function in webworker cannot access variables outside it's scope.
    // This is because it is stringified to some other location on the CPU before being executed.
    // Do not use arrow functions.
    const worker = new Worker(function() {
        this.onmessage = function() {
            let counter = 0;
            while(counter < 1e9) {
                counter++;
            }

            postMessage(counter);
        }
    });

    worker.onmessage = function(message) {
        console.log(message.data);
        res.send(String(message.data));
    }
    
    worker.postMessage();

});

app.get('/fast', (req, res) => {
    res.send('This was fast!');
});

app.listen(3000);
