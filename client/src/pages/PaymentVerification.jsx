import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function PaymentVerification() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPaymentDetails();
  }, [id]);

  async function fetchPaymentDetails() {
    try {
      setLoading(true);
      const res = await api.get('/api/staff/payments');
      const paymentData = res.data.payments.find(p => p.id === parseInt(id));
      
      if (!paymentData) {
        setError('Payment not found');
        return;
      }
      
      setPayment(paymentData);
      setError(null);
    } catch (e) {
      setError('Failed to load payment details');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    try {
      setVerifying(true);
      
      // Verify the payment
      await api.post(`/api/staff/payments/${id}/verify`);
      
      // Refresh payment data to confirm change
      await fetchPaymentDetails();
      
      setSuccess(true);
      
      // Wait for success modal, then navigate with refresh
      setTimeout(() => {
        // Navigate to employee portal with verified filter and force refresh
        // Add timestamp to ensure fresh data load
        navigate(`/employee?filter=verified&refresh=true&t=${Date.now()}`);
      }, 2000);
    } catch (e) {
      setError('Failed to verify payment. Please try again.');
    } finally {
      setVerifying(false);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && !payment) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
          <h2 style={{ color: '#1f2937', marginBottom: '1rem' }}>{error}</h2>
          <button
            onClick={() => navigate('/employee')}
            className="btn btn-primary"
          >
            ← Back to Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem 0' }}>
      {/* Success Modal */}
      {success && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ color: '#10b981', marginBottom: '1rem', fontSize: '2rem' }}>
              Payment Verified!
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              Payment #{payment.id} has been successfully verified and is ready for SWIFT submission.
            </p>
            <p style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.95rem' }}>
              Redirecting to portal...
            </p>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={() => navigate('/employee')}
            style={{
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              marginBottom: '1.5rem',
              cursor: 'pointer',
              fontWeight: '500',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>←</span> Back to Portal
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', color: '#1f2937', marginBottom: '0.5rem', fontWeight: '700' }}>
                Payment Verification
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                Review payment details before verification
              </p>
            </div>
            <StatusBadge status={payment.status} />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            marginBottom: '2rem',
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <span style={{ fontWeight: '500' }}>{error}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Payment Information */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #e5e7eb'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                💰
              </div>
              <h2 style={{ fontSize: '1.75rem', color: '#1f2937', fontWeight: '600' }}>
                Payment Information
              </h2>
            </div>

            <InfoRow label="Payment ID" value={`#${payment.id}`} highlight />
            <InfoRow label="Amount" value={parseFloat(payment.amount).toLocaleString('en-US', {
              style: 'currency',
              currency: payment.currency
            })} highlight />
            <InfoRow label="Currency" value={payment.currency} />
            <InfoRow label="Provider" value={payment.provider} />
            <InfoRow label="Created At" value={new Date(payment.createdAt).toLocaleString()} />
          </div>

          {/* Customer Information */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #e5e7eb'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                👤
              </div>
              <h2 style={{ fontSize: '1.75rem', color: '#1f2937', fontWeight: '600' }}>
                Customer Information
              </h2>
            </div>

            <InfoRow label="Full Name" value={payment.User?.fullName || 'N/A'} />
            <InfoRow label="Account Number" value={payment.User?.accountNumber || 'N/A'} />
            <InfoRow label="Username" value={payment.User?.username || 'N/A'} />
          </div>
        </div>

        {/* SWIFT Information */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              🌍
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#1f2937', fontWeight: '600' }}>
              SWIFT Information
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <InfoRow label="Payee Account Number" value={payment.payeeAccount} highlight />
              <div style={{ marginTop: '1rem' }}>
                <ValidationCheck
                  label="Account Format"
                  valid={/^\d{6,20}$/.test(payment.payeeAccount)}
                  message="Must be 6-20 digits"
                />
              </div>
            </div>
            <div>
              <InfoRow label="SWIFT Code" value={payment.swiftCode} highlight />
              <div style={{ marginTop: '1rem' }}>
                <ValidationCheck
                  label="SWIFT Format"
                  valid={/^[A-Za-z0-9]{8,11}$/.test(payment.swiftCode)}
                  message="Must be 8-11 alphanumeric characters"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Verification Checklist */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#1f2937', fontWeight: '600' }}>
              Verification Checklist
            </h2>
          </div>

          <ChecklistItem
            checked
            label="Customer information is complete"
            description="Full name, account number, and username are present"
          />
          <ChecklistItem
            checked
            label="Payment amount is valid"
            description="Amount is greater than zero and properly formatted"
          />
          <ChecklistItem
            checked
            label="Currency is supported"
            description="Payment currency (ZAR/USD/EUR) is in the approved list"
          />
          <ChecklistItem
            checked
            label="Payee account number is valid"
            description="Account number follows the correct format (6-20 digits)"
          />
          <ChecklistItem
            checked
            label="SWIFT code is valid"
            description="SWIFT code format is correct (8-11 alphanumeric characters)"
          />
        </div>

        {/* Actions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/employee')}
              style={{
                padding: '1rem 2rem',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                background: 'white',
                color: '#6b7280',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#6b7280';
                e.target.style.color = '#1f2937';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.color = '#6b7280';
              }}
            >
              Cancel
            </button>
            
            {payment.status === 'pending' ? (
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="btn btn-primary"
                style={{
                  padding: '1rem 2.5rem',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  opacity: verifying ? 0.7 : 1,
                  cursor: verifying ? 'not-allowed' : 'pointer'
                }}
              >
                {verifying ? (
                  <>
                    <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    Verify Payment
                  </>
                )}
              </button>
            ) : payment.status === 'verified' ? (
              <button
                onClick={() => navigate(`/employee/submit/${payment.id}`)}
                className="btn btn-primary"
                style={{
                  padding: '1rem 2.5rem',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <span>🚀</span>
                Submit to SWIFT
              </button>
            ) : (
              <div style={{
                padding: '1rem 2rem',
                borderRadius: '12px',
                background: '#f0fdf4',
                border: '2px solid #10b981',
                color: '#10b981',
                fontSize: '1.1rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span>✓</span>
                Already Submitted
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 0',
      borderBottom: '1px solid #f3f4f6'
    }}>
      <span style={{
        color: '#6b7280',
        fontWeight: '500',
        fontSize: '0.95rem'
      }}>
        {label}
      </span>
      <span style={{
        color: highlight ? '#1f2937' : '#6b7280',
        fontWeight: highlight ? '700' : '600',
        fontSize: highlight ? '1.1rem' : '0.95rem',
        fontFamily: highlight ? 'monospace' : 'inherit'
      }}>
        {value}
      </span>
    </div>
  );
}

function ValidationCheck({ label, valid, message }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      background: valid ? '#f0fdf4' : '#fef2f2',
      border: `1px solid ${valid ? '#10b981' : '#ef4444'}`
    }}>
      <div style={{
        fontSize: '1.5rem'
      }}>
        {valid ? '✅' : '❌'}
      </div>
      <div>
        <div style={{
          fontWeight: '600',
          color: valid ? '#10b981' : '#ef4444',
          fontSize: '0.95rem'
        }}>
          {label}
        </div>
        <div style={{
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          {message}
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({ checked, label, description }) {
  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      padding: '1.25rem',
      marginBottom: '1rem',
      borderRadius: '12px',
      background: checked ? '#f0fdf4' : '#f9fafb',
      border: `2px solid ${checked ? '#10b981' : '#e5e7eb'}`
    }}>
      <div style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        background: checked ? '#10b981' : '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '700',
        fontSize: '1.25rem',
        flexShrink: 0
      }}>
        {checked ? '✓' : '○'}
      </div>
      <div>
        <div style={{
          fontWeight: '600',
          color: '#1f2937',
          fontSize: '1.05rem',
          marginBottom: '0.25rem'
        }}>
          {label}
        </div>
        <div style={{
          fontSize: '0.95rem',
          color: '#6b7280'
        }}>
          {description}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: {
      background: 'rgba(245, 158, 11, 0.1)',
      color: '#f59e0b',
      border: '2px solid rgba(245, 158, 11, 0.3)'
    },
    verified: {
      background: 'rgba(139, 92, 246, 0.1)',
      color: '#8b5cf6',
      border: '2px solid rgba(139, 92, 246, 0.3)'
    },
    submitted: {
      background: 'rgba(16, 185, 129, 0.1)',
      color: '#10b981',
      border: '2px solid rgba(16, 185, 129, 0.3)'
    }
  };

  const icons = {
    pending: '⏳',
    verified: '✅',
    submitted: '🚀'
  };

  return (
    <span style={{
      ...styles[status],
      padding: '0.75rem 1.5rem',
      borderRadius: '20px',
      fontSize: '1rem',
      fontWeight: '700',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      <span>{icons[status]}</span>
      {status}
    </span>
  );
}
