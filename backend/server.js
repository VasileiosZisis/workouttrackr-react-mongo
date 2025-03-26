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
import crypto from 'crypto';

const port = process.env.PORT;

connectDB();

const app = express();

app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;

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
        styleSrc: ["'self'", "'unsafe-inline'"],
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

// if (process.env.NODE_ENV === 'production') {
//   const __dirname = path.resolve();

//   app.use(express.static(path.join(__dirname, '/frontend/dist')));

//   app.get('*', (req, res) =>
//     res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
//   );
// } else {
//   app.get('/', (req, res) => {
//     res.send('API is running...');
//   });
// }

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) => {
    const indexHtml = path.resolve(__dirname, 'frontend', 'dist', 'index.html');
    res.sendFile(
      indexHtml,
      {
        headers: {
          'Content-Security-Policy': res.get('Content-Security-Policy'),
        },
      },
      (err) => {
        if (err) {
          res.status(500).send('Error serving index.html');
        } else {
          res.send(`
          <script nonce="${res.locals.nonce}">
            window.__nonce__ = "${res.locals.nonce}";
          </script>
        `);
        }
      }
    );
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="nonce" content="${res.locals.nonce}" />
          <title>Development Mode</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="http://localhost:5173/src/main.jsx" nonce="${res.locals.nonce}"></script>
          <script nonce="${res.locals.nonce}">
            window.__nonce__ = "${res.locals.nonce}";
          </script>
        </body>
      </html>
    `);
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`listening ${port}`));
