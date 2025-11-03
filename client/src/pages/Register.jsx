import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import api from '../api/axios';

/* Client-side whitelist/regex patterns - mirrors server validation */
const schema = Yup.object({
  fullName: Yup.string().matches(/^[A-Za-z\s\-'\.]{2,100}$/, 'Invalid name').required('Required'),
  idNumber: Yup.string().matches(/^\d{10,20}$/, 'Invalid ID').required('Required'),
  accountNumber: Yup.string().matches(/^\d{6,20}$/, 'Invalid account').required('Required'),
  username: Yup.string().matches(/^[a-zA-Z0-9]{4,}$/, 'Invalid username').required('Required'),
  password: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, 'Weak password').required('Required')
});

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="glass-card">
      <div className="page-header">
        <h2>Create Account</h2>
        <p>Join us to start making international payments</p>
      </div>

      <Formik
        initialValues={{ fullName: '', idNumber: '', accountNumber: '', username: '', password: '' }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            await api.post('/api/auth/register', values);
            setStatus({ success: 'Registration successful! Redirecting to login...' });

            // Redirect to login after 2 seconds
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          } catch (err) {
            setStatus({ error: err?.response?.data?.error || 'Server error' });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <Field
                id="fullName"
                name="fullName"
                placeholder="Susan Smith"
              />
              <ErrorMessage name="fullName" component="span" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="idNumber">ID Number</label>
              <Field
                id="idNumber"
                name="idNumber"
                placeholder="1234567890"
              />
              <ErrorMessage name="idNumber" component="span" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="accountNumber">Account Number</label>
              <Field
                id="accountNumber"
                name="accountNumber"
                placeholder="123456789012"
              />
              <ErrorMessage name="accountNumber" component="span" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field
                id="username"
                name="username"
                placeholder="susansmith123"
              />
              <ErrorMessage name="username" component="span" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <Field
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  style={{ paddingRight: '5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem 0.75rem',
                    color: 'var(--primary)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'opacity 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <ErrorMessage name="password" component="span" className="error-message" />
              <small style={{ display: 'block', marginTop: '0.25rem', color: '#6b7280', fontSize: '0.875rem' }}>
                Must contain uppercase, lowercase, number, and special character
              </small>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Creating Account...' : 'Register'}
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

            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280' }}>
              Already have an account? <a href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Sign in</a>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
}