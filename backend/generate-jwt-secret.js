// Quick script to generate a secure JWT secret
const crypto = require('crypto');

const secret = crypto.randomBytes(64).toString('hex');

console.log('\n🔐 Your Secure JWT Secret:\n');
console.log(secret);
console.log('\n✅ Copy this and use it in your .env file!\n');

