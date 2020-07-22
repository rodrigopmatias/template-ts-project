import { Document, Mongoose, Model } from 'mongoose';

export interface IGroup extends Document {
  name: string
}

export default (db: Mongoose): Model<IGroup> => {
  const { Schema } = db;
  const groupSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
  });

  return db.model<IGroup>('Group', groupSchema);
};
