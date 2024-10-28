import express from 'express'
import { bigData, bigDataByManyThreads, getMessage } from '../controllers/data.controller.js'


const router = express.Router()

router.route('/data').get(bigData)
router.route('data/threads').get(bigDataByManyThreads)
router.route('/message').get(getMessage)

export default router