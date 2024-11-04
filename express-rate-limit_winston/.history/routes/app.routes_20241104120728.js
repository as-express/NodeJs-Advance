import express from 'express'
import { deleteReq, errorReq, getReq, postReq, updateReq } from '../controllers/app.controller.js'
const router = express.Router()

/**
 * @swagger
 * /:
 *   post:
 *     tags: [Main]  
 *     summary: Post request 
 *     responses:
 *       200:
 *         description: Post method is worked successful
 */
router.route('/').post(postReq)

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Main]  
 *     summary: Get request 
 *     responses:
 *       200:
 *         description: Get method is worked successful
 */
router.route('/').get(getReq)

/**
 * @swagger
 * /:
 *   put:
 *     tags: [Main]  
 *     summary: Put request 
 *     responses:
 *       200:
 *         description: Put method is worked successful
 */
router.route('/').put(updateReq)

/**
 * @swagger
 * /:
 *   delete:
 *     tags: [Main]  
 *     summary: Delete request 
 *     responses:
 *       200:
 *         description: Delete method is worked successful
 */
router.route('/').delete(deleteReq)

/**
 * @swagger
 * /error:
 *   post:
 *     tags: [Main]  
 *     summary: Post error request 
 *     responses:
 *       200:
 *         description: Server error
 */
router.route('/error').post(errorReq)

export default router