import { Mongoose, Document, Model } from 'mongoose';
import util from 'util';
import crypto from 'crypto';
import { Application } from 'express';
import { config } from '@/config';

export interface IUser extends Document {
  email: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  isAdmin?: boolean;

  setPassword(plain: string): void;
  matchPassword(plain: string): boolean;
}

export default (db: Mongoose, app: Application): Model<IUser> => {
  const { Schema } = db;
  const { secret, hashEngine, pwdStoreSize } = config(app).security;

  const userSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  });

  async function mkPassword(plain: string): Promise<Buffer> {
    const pbkdf2 = util.promisify(crypto.pbkdf2);
    const dv = await pbkdf2(plain, secret, 8192, pwdStoreSize, hashEngine);

    return dv;
  }

  async function setPassword(plain: string, autoSave = true): Promise<void> {
    this.password = (await mkPassword(plain)).toString('base64');
    if (autoSave) {
      await this.save();
    }
  };

  async function matchPassword(plain: string): Promise<boolean> {
    const { User } = db.models;
    try {
      const user = await User.findOne({ _id: this.id }).select('password');
      const dv = await mkPassword(plain);

      return user.password === dv.toString('base64');
    } catch (e) {
      return false;
    }
  }

  userSchema.methods.setPassword = setPassword;
  userSchema.methods.matchPassword = matchPassword;

  return db.model<IUser>('User', userSchema);
};
