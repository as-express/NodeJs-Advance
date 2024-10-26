import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { check } from 'express-validator';
import { Request, Response } from 'express-serve-static-core';

const router = express.Router();
const authController = new AuthController();

router
  .route('/signup')
  .post(
    [
      check('username', 'username is required').notEmpty(),
      check('email', 'Email is required').notEmpty(),
      check('password', 'Password is required and need be minimum 8').isLength({
        min: 8,
      }),
    ],
    (req: Request, res: Response) => authController.signUp(req, res),
  );

router
  .route('/signin')
  .post(
    [
      check('email', 'Email is required').notEmpty(),
      check('password', 'Password is required and need be minimum 8').isLength({
        min: 8,
      }),
    ],
    (req: Request, res: Response) => authController.login(req, res),
  );

router
  .route('/forget-password')
  .post(
    [
      check('email', 'Email is required').notEmpty(),
      check('password', 'Password is required and need be minimum 8').isLength({
        min: 8,
      }),
      check(
        'newPassword',
        'Password is required and need be minimum 8',
      ).isLength({ min: 8 }),
    ],
    (req: Request, res: Response) => authController.changePassword(req, res),
  );

  router
  .route('/update-tokens')
  .post(
    (req: Request, res: Response) => authController.updateTokens(req, res),
  )

  
export default router;
