import express from 'express'
import { deleteReq, errorReq, getReq, postReq, updateReq } from '../controllers/app.controller.js'
const router = express.Router()

router.route('/').post(postReq)
router.route('/').get(getReq)
router.route('/').put(updateReq)
router.route('/').delete(deleteReq)
router.route('/error').post(errorReq)

export default router