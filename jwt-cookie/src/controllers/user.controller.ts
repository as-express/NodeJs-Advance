import databaseConfig from '../database/database.connection';
import { User } from '../database/entities/user.entity';
import { Request, Response } from 'express';

interface CustomRequest extends Request {
  userId?: number;
}

export class UserController {
  private user = databaseConfig.getRepository(User);

  async getProfile(req: CustomRequest, res: Response) {
    const id = req.userId ? parseInt(req.userId.toString()) : null;

    if (id === null) {
      return res.status(400).json({ message: 'User ID not found' });
    }

    const user = await this.user.findOneBy({ id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  }

  async deleteProfile(req: CustomRequest, res: Response) {
    const id = req.userId ? parseInt(req.userId.toString()) : null;

    if (id === null) {
      return res.status(400).json({ message: 'User ID not found' });
    }

    const user = await this.user.findOneBy({ id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await this.user.delete(id); // Use the id to delete the user
    res.status(200).json({ message: 'Account is deleted' });
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })

    res.status(200).json({message: 'User Logout'})
  }
}
