import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import prisma from '../prisma/prisma.js'
import { generateToken } from '../utils/generatorTokens.js'
import bcrypt from 'bcrypt'

import { sendOtp } from '../services/nodemailer.service.js'


export const signUp = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { name, email, password } = req.body

    try {
        const isHave = await prisma.user.findUnique({
            where: {email: email }
        })
        if (isHave) {
            res.status(400).json({ message: 'User is already exist' })
        }

        const hash = bcrypt.hashSync(password, 7)
        const user = await prisma.user.create({
            data: { name, email, password: hash }
        })

        sendOtp(email)

        res.status(200).json({ message: 'Go through otp' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const authVerify = asyncHandler(async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({message: 'Please check your request', errors})
    }
    const {email,code} = req.body
    
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        const otp = await prisma.otp.findFirst({
            where: {
                email: email
            }
        })
        if(!otp) {
            res.status(400).json({message: 'The Eskiz code time is end'})
            return
        }

        const otpCode = otp.code
        const isCode = code === otpCode
        if(!isCode) {
            res.status(400).json({message: 'Code is not correct'})
            return
        }

        const token = generateToken(user.id)
        res.status(200).json({message: 'USer is authorized successfully', token})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Sorry Error in Server'})
    }
})


export const signIn = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { email, password } = req.body

    try {
        const user = await prisma.user.findUnique({
            where: { email: email }
        })
        if (!user) {
            res.status(404).json({ message: 'user is not Found' })
        }

        const isPassword = bcrypt.compareSync(password, user.password)
        if (!isPassword) {
            res.status(400).json({ message: 'Password is not correct' })
        }

        const token = generateToken(user.id)
        res.status(200).json({ message: 'User is Signed', token })
    } catch (error) {
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


