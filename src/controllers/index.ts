/* eslint-disable no-console */
import { Application } from 'express';
import fs from 'fs';
import path from 'path';
import { dynamicRequire } from '@/helpers/core';
import BaseController from '@/helpers/controller';

const controllers: { [index: string]: BaseController } = {};

export function controllerByName<T extends BaseController>(name: string): T {
  return <T>controllers[name];
}

export default (app: Application): void => {
  console.log('Loading controllers ...');
  fs.readdirSync(__dirname)
    .filter((filename: string) => filename.endsWith('.ts'))
    .filter((filename: string) => filename !== 'index.ts')
    .map((filename: string) => path.join(__dirname, filename))
    .forEach((filepath: string) => {
      try {
        const pkg = dynamicRequire<BaseController>(filepath);
        const inst = pkg.default(app);

        console.log(`  Loaded controller ${inst.controllerName}`);
        controllers[inst.controllerName] = inst;
      } catch (e) {
        console.log(`  Exception found in ${filepath}`);
      }
    });
};
