import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import prisma from '../prisma/prisma.js'
import { generateToken } from '../utils/generatorTokens.js'
import { sendSMS, datas  } from '../services/eskiz.service.js'
import bcrypt from 'bcrypt'




export const signUp = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { name, phone, password } = req.body

    try {
        const isHave = await prisma.user.findUnique({
            where: {phone: phone }
        })
        if (isHave) {
            res.status(400).json({ message: 'User is already exist' })
        }

        const hash = bcrypt.hashSync(password, 7)
        const user = await prisma.user.create({
            data: { name, phone, password: hash }
        })

        await sendSMS(datas, phone)
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
    const {phone,code} = req.body
    
    try {
        const user = await prisma.user.findFirst({
            where: {
                phone: phone
            }
        })

        const eskiz = await prisma.otp.findFirst({
            where: {
                phone: phone
            }
        })
        if(!eskiz) {
            res.status(400).json({message: 'The Eskiz code time is end'})
            return
        }

        const eskizCode = eskiz.code
        const isCode = code === eskizCode
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
    const { phone, password } = req.body

    try {
        const user = await prisma.user.findUnique({
            where: { phone: phone }
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


