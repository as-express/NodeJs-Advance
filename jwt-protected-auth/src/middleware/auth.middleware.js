import jwt from 'jsonwebtoken'


export const authMiddleware = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization
        const refreshToken = req.cookies['refreshToken']

        if (!authorizationHeader) {
            return res.status(400).json({ message: 'Please Put Token' })
        }
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN)
        const code = process.env.JWT_ACCESS_TOKEN

        if(!decoded) {
            res.status(400).json({message: 'Please go throw authorization ./'})
            return
        }

        const token = authorizationHeader.split(' ')[1]
        const decodedToken = jwt.verify(token, code)
        req.userId = decodedToken.userId
        next()
    } catch (error) {
        console.error(error)
        res.status(401).json({ message: 'Invalid Token Please go throw authorization again' })
    }
}
