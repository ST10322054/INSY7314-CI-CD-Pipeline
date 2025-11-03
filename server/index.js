require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');

const app = express();

// Security & parsing
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, try again later.' }
}));

// CORS: allow frontend URL (use HTTPS port here)
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'https://localhost:5173',
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', paymentRoutes);

// Test route
app.get('/', (req, res) => res.send('Server is running!'));

// DB + HTTPS
sequelize.sync({ alter: true }).then(() => {
  console.log('DB synced');

  const keyPath = path.join(__dirname, 'certs/key.pem');
  const certPath = path.join(__dirname, 'certs/cert.pem');

  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    console.error('SSL certs not found in server/certs. Exiting.');
    process.exit(1);
  }

  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };

  const PORT = process.env.PORT || 443;
  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS server running on port ${PORT}`);
  });
});
