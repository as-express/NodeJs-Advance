import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import { accessToken, refreshToken } from '../lib/jwt.library.js'
import jwt from 'jsonwebtoken'


export const authRegister = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { name, email, password,} = req.body

    try {
        const isHave = await User.findOne({ email })
        if (isHave) {
            res.status(400).json({ message: 'User is already exist' })
        }
        const hash = bcrypt.hashSync(password, 7)
        const user = new User({name, email, password: hash})
        user.save()        

        const aToken = accessToken(user.id)
        const rToken = refreshToken(user.id)

        res.cookie('refreshToken', rToken, { httpOnly: true, sameSite: 'strict' })
        res.status(200).json({ message: 'User is Saved Successfully', user, aToken })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const authLogin = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const truePassword = bcrypt.compareSync(password, user.password)
        if (!truePassword) {
            res.status(400).json({ message: 'Password is not Correct' })
        }

       const aToken = accessToken(user.id)
        const rToken = refreshToken(user.id)

        res.cookie('refreshToken', rToken, { httpOnly: true, sameSite: 'strict' })
        res.status(200).json({ message: 'User is Enter Successfully', aToken })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const updateToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies['refreshToken']

  try {
    if (!refreshToken) {
      return res.status(401).json({message: 'Please go through authorization.'})
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN)
    const newAccessToken = accessToken(decoded.userId)

    res.header('Authorization', newAccessToken).send({ accessToken: newAccessToken })
    // res.status(200).json({ accessToken: newAccessToken })
  } catch (error) {
    console.log(error)
    res.status(400).json({message: 'Sorry Error in Server'})
  }
})


export const verifyToken = asyncHandler(async(req, res) => {
    res.status(200).json({message: 'Token is Verified Successful ✅'})
})


export const authLogout = asyncHandler(async(req, res) => {
    res.clearCookie('refreshToken')
    res.status(200).json({message: 'Logout successful ✅'})
})
