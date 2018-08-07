const jwt = require('jsonwebtoken');

const SECRET_BUFFER = new Buffer(process.env.TWITCH_EXTENSION_SECRET_KEY, 'base64');

function authenticate(token) {
  return jwt.verify(token, SECRET_BUFFER);
}

module.exports = authenticate;
