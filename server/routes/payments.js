// routes/payments.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { Payment, User } = require('../models');

const router = express.Router();

// Whitelists:
const ALLOWED_CURRENCIES = ['ZAR','USD','EUR'];
const ALLOWED_PROVIDERS = ['SWIFT']; // expand as needed

// Customer creates payment
router.post('/payments', [
  authenticateToken,
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be > 0'),
  body('currency').isIn(ALLOWED_CURRENCIES),
  body('provider').isIn(ALLOWED_PROVIDERS),
  body('payeeAccount').matches(/^\d{6,20}$/).withMessage('Invalid payee account'),
  body('swiftCode').matches(/^[A-Za-z0-9]{8,11}$/).withMessage('Invalid SWIFT code')
], async (req, res) => {
  if (req.user.role !== 'customer') return res.status(403).json({ error: 'Only customers can create payments' });

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { amount, currency, provider, payeeAccount, swiftCode } = req.body;
    const payment = await Payment.create({
      amount, currency, provider, payeeAccount, swiftCode,
      customerId: req.user.id
    });
    res.status(201).json({ payment });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Staff: list all payments (pending, verified, and submitted)
router.get('/staff/payments', authenticateToken, authorizeRole('employee'), async (req, res) => {
  const payments = await Payment.findAll({ 
    include: [{ model: User, attributes: ['fullName','accountNumber','username'] }],
    order: [['createdAt', 'DESC']]  // Most recent first
  });
  res.json({ payments });
});

// Staff: verify a payment (mark verified)
router.post('/staff/payments/:id/verify', authenticateToken, authorizeRole('employee'), async (req, res) => {
  const payment = await Payment.findByPk(req.params.id);
  if (!payment) return res.status(404).json({ error: 'Payment not found' });
  if (payment.status !== 'pending') return res.status(400).json({ error: 'Only pending can be verified' });

  payment.status = 'verified';
  payment.verifiedBy = req.user.id;
  await payment.save();
  res.json({ message: 'Payment verified', payment });
});

// Staff: submit to swift (simulated)
router.post('/staff/payments/:id/submit', authenticateToken, authorizeRole('employee'), async (req, res) => {
  const payment = await Payment.findByPk(req.params.id);
  if (!payment) return res.status(404).json({ error: 'Payment not found' });
  if (payment.status !== 'verified') return res.status(400).json({ error: 'Payment must be verified first' });

  payment.status = 'submitted';
  payment.submittedAt = new Date();
  await payment.save();

  // Log for auditing
  console.log(`Payment ${payment.id} submitted to SWIFT by employee ${req.user.id}`);
  res.json({ message: 'Submitted to SWIFT', payment });
});

// Staff: delete a payment from the system
router.delete('/staff/payments/:id', authenticateToken, authorizeRole('employee'), async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    // Store payment info for logging before deletion
    const paymentInfo = {
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      customerId: payment.customerId
    };

    // Delete the payment
    await payment.destroy();

    // Log for auditing
    console.log(`Payment ${paymentInfo.id} (${paymentInfo.amount} ${paymentInfo.currency}) deleted by employee ${req.user.id}`);
    
    res.json({ 
      message: 'Payment deleted successfully', 
      deletedPayment: paymentInfo 
    });
  } catch (e) {
    console.error('Error deleting payment:', e);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

module.exports = router;
