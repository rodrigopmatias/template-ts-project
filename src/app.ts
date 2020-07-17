import express from 'express';
import configure from '@/config';

const app = express();

configure(app);

export default app;
