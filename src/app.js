import express, { Router } from 'express';
import cookieParser from 'cookie-parser';

const app = express();

import cors from 'cors';

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.use(cookieParser());
app.use(express.static('public'));

app.use(
  cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true,
  })
);

app.get('/health', (req, res) => {
  console.log('running');
  res.send('server is running properly');
});

import sessionRouter from './routes/anonymous-session.routes.js';
import dumpRouter from './routes/dump.routes.js';
import commentRouter from './routes/comment.routes.js';

app.use('/api/v1/session', sessionRouter);
app.use('/api/v1/dump', dumpRouter);
app.use('/api/v1/comment', commentRouter);

export { app };
