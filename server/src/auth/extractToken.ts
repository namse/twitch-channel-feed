export default function extractToken(headers: { [header: string]: string }): string {
  const header = Object.keys(headers).find((key) => key === 'Authorization');
  if (!header) {
    throw new Error('No Authorization Header. Fuck you');
  }
  const tokenString = headers[header];
  const [type, token] = tokenString.split(' ');
  if (type.toLowerCase() !== 'bearer') {
    throw new Error('token type must be bearer. Fuck you');
  }
  return token;
}
