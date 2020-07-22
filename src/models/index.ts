/* eslint-disable no-console */
import { Application } from 'express';
import fs from 'fs';
import path from 'path';
import { config } from '@/config';
import { dynamicRequire } from '@/helpers/core';
import { Model, Document } from 'mongoose';
import { IPermission } from './Permission';

export function modelByName<T extends Document>(app: Application, name: string): Model<T> {
  const { data } = config(app);
  return data.models[name];
}

export default (app: Application): void => {
  const { data } = config(app);

  console.log('Loading models ...');
  fs.readdirSync(__dirname)
    .filter((filename: string) => filename.endsWith('.ts'))
    .filter((filename: string) => filename !== 'index.ts')
    .map((filename: string) => path.join(__dirname, filename))
    .forEach((filepath: string) => {
      try {
        const pkg = dynamicRequire<Model<Document>>(filepath);
        const modelInstance = pkg.default(data.db, app);

        console.log(`  Loaded model ${modelInstance.modelName}`);
      } catch (e) {
        console.log(`  Exception found in ${filepath}`);
        console.exception(e);
      }
    });

  console.log('Populating permissions...');
  const Permission = modelByName<IPermission>(app, 'Permission');
  Object.keys(data.models)
    .forEach((modelName: string) => {
      ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
        .forEach((verb: string) => {
          const codename = [modelName, verb].join('.');

          Permission.countDocuments({ codename })
            .then((count: number) => {
              if (count === 0) {
                console.log(`  Created permission for ${codename}`);
                Permission.create({
                  modelName,
                  verb,
                });
              }
            })
            .catch((e) => console.log(e));
        });
    });
};
