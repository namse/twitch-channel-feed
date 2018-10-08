import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';

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

interface JwtPayload {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  nonce: string;
}

export default async function authenticateIdToken(token: string): Promise<JwtPayload> {
  return new Promise<JwtPayload>((resolve, reject) => {
    return jwt.verify(token, getKey as any, (err, decoded) => {
      err ? reject(err) : resolve(decoded);
    });
  });
}
