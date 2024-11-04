import express from 'express'
import { postReq } from '../controllers/app.controller'

const router = express.Router()

router.route('/').post(postReq)