import express from 'express'
import {signUp, signIn, authVerify} from '../controllers/auth.controller.js'
import { check } from 'express-validator'

const router = express.Router()

router.route('/signup').post(
    [
        check('name', 'Name is required').notEmpty(),
        check('email', 'Email is required').notEmpty(),
        check('password', 'Password is required and need be minimum 8').isLength({ min: 8 })
    ],
    signUp
)

router.route('/verify').post(
    [
        check('email', 'Email is required').notEmpty(),
        check('code', 'Code is required').notEmpty()
    ],
    authVerify
)

router.route('/signin').post(
    [
        check('email', 'Email is required').notEmpty(),
        check('password', 'Password is required and need be minimum 8').isLength({ min: 8 })
    ],
    signIn
)

export default router