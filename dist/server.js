"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("./config/db");
const errorHandler_1 = require("./middlewares/errorHandler");
// Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const roadmapRoutes_1 = __importDefault(require("./routes/roadmapRoutes"));
// ─── Environment ─────────────────────────────────────────────────────────────
dotenv_1.default.config();
// Validate required environment variables at startup
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length) {
    console.error(`[FATAL] Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
}
// ─── App ──────────────────────────────────────────────────────────────────────
const app = (0, express_1.default)();
// ─── Security middleware ──────────────────────────────────────────────────────
app.use((0, helmet_1.default)());
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://skillpilot-ai-client.vercel.app')
    .split(',')
    .map((o) => o.trim());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`CORS: Origin '${origin}' not allowed`));
        }
    },
    credentials: true,
}));
// ─── Rate limiting ────────────────────────────────────────────────────────────
// Stricter limit for auth routes to prevent brute-force attacks
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { success: false, message: 'Too many attempts — please try again in 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});
// General API limiter
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: 'Too many requests — please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);
// ─── Request logging ──────────────────────────────────────────────────────────
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use((0, morgan_1.default)(morganFormat));
// ─── Body parser ──────────────────────────────────────────────────────────────
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        environment: process.env.NODE_ENV || 'development',
        database: mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
    });
});
// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/courses', courseRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
app.use('/api/roadmap', roadmapRoutes_1.default);
// ─── 404 handler (must be after all routes) ───────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});
// ─── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler_1.errorHandler);
// ─── Server startup ───────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '5000', 10);
const startServer = async () => {
    await (0, db_1.connectDB)();
    const server = app.listen(PORT, () => {
        console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
    // ─── Graceful shutdown ──────────────────────────────────────────────────────
    const shutdown = async (signal) => {
        console.log(`\n[Server] ${signal} received — shutting down gracefully...`);
        server.close(async () => {
            await mongoose_1.default.connection.close();
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
    process.on('unhandledRejection', (reason) => {
        console.error('[Server] Unhandled Rejection:', reason);
        shutdown('unhandledRejection');
    });
};
startServer();
