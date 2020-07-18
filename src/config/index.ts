import { Application } from 'express';
import httpdConfigure, { HttpdConfiguration } from '@/config/httpd';
import datasourceConfigure, { DatasourceConfiguration } from './data';
import securityConfigure, { SecurityConfiguration } from './security';

export interface Configuration {
  appName: string;
  httpd: HttpdConfiguration;
  data: DatasourceConfiguration,
  security: SecurityConfiguration
}

export const config = (app: Application): Configuration => app.get('config');

export default (app: Application): void => {
  app.set('config', {
    appName: 'The Test',
    httpd: httpdConfigure(),
    data: datasourceConfigure(),
    security: securityConfigure(),
  });
};
