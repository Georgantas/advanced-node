
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

function doRequest(){
    https.request('https://www.google.com', res => {
        res.on('data', () => {});
        res.on('end', () => {
            console.log("Request:", Date.now() - start);
        });
    }).end();
}

function doHash() {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
        console.log('Hash:', Date.now() - start);
    });
}

// HTTP requests happen outside of the threadpool
doRequest();

// Interesting: the following call will take about 2 seconds to complete (very long for an FS read)
// and the order of the console.logs will be Req, Hash, FS, Hash, Hash, Hash.
// Note: The majority of the FS module makes use of the threadpool
// The reason for this behavior is that FS needs to make two requests to the HDD
// to read the file. After it makes the first request, it will take on a different task.
// (in this case, working on the hashing function). Once one of the other hashing
// threads finishes, the FS takes its place. The follow up request is relatively quick and
// finishes quicker than the remaining hash threads. This explains the output.
fs.readFile('multitask.js', 'utf8', () => {
    console.log("FS:", Date.now() - start);
});

doHash();
doHash();
doHash();
doHash();
