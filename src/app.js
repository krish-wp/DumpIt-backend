import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

app.use(limiter);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  })
);

app.get('/health', (req, res) => {
  res.send('server is running properly');
});

import sessionRouter from './routes/anonymous-session.routes.js';
import dumpRouter from './routes/dump.routes.js';
import commentRouter from './routes/comment.routes.js';

app.use('/api/v1/session', sessionRouter);
app.use('/api/v1/dump', dumpRouter);
app.use('/api/v1/comment', commentRouter);

export { app };
