const jwt = require('jsonwebtoken');

const SECRET_BUFFER = new Buffer(process.env.TWITCH_EXTENSION_SECRET_KEY, 'base64');

function authenticateExtensionToken(token) {
  return jwt.verify(token, SECRET_BUFFER);
}

module.exports = authenticateExtensionToken;
