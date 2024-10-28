import express from 'express'
import { bigData, getMessage } from '../controllers/data.controller.js'


const router = express.Router()

router.route('/data').get(bigData)
router.route('/message').get(getMessage)

export default router