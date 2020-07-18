import BaseController from '@/helpers/controller';
import { Model } from 'mongoose';
import { IUser } from '@/models/User';
import { Application, Request, Response } from 'express';
import { config } from '@/config';

export class AuthController extends BaseController {
  private model: Model<IUser>;

  constructor(userModel: Model<IUser>) {
    super('authController');
    this.model = userModel;
  }

  async register(req: Request, res: Response): Promise<Response> {
    const {
      email, firstName, lastName, password, confirmPassword,
    } = req.body;

    try {
      if (password && confirmPassword && password === confirmPassword) {
        const isActive = await this.model.countDocuments({ isActive: true }) === 0;
        const isAdmin = await this.model.countDocuments({ isAdmin: true }) === 0;

        const user = await this.model.create({
          email, firstName, lastName, isActive, isAdmin,
        });

        await user.setPassword(password);
        res.status(201).send({
          success: true,
          user: {
            ...user.toJSON(),
            password: undefined,
          },
        });
      } else {
        res.status(400).send({
          success: false,
          message: 'Password confirmation not match',
        });
      }
    } catch (e) {
      res.status(501).send({
        success: false,
        message: e.toString(),
      });
    }

    return res;
  }
}

export default (app: Application): BaseController => {
  const { User } = config(app).data.models;

  return new AuthController(User);
};
