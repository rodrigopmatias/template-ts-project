import {
  Document, Types, Mongoose, Model,
} from 'mongoose';

export interface IUserPermission extends Document {
  userId: Types.ObjectId
  groupId: Types.ObjectId
}

export default (db: Mongoose): Model<IUserPermission> => {
  const { Schema } = db;
  const userPermissionSchema = new Schema({
    userId: {
      type: Types.ObjectId,
      required: true,
    },
    permissionId: {
      type: Types.ObjectId,
      required: true,
    },
  });

  userPermissionSchema.index({ userId: 1, permissionId: 1 });

  return db.model<IUserPermission>('UserPermission', userPermissionSchema);
};
