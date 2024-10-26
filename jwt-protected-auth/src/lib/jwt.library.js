import jwt from 'jsonwebtoken'


export const accessToken = userId => jwt.sign(
    {
        userId
    },
    process.env.JWT_ACCESS_TOKEN,
    { 
        expiresIn: '1h'
    }
)

export const refreshToken = userId => jwt.sign(
    {
        userId
    },
    process.env.JWT_REFRESH_TOKEN,
    {
        expiresIn: '1d'
    }
)
