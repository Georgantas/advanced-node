
const https = require('https');

const start = Date.now();

function doRequest(){
    https.request('https://www.google.com', res => {
        res.on('data', () => {});
        res.on('end', () => {
            console.log(Date.now() - start);
        });
    }).end();
}

// libuv deligates the following HTTP requests to the OS
// falls into the pendingOSTasks array in the event loop
// does not make use of the threadpool
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
