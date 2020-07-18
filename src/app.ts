import express from 'express';
import configure from '@/config';
import models from '@/models';
import controllers from '@/controllers';
import routes from '@/routes';

const app = express();

app.use(express.json());

configure(app);
models(app);
controllers(app);
routes(app);

export default app;
