import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  userId?: number;
}

export const authSecurity = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        res.status(401).json({ message: 'Please provide a token' });
        return;
      }

      const decodedToken = jwt.verify(refreshToken, process.env.JWT_KEY as string);
      req.userId = (decodedToken as { userId: number }).userId;
      next();
      return;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY as string);
    req.userId = (decodedToken as { userId: number }).userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Invalid token' });
  }
};
