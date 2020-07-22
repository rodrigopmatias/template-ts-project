import {
  Document, Types, Mongoose, Model,
} from 'mongoose';

export interface IGroupPermission extends Document {
  userId: Types.ObjectId
  groupId: Types.ObjectId
}

export default (db: Mongoose): Model<IGroupPermission> => {
  const { Schema } = db;
  const groupPermissionSchema = new Schema({
    groupId: {
      type: Types.ObjectId,
      required: true,
    },
    permissionId: {
      type: Types.ObjectId,
      required: true,
    },
  });

  groupPermissionSchema.index({ groupId: 1, permissionId: 1 });

  return db.model<IGroupPermission>('GroupPermission', groupPermissionSchema);
};
