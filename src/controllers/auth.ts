import BaseController from '@/helpers/controller';
import jwt from 'jwt-simple';
import crypto from 'crypto';
import { Model } from 'mongoose';
import { Application, Request, Response } from 'express';
import { IUser } from '@/models/User';
import { config } from '@/config';
import { SecurityConfiguration } from '@/config/security';

function mkToken(userId: string, secret: string, tokenTimeout: number, refreshTimeout: number): string {
  const current = (new Date()).getTime();
  const expireAt = current + tokenTimeout;
  const refreshAt = current + refreshTimeout;
  const abc = Buffer.from(Array(16));

  crypto.randomFillSync(abc, 0, 16);

  return jwt.encode(
    {
      userId,
      expireAt,
      refreshAt,
      abc: abc.toString('base64'),
    },
    secret,
  );
}

export class AuthController extends BaseController {
  private model: Model<IUser>;

  private security: SecurityConfiguration;

  constructor(userModel: Model<IUser>, security: SecurityConfiguration) {
    super('authController');
    this.model = userModel;
    this.security = security;
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

  protected mkToken(userId: string): string {
    const { secret, refreshTimeout, tokenTimeout } = this.security;
    return mkToken(userId, secret, tokenTimeout, refreshTimeout);
  }

  async token(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const result = {
      success: false,
      message: 'User or password not match',
    };

    if (email && password) {
      const user = await this.model.findOne({ email, isActive: true });

      if (user && await user.matchPassword(password)) {
        res.status(200).send({
          success: true,
          token: this.mkToken(user.id),
        });
      } else {
        res.status(401).send(result);
      }
    } else {
      res.status(401).send(result);
    }

    return res;
  }
}

export default (app: Application): BaseController => {
  const { User } = config(app).data.models;
  const { security } = config(app);

  return new AuthController(User, security);
};
