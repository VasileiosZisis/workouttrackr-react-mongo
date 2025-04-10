import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
dotenv.config();
import connectDB from './config/db.js';
import logRoutes from './routes/logRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import wlsessionRoutes from './routes/wlsessionRoutes.js';
import pasessionRoutes from './routes/pasessionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import helmet from 'helmet';

const port = process.env.PORT;

connectDB();

const app = express();

app.use((req, res, next) => {
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://challenges.cloudflare.com',
        ],
        frameSrc: ['https://challenges.cloudflare.com'],
        connectSrc: ["'self'", 'https://challenges.cloudflare.com'],
        imgSrc: [
          "'self'",
          'blob:',
          'data:',
          'https://res.cloudinary.com/dmdbza74n/',
          'https://challenges.cloudflare.com',
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com',
        ],
      },
    },
  })(req, res, next);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/logs', logRoutes);
app.use('/api/logs/:slugLog/exercises', exerciseRoutes);
app.use(
  '/api/logs/:slugLog/exercises/:slugExercise/wlsessions',
  wlsessionRoutes
);
app.use(
  '/api/logs/:slugLog/exercises/:slugExercise/pasessions',
  pasessionRoutes
);
app.use('/api/users', userRoutes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();

  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`listening ${port}`));
