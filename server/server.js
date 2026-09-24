const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 500,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', limiter);

// API Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    platform: 'CareConnect API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/providers', require('./routes/providerRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/quotes', require('./routes/quoteRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/disputes', require('./routes/disputeRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Central Error Handler
app.use(errorHandler);

const DEFAULT_PORT = process.env.PORT || 5000;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`[CareConnect Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`[CareConnect Server] Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('[CareConnect Server Error]', err);
    }
  });
};

startServer(DEFAULT_PORT);
