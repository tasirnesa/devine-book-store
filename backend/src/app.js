const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const env = require('./config/env');
const logger = require('./config/logger');
const routes = require('./routes/index');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// ── Security ────────────────────────────────────────────
app.use(helmet());

app.use(cors({
    origin: env.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

// Rate limiting — 100 requests per 15 min per IP
// app.use(rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//     message: { success: false, message: 'Too many requests, please try again later.' },
// }));

// ── Parsers ──────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ──────────────────────────────────────────────
if (env.env !== 'test') {
    app.use(morgan('dev', {
        stream: { write: (msg) => logger.info(msg.trim()) },
    }));
}

// ── Static file serving (uploaded covers & PDFs) ─────────
app.use('/uploads', express.static(path.join(__dirname, '..', env.upload.dir)));

// ── API Routes ───────────────────────────────────────────
app.use('/api', routes);

// ── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ─────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
