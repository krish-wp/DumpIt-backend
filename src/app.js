import express from 'express';

const app = express();

app.get('/health', (req, res) => {
  res.send('server is running properly');
});

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

export { app };
