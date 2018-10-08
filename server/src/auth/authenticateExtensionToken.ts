import jwt from 'jsonwebtoken';

const secretKey = process.env.TWITCH_EXTENSION_SECRET_KEY || 'test';
const SECRET_BUFFER = new Buffer(secretKey, 'base64');

interface AuthResult {
  exp: number;
  user_id: string;
  role: string;
}

export default function authenticateExtensionToken(token) {
  return jwt.verify(token, SECRET_BUFFER) as AuthResult;
}
