
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
