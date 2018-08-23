const jwt = require('jsonwebtoken');

const secretKey = process.env.TWITCH_EXTENSION_SECRET_KEY || 'test';
const SECRET_BUFFER = new Buffer(secretKey, 'base64');

function authenticateExtensionToken(token) {
  return jwt.verify(token, SECRET_BUFFER);
}

module.exports = authenticateExtensionToken;
