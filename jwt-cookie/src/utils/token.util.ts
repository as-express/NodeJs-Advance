import jwt from 'jsonwebtoken';

interface Tokens {
  refreshToken: string;
  accessToken: string;
}

export const generateTokens = (userId: number): Tokens => {
  const key = process.env.JWT_KEY;

  if (!key) {
    throw new Error('JWT_KEY is not defined in environment variables');
  }

  const refreshToken = jwt.sign({ userId }, key, { expiresIn: '24h' });
  const accessToken = jwt.sign({ userId }, key, { expiresIn: '3m' });

  return {
    refreshToken,
    accessToken,
  };
};


export const verifyTokenAndUpdated = (refreshToken: string): any => {
  const decodedToken = jwt.verify(refreshToken, process.env.JWT_KEY as string) as { userId: string }
  if(!decodedToken) return 'Token is not valid'

  const userId = decodedToken.userId
  
}