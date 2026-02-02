import express, { Router } from 'express';
import cookieParser from 'cookie-parser';

const app = express();

app.get('/health', (req, res) => {
  console.log('running');
  res.send('server is running properly');
});

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(express.static('public'));

import sessionRouter from './routes/anonymous-session.routes.js';
import dumpRouter from './routes/dump.routes.js';
app.use('/api/v1/session', sessionRouter);
app.use('/api/v1/dump', dumpRouter);

export { app };
