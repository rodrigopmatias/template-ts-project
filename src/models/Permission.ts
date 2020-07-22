import { Document, Model, Mongoose } from 'mongoose';

export interface IPermission extends Document {
  modelName: string
  verb: string
  codename?: string
}

export default (db: Mongoose): Model<IPermission> => {
  const { Schema } = db;
  const permissionSchema = new Schema({
    modelName: {
      type: String,
      required: true,
      index: 'idx_modelName',
    },
    verb: {
      type: String,
      required: true,
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    },
    codename: {
      type: String,
      required: false,
      unique: true,
    },
  });

  permissionSchema.pre<IPermission>('save', function fillCodename() {
    this.codename = `${this.modelName}.${this.verb}`;
  });

  return db.model<IPermission>('Permission', permissionSchema);
};
