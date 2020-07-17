/* eslint-disable no-console */
import http from 'http';
import app from '@/app';

const PORT = Number.parseInt(process.env.APP_PORT || '5000', 10);
const ADDR = process.env.APP_ADDR || '127.0.0.1';

http.createServer(app)
  .listen(
    PORT,
    ADDR,
    (): void => console.log(`Server is ready on http://${ADDR}:${PORT}`),
  );
