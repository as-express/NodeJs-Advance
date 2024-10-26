import databaseConfig from '../database/database.connection';
import { User } from '../database/entities/user.entity';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { generateTokens } from '../utils/token.util';
import { validationResult } from 'express-validator';
import { verifyTokenAndUpdated } from '../utils/verify-update.util';

export class AuthController {
  private userRepository = databaseConfig.getRepository(User);

  constructor() {}

  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res
          .status(400)
          .json({
            message: 'Please check your request',
            errors: errors.array(),
          });
        return;
      }

      const { username, email, password } = req.body;
      const existingUser = await this.checkUser(email);
      if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({
        username,
        email,
        password: hashPassword,
      });
      const tokens = await generateTokens(user.id);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      res
        .status(201)
        .json({
          token: tokens.accessToken,
          message: 'User registration successful',
        });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res
          .status(400)
          .json({
            message: 'Please check your request',
            errors: errors.array(),
          });
        return;
      }

      const { email, password } = req.body;
      const currentTime = new Date();

      const user = await this.getUser(email);
      if (!user) {
        res.status(400).json({ message: 'User is not defined' });
        return;
      }

      if (user.banUntil && currentTime <= user.banUntil) {
        res
          .status(403)
          .json({ message: 'Your account has been banned for 3 hours' });
        return;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        user.failedLoginAttempts += 1;

        if (user.failedLoginAttempts >= 5) {
          user.banUntil = new Date(Date.now() + 60 * 60 * 1000 * 3);
        }
        await this.userRepository.save(user);
        res.status(400).json({ message: 'Password is incorrect' });
        return;
      }

      user.failedLoginAttempts = 0;
      user.banUntil = undefined;
      await this.userRepository.save(user);

      const tokens = await generateTokens(user.id);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      res
        .status(200)
        .json({ token: tokens.accessToken, message: 'User login successful' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res
          .status(400)
          .json({
            message: 'Please check your request',
            errors: errors.array(),
          });
        return;
      }

      const { email, password, newPassword } = req.body;
      const user = await this.getUser(email);
      if (!user) {
        res.status(400).json({ message: 'User is not defined' });
        return;
      }

      const isPassword = await bcrypt.compare(password, user.password);
      if (!isPassword) {
        res.status(400).json({ message: 'Current password is not correct' });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await this.userRepository.save(user);
      res.status(200).json({ message: 'Password has been changed' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async updateTokens(req: Request, res: Response): Promise<any> {
    const {refreshToken} = req.cookies
    if(refreshToken) res.status(403).json({message: 'Refresh token is not defined'})

    const verify = await verifyTokenAndUpdated(refreshToken)
    res.cookie('refreshToken', verify.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json(verify.accessToken)
    
  }

  private async checkUser(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  private async getUser(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
