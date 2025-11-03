// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');

const router = express.Router();

// Registration with server-side whitelist/regex validation
router.post('/register', [
  body('fullName').matches(/^[A-Za-z\s\-'\.]{2,100}$/).withMessage('Invalid name'),
  body('idNumber').isLength(/^\d{10,20}$/).isNumeric().withMessage('Invalid ID number'),
  body('accountNumber').matches(/^\d{6,20}$/).withMessage('Invalid account number'),
  body('username').isAlphanumeric().isLength({ min: 4 }),
  body('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { fullName, idNumber, accountNumber, username, password } = req.body;

  try {
    const exists = await User.findOne({ where: { [require('sequelize').Op.or]: [{ username }, { accountNumber }, { idNumber }] } });
    if (exists) return res.status(409).json({ error: 'User/account exists' });

    // bcrypt with salt (12 rounds)
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ fullName, idNumber, accountNumber, username, passwordHash, role: 'customer' });

    return res.status(201).json({ message: 'Registered' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('username').exists(),
  body('password').exists()
], async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  // JWT stored in HttpOnly cookie
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000
  });

  res.json({ message: 'Logged in' });
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

router.get('/me', async (req, res) => {
  // decode token from cookie if present
  const token = req.cookies?.token;
  if (!token) return res.json({ user: null });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id, { attributes: ['id','username','role','fullName'] });
    res.json({ user });
  } catch (e) {
    res.json({ user: null });
  }
});

module.exports = router;
