import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="glass-card">
      <div className="page-header">
        <h2>Welcome Back</h2>
        <p>Sign in to access your account</p>
      </div>

      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {
            await api.post('/api/auth/login', values);
            setStatus({ success: 'Logged in successfully!' });
            if (onLogin) onLogin();

            // Redirect to dashboard after successful login
            setTimeout(() => {
              navigate('/dashboard');
            }, 1000);
          } catch (err) {
            setStatus({ error: err?.response?.data?.error || 'Login failed. Please check your credentials.' });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ status, isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field
                id="username"
                name="username"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <Field
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
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
              Don't have an account? <a href="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Create one</a>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
}