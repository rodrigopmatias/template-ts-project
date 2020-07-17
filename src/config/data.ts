/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Mongoose, Model } from 'mongoose';

export interface DatasourceConfiguration {
  ds: Mongoose;
  models: {
    [index: string]: Model<any>;
  };
}

export default (): DatasourceConfiguration => {
  mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1/app', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Database connection is ready'))
    .catch(() => console.log('Database connect is failed'));

  return {
    ds: mongoose,
    models: mongoose.models,
  };
};
