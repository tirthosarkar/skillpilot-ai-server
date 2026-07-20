import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import { connectDB } from './config/db';
import { errorHandler } from './middlewares/errorHandler';

// Routes
import authRoutes from './routes/authRoutes';
import aiRoutes from './routes/aiRoutes';
import courseRoutes from './routes/courseRoutes';
import userRoutes from './routes/userRoutes';
import roadmapRoutes from './routes/roadmapRoutes';

// ─── Environment ─────────────────────────────────────────────────────────────

dotenv.config();

// Validate required environment variables at startup
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`[FATAL] Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

// ─── App ──────────────────────────────────────────────────────────────────────

const app = express();

// ─── Security middleware ──────────────────────────────────────────────────────

app.use(helmet());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://skillpilot-ai-client.vercel.app')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin '${origin}' not allowed`));
      }
    },
    credentials: true,
  })
);

// ─── Rate limiting ────────────────────────────────────────────────────────────

// Stricter limit for auth routes to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many attempts — please try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests — please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// ─── Request logging ──────────────────────────────────────────────────────────

const morganFormat =
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));

// ─── Body parser ──────────────────────────────────────────────────────────────

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/roadmap', roadmapRoutes);

// ─── 404 handler (must be after all routes) ───────────────────────────────────

app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global error handler (must be last) ─────────────────────────────────────

app.use(errorHandler);

// ─── Server startup ───────────────────────────────────────────────────────────

const PORT = parseInt(process.env.PORT || '5000', 10);

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(
      `[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
  });

  // ─── Graceful shutdown ──────────────────────────────────────────────────────

  const shutdown = async (signal: string) => {
    console.log(`\n[Server] ${signal} received — shutting down gracefully...`);
    server.close(async () => {
      await mongoose.connection.close();
      console.log('[Server] MongoDB connection closed. Exiting.');
      process.exit(0);
    });

    // Force exit after 10 seconds if graceful close hangs
    setTimeout(() => {
      console.error('[Server] Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Catch unhandled promise rejections
  process.on('unhandledRejection', (reason: unknown) => {
    console.error('[Server] Unhandled Rejection:', reason);
    shutdown('unhandledRejection');
  });
};

startServer();
