import express from 'express'
import { check } from 'express-validator'
import { authLogin, authLogout, authRegister, updateToken, verifyToken } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'


const router = express.Router()

router.route('/signup').post(
    [
        check('name', 'Name is required').notEmpty(),
        check('email', 'Email is required').notEmpty(),
        check('password', 'Password is need be min 8').isLength({min: 8}),
    ],
    authRegister
)

router.route('/login').post(
    [
        check('email', 'Email is required').notEmpty(),
        check('password', 'Password is need be min 8').isLength({min: 8}),
    ],
    authLogin
)

router.route('/refresh').post(updateToken)
router.route('/verify').get(authMiddleware, verifyToken)
router.route('/logout').post(authMiddleware, authLogout)

export default router
