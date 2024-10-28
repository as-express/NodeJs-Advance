import express from 'express'
import { bigData, getMessage } from '../controller/data.controller.js'


const router = express.Router()

router.route('/data').get(() => {
    const worker = new Worker('../controller/data.controller.js')

    worker.onmessage((data) => {
        resizeBy.se
    })
})
router.route('/message').get(getMessage)

export default router