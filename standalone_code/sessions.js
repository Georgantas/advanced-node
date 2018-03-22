
const session = 'eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNWFiM2NjN2U1ODkxYTEyOGI3M2IyMjhmIn19';

const Keygrip = require('keygrip');

const keygrip = new Keygrip(['123123123']);

const signature = keygrip.sign('session=' + session);

console.log(keygrip.verify('session='+session, signature)); // returns true
