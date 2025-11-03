import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../api/axios';

const currencies = ['ZAR', 'USD', 'EUR'];
const providers = ['SWIFT'];

const schema = Yup.object({
  amount: Yup.number().positive('Amount must be positive').required('Required'),
  currency: Yup.mixed().oneOf(currencies).required('Required'),
  provider: Yup.mixed().oneOf(providers).required('Required'),
  payeeAccount: Yup.string().matches(/^\d{6,20}$/, 'Invalid account number').required('Required'),
  swiftCode: Yup.string().matches(/^[A-Za-z0-9]{8,11}$/, 'Invalid SWIFT code').required('Required')
});

export default function Dashboard() {
  return (
    <div className="glass-card">
      <div className="page-header">
        <h2>International Payment</h2>
        <p>Send money securely across borders</p>
      </div>

      <Formik
        initialValues={{ amount: '', currency: 'ZAR', provider: 'SWIFT', payeeAccount: '', swiftCode: '' }}
        validationSchema={schema}
        onSubmit={async (values, { setStatus, resetForm, setSubmitting }) => {
          try {
            const res = await api.post('/api/payments', values);
            setStatus({ success: 'Payment created successfully! Status: Pending verification' });
            resetForm();
          } catch (err) {
            setStatus({ error: err?.response?.data?.error || 'Payment failed. Please try again.' });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ status, isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <Field
                id="amount"
                name="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
              />
              <ErrorMessage name="amount" component="span" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <Field
                id="currency"
                name="currency"
                as="select"
              >
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </Field>
              <ErrorMessage name="currency" component="span" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="provider">Payment Provider</label>
              <Field
                id="provider"
                name="provider"
                as="select"
              >
                {providers.map(p => <option key={p} value={p}>{p}</option>)}
              </Field>
              <ErrorMessage name="provider" component="span" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="payeeAccount">Payee Account Number</label>
              <Field
                id="payeeAccount"
                name="payeeAccount"
                placeholder="123456789012"
              />
              <ErrorMessage name="payeeAccount" component="span" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="swiftCode">SWIFT Code</label>
              <Field
                id="swiftCode"
                name="swiftCode"
                placeholder="ABCDUS33XXX"
                style={{ textTransform: 'uppercase' }}
              />
              <ErrorMessage name="swiftCode" component="span" className="error-message" />
              <small style={{ display: 'block', marginTop: '0.25rem', color: '#6b7280', fontSize: '0.875rem' }}>
                8-11 alphanumeric characters
              </small>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Submit Payment'}
            </button>

            {status?.success && (
              <div className="alert alert-success">
                ✓ {status.success}
              </div>
            )}
            {status?.error && (
              <div className="alert alert-error">
                ✕ {status.error}
              </div>
            )}
          </Form>
        )}
      </Formik>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: 'rgba(99, 102, 241, 0.05)',
        borderRadius: '10px',
        borderLeft: '4px solid var(--primary)'
      }}>
        <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
          <strong>ℹ️ Note:</strong> All payments are subject to verification by our staff before being submitted to SWIFT.
        </p>
      </div>
    </div>
  );
}