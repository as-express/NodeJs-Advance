import express from 'express'
import { bigData } from '../controller/data.controller'


const router = express.Router()

router.route('/data').get(bigData)