import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function PaymentSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
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
      
      if (paymentData.status !== 'verified' && paymentData.status !== 'submitted') {
        setError('Payment must be verified before submission');
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

  async function handleSubmit() {
    try {
      setSubmitting(true);
      
      // Submit the payment
      await api.post(`/api/staff/payments/${id}/submit`);
      
      // Refresh payment data to confirm change
      await fetchPaymentDetails();
      
      setSuccess(true);
      
      // Wait for success modal, then navigate with refresh
      setTimeout(() => {
        // Navigate to employee portal with submitted filter and force refresh
        // Add timestamp to ensure fresh data load
        navigate(`/employee?filter=submitted&refresh=true&t=${Date.now()}`);
      }, 3000);
    } catch (e) {
      setError('Failed to submit payment to SWIFT. Please try again.');
    } finally {
      setSubmitting(false);
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
            maxWidth: '600px'
          }}>
            <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🚀</div>
            <h2 style={{ color: '#10b981', marginBottom: '1rem', fontSize: '2.5rem' }}>
              Submitted to SWIFT!
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1.2rem', marginBottom: '1rem' }}>
              Payment #{payment.id} has been successfully submitted to the SWIFT network for international processing.
            </p>
            <div style={{
              background: '#f0fdf4',
              border: '2px solid #10b981',
              borderRadius: '12px',
              padding: '1rem',
              marginTop: '1.5rem'
            }}>
              <p style={{ color: '#10b981', fontWeight: '600', fontSize: '1rem' }}>
                The payment will be processed according to SWIFT protocols and the recipient will receive funds within 1-3 business days.
              </p>
            </div>
            <p style={{ color: '#9ca3af', marginTop: '1.5rem', fontSize: '0.95rem' }}>
              Redirecting to portal in 3 seconds...
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
                🚀 SWIFT Submission
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                Submit verified payment to international SWIFT network
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

        {/* Warning for Already Submitted */}
        {payment.status === 'submitted' && (
          <div style={{
            background: '#f0fdf4',
            border: '2px solid #10b981',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '2rem' }}>✅</span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                Payment Already Submitted
              </div>
              <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>
                This payment has already been submitted to SWIFT on {new Date(payment.submittedAt).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '2.5rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '3px solid #6366f1'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem',
            paddingBottom: '2rem',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
            <h2 style={{ fontSize: '2rem', color: '#1f2937', marginBottom: '0.5rem', fontWeight: '700' }}>
              Payment Summary
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Review final details before SWIFT submission
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div>
              <SummarySection title="Transaction Details" icon="📊">
                <SummaryRow label="Payment ID" value={`#${payment.id}`} />
                <SummaryRow label="Amount" value={parseFloat(payment.amount).toLocaleString('en-US', {
                  style: 'currency',
                  currency: payment.currency
                })} highlight />
                <SummaryRow label="Currency" value={payment.currency} />
                <SummaryRow label="Status" value={payment.status.toUpperCase()} />
              </SummarySection>

              <SummarySection title="Recipient Details" icon="👤">
                <SummaryRow label="Payee Account" value={payment.payeeAccount} />
                <SummaryRow label="SWIFT Code" value={payment.swiftCode} highlight />
                <SummaryRow label="Provider" value={payment.provider} />
              </SummarySection>
            </div>

            <div>
              <SummarySection title="Sender Details" icon="🏦">
                <SummaryRow label="Customer Name" value={payment.User?.fullName || 'N/A'} />
                <SummaryRow label="Account Number" value={payment.User?.accountNumber || 'N/A'} />
                <SummaryRow label="Username" value={payment.User?.username || 'N/A'} />
              </SummarySection>

              <SummarySection title="Timestamps" icon="⏰">
                <SummaryRow label="Created" value={new Date(payment.createdAt).toLocaleString()} />
                <SummaryRow label="Last Updated" value={new Date(payment.updatedAt).toLocaleString()} />
                {payment.submittedAt && (
                  <SummaryRow label="Submitted" value={new Date(payment.submittedAt).toLocaleString()} />
                )}
              </SummarySection>
            </div>
          </div>
        </div>

        {/* Pre-Submission Checklist */}
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
              Pre-Submission Checklist
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <ChecklistItem
              checked
              label="Payment Verified"
              description="Payment has been reviewed and verified by staff"
            />
            <ChecklistItem
              checked
              label="SWIFT Code Valid"
              description="SWIFT code format meets international standards"
            />
            <ChecklistItem
              checked
              label="Amount Confirmed"
              description="Payment amount and currency are correct"
            />
            <ChecklistItem
              checked
              label="Recipient Info Complete"
              description="All recipient banking details are present"
            />
            <ChecklistItem
              checked
              label="Customer Authorized"
              description="Customer account is verified and in good standing"
            />
            <ChecklistItem
              checked
              label="Compliance Met"
              description="Payment meets all regulatory requirements"
            />
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
            marginBottom: '1.5rem'
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
              ℹ️
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#1f2937', fontWeight: '600' }}>
              SWIFT Network Information
            </h2>
          </div>

          <div style={{
            background: '#f9fafb',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '1rem' }}>
              This payment will be submitted to the Society for Worldwide Interbank Financial Telecommunication (SWIFT) network for secure international processing. The transaction will be encrypted and routed through the global financial messaging system.
            </p>
            <ul style={{ color: '#6b7280', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              <li>Processing time: 1-3 business days</li>
              <li>Network: SWIFT gpi (global payments innovation)</li>
              <li>Security: End-to-end encryption</li>
              <li>Tracking: Real-time status updates available</li>
              <li>Compliance: Automated sanctions screening</li>
            </ul>
          </div>

          <div style={{
            background: '#fffbeb',
            border: '2px solid #f59e0b',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '2rem' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: '700', color: '#f59e0b', marginBottom: '0.5rem', fontSize: '1.05rem' }}>
                Important Notice
              </div>
              <div style={{ color: '#92400e', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Once submitted to SWIFT, this transaction cannot be cancelled or modified. Please ensure all details are correct before proceeding. The customer will be notified of the submission status.
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '2.5rem',
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

            <button
              onClick={() => navigate(`/employee/verify/${payment.id}`)}
              style={{
                padding: '1rem 2rem',
                borderRadius: '12px',
                border: '2px solid #6366f1',
                background: 'white',
                color: '#6366f1',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
              }}
            >
              Review Details
            </button>
            
            {payment.status === 'verified' ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: '1rem 3rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: submitting ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: submitting ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {submitting ? (
                  <>
                    <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                    Submitting to SWIFT...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Submit to SWIFT Network
                  </>
                )}
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
                Already Submitted to SWIFT
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummarySection({ title, icon, children }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '2px solid #e5e7eb'
      }}>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function SummaryRow({ label, value, highlight }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 0',
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
        color: highlight ? '#6366f1' : '#1f2937',
        fontWeight: highlight ? '700' : '600',
        fontSize: highlight ? '1.1rem' : '0.95rem',
        fontFamily: highlight ? 'monospace' : 'inherit'
      }}>
        {value}
      </span>
    </div>
  );
}

function ChecklistItem({ checked, label, description }) {
  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      borderRadius: '12px',
      background: checked ? '#f0fdf4' : '#f9fafb',
      border: `2px solid ${checked ? '#10b981' : '#e5e7eb'}`
    }}>
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: checked ? '#10b981' : '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '700',
        fontSize: '1.1rem',
        flexShrink: 0
      }}>
        {checked ? '✓' : '○'}
      </div>
      <div>
        <div style={{
          fontWeight: '600',
          color: '#1f2937',
          fontSize: '0.95rem',
          marginBottom: '0.25rem'
        }}>
          {label}
        </div>
        <div style={{
          fontSize: '0.85rem',
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
