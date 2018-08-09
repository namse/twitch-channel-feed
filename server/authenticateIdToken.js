const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');

const client = jwksClient({
  jwksUri: 'https://id.twitch.tv/oauth2/keys',
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

async function authenticateIdToken(token) {
  return new Promise((resolve, reject) => {
    return jwt.verify(token, getKey, (err, decoded) => {
      err ? reject(err) : resolve(decoded);
    });
  });
}

module.exports = authenticateIdToken;