import { Application } from "express";
import httpdConfiguration, { HttpdConfiguration } from "@/config/httpd";

export interface Configuration {
  appName: string
  httpd: HttpdConfiguration
}

export const config = (app: Application): Configuration => {
  return app.get('config');
}

export default (app: Application): void => {
  app.set('config', {
    appName: 'The Test',
    httpd: httpdConfiguration(app)
  });
}
