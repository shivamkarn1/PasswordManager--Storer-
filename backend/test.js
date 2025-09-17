// PROGRAM TO GENERATE JWT TOKEN KEY (WHICH IS SIMPLY FOR JUST TESTING/PLACE-HOLDER)

const crypto = require('crypto');

const secret = crypto.randomBytes(64).toString('hex');
console.log(secret);
