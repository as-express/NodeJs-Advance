import express, { Request, Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { authSecurity } from '../middlewares/auth.middleware';

const router = express.Router();
const userController = new UserController();

router
  .route('/profile')
  .get(authSecurity, async (req: Request, res: Response) => {
    try {
      await userController.getProfile(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router
  .route('/delete')
  .delete(authSecurity, async (req: Request, res: Response) => {
    try {
      await userController.deleteProfile(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  router
  .route('/logout')
  .post(authSecurity, (req: Request, res: Response) => userController.logout(req, res));


export default router;
