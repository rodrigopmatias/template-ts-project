/* eslint-disable no-console */
import { Application, Router } from 'express';
import fs from 'fs';
import path from 'path';
import { dynamicRequire } from '@/helpers/core';

export default (app: Application): void => {
  console.log('Loading routes ...');
  fs.readdirSync(__dirname)
    .filter((filename: string) => filename.endsWith('.ts'))
    .filter((filename: string) => filename !== 'index.ts')
    .map((filename: string) => path.join(__dirname, filename))
    .forEach((filepath: string) => {
      try {
        const pkg = dynamicRequire<Router>(filepath);
        pkg.default(app);

        console.log(`  Loaded routes from ${filepath}`);
      } catch (e) {
        console.log(`  Exception found in ${filepath}`);
      }
    });
};
