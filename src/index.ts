/* eslint-disable no-console */
import http from 'http';
import app from '@/app';
import { config } from '@/config'

http.createServer(app)
  .listen(
    config(app).httpd.port,
    config(app).httpd.addr,
    (): void => console.log(`Server is ready on http://${config(app).httpd.addr}:${config(app).httpd.port}`),
  );
