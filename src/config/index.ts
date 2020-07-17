import { Application } from 'express';
import httpdConfigure, { HttpdConfiguration } from '@/config/httpd';
import datasourceConfigure, { DatasourceConfiguration } from './data';

export interface Configuration {
  appName: string;
  httpd: HttpdConfiguration;
  dts: DatasourceConfiguration
}

export const config = (app: Application): Configuration => app.get('config');

export default (app: Application): void => {
  app.set('config', {
    appName: 'The Test',
    httpd: httpdConfigure(),
    dts: datasourceConfigure(),
  });
};
