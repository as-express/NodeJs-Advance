import jwt from 'jsonwebtoken'
import { generateTokens } from './token.util'

export const verifyTokenAndUpdated = (refreshToken: string): any => {
    const decodedToken = jwt.verify(refreshToken, process.env.JWT_KEY as string) as { userId: number }
    if(!decodedToken) return 'Token is not valid'
  
    const userId = decodedToken.userId
    return generateTokens(userId)
  }