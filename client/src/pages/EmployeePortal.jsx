import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

export default function EmployeePortal() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    payment: null,
    deleting: false
  });
  
  // Get filter from URL query parameter, default to 'all'
  const filter = searchParams.get('filter') || 'all';

  async function fetchPayments() {
    try {
      setLoading(true);
      const res = await api.get('/api/staff/payments');
      setPayments(res.data.payments);
      setError(null);
    } catch (e) {
      setError('Failed to load payments. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPayments();
  }, []);

  // Watch for refresh parameter in URL and refetch payments
  useEffect(() => {
    const shouldRefresh = searchParams.get('refresh');
    if (shouldRefresh === 'true') {
      // Force refresh payments from server
      console.log('🔄 Refreshing payments due to verification/submission...');
      fetchPayments();
      
      // Clean up URL after a short delay to ensure data is loaded
      setTimeout(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('refresh');
        newParams.delete('t'); // Remove timestamp too
        setSearchParams(newParams);
      }, 500);
    }
  }, [searchParams]);

  // Function to update filter in URL
  const setFilter = (newFilter) => {
    setSearchParams({ filter: newFilter });
  };

  // Function to show delete confirmation
  const handleDeleteClick = (payment) => {
    setDeleteModal({
      show: true,
      payment: payment,
      deleting: false
    });
  };

  // Function to actually delete the payment
  const handleConfirmDelete = async () => {
    if (!deleteModal.payment) return;
    
    try {
      setDeleteModal(prev => ({ ...prev, deleting: true }));
      
      await api.delete(`/api/staff/payments/${deleteModal.payment.id}`);
      
      // Refresh payments list
      await fetchPayments();
      
      // Close modal
      setDeleteModal({ show: false, payment: null, deleting: false });
      
    } catch (e) {
      console.error('Failed to delete payment:', e);
      alert('Failed to delete payment. Please try again.');
      setDeleteModal(prev => ({ ...prev, deleting: false }));
    }
  };

  // Function to cancel delete
  const handleCancelDelete = () => {
    setDeleteModal({ show: false, payment: null, deleting: false });
  };

  const filteredPayments = payments.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    verified: payments.filter(p => p.status === 'verified').length,
    submitted: payments.filter(p => p.status === 'submitted').length
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', color: '#1f2937', marginBottom: '0.5rem', fontWeight: '700' }}>
                🏦 Staff Payment Portal
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                Review, verify, and submit customer payment requests
              </p>
            </div>
            <button
              onClick={fetchPayments}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 2rem' }}>
        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard
            icon="📊"
            label="Total Payments"
            count={stats.total}
            color="#6366f1"
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          />
          <StatCard
            icon="⏳"
            label="Pending Review"
            count={stats.pending}
            color="#f59e0b"
            active={filter === 'pending'}
            onClick={() => setFilter('pending')}
          />
          <StatCard
            icon="✅"
            label="Verified"
            count={stats.verified}
            color="#8b5cf6"
            active={filter === 'verified'}
            onClick={() => setFilter('verified')}
          />
          <StatCard
            icon="🚀"
            label="Submitted to SWIFT"
            count={stats.submitted}
            color="#10b981"
            active={filter === 'submitted'}
            onClick={() => setFilter('submitted')}
          />
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

        {/* Payments Table */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h2 style={{ fontSize: '1.75rem', color: '#1f2937', fontWeight: '600' }}>
              {filter === 'all' ? 'All Payments' :
                filter === 'pending' ? 'Pending Payments' :
                  filter === 'verified' ? 'Verified Payments' :
                    'Submitted Payments'}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <FilterButton label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
              <FilterButton label="Pending" active={filter === 'pending'} onClick={() => setFilter('pending')} />
              <FilterButton label="Verified" active={filter === 'verified'} onClick={() => setFilter('verified')} />
              <FilterButton label="Submitted" active={filter === 'submitted'} onClick={() => setFilter('submitted')} />
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div className="spinner" style={{ margin: '0 auto' }}></div>
              <p style={{ color: '#6b7280', marginTop: '1rem' }}>Loading payments...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>
                No payments found
              </h3>
              <p>
                {filter === 'pending' && 'No payments awaiting verification at the moment.'}
                {filter === 'verified' && 'No verified payments ready for SWIFT submission.'}
                {filter === 'submitted' && 'No payments have been submitted to SWIFT yet.'}
                {filter === 'all' && 'No payment requests have been made yet.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.95rem'
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={tableHeaderStyle}>Payment ID</th>
                    <th style={tableHeaderStyle}>Customer</th>
                    <th style={tableHeaderStyle}>Amount</th>
                    <th style={tableHeaderStyle}>Currency</th>
                    <th style={tableHeaderStyle}>Payee Account</th>
                    <th style={tableHeaderStyle}>SWIFT Code</th>
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={tableHeaderStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map(payment => (
                    <PaymentRow
                      key={payment.id}
                      payment={payment}
                      onViewDetails={() => navigate(`/employee/verify/${payment.id}`)}
                      onSubmit={() => navigate(`/employee/submit/${payment.id}`)}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '2rem',
          marginTop: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '1rem', fontWeight: '600' }}>
            💡 Payment Processing Guide
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            <HelpCard
              step="1"
              title="Review Pending Payments"
              description="Check all payment details including customer info, amounts, currency, and SWIFT codes."
            />
            <HelpCard
              step="2"
              title="Verify Payment Details"
              description="Click 'Verify' to review payment in detail. Validate SWIFT code format and account numbers."
            />
            <HelpCard
              step="3"
              title="Submit to SWIFT"
              description="Once verified, submit the payment to the SWIFT network for international processing."
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2.5rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              fontSize: '3rem',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              ⚠️
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#dc2626',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              Delete Payment?
            </h2>
            <p style={{
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: '1.5rem',
              lineHeight: '1.6'
            }}>
              Are you sure you want to delete this payment? This action cannot be undone.
            </p>

            {deleteModal.payment && (
              <div style={{
                background: '#f9fafb',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'grid',
                  gap: '0.75rem',
                  fontSize: '0.95rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Payment ID:</span>
                    <span style={{ fontWeight: '700', color: '#6366f1', fontFamily: 'monospace' }}>
                      #{deleteModal.payment.id}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Customer:</span>
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>
                      {deleteModal.payment.User?.fullName || 'N/A'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Amount:</span>
                    <span style={{ fontWeight: '700', color: '#1f2937', fontSize: '1.1rem' }}>
                      {parseFloat(deleteModal.payment.amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} {deleteModal.payment.currency}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Status:</span>
                    <StatusBadge status={deleteModal.payment.status} />
                  </div>
                </div>
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={handleCancelDelete}
                disabled={deleteModal.deleting}
                style={{
                  padding: '0.75rem 2rem',
                  background: '#f3f4f6',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: deleteModal.deleting ? 'not-allowed' : 'pointer',
                  color: '#6b7280',
                  transition: 'all 0.2s ease',
                  opacity: deleteModal.deleting ? 0.5 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteModal.deleting}
                style={{
                  padding: '0.75rem 2rem',
                  background: deleteModal.deleting ? '#f87171' : '#dc2626',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: deleteModal.deleting ? 'not-allowed' : 'pointer',
                  color: 'white',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {deleteModal.deleting ? (
                  <>
                    <span style={{ 
                      animation: 'spin 1s linear infinite',
                      display: 'inline-block'
                    }}>⏳</span>
                    Deleting...
                  </>
                ) : (
                  <>
                    🗑️ Delete Payment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, count, color, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: active ? color : 'white',
        color: active ? 'white' : '#1f2937',
        padding: '2rem',
        borderRadius: '15px',
        boxShadow: active ? `0 8px 20px ${color}40` : '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: active ? `2px solid ${color}` : '2px solid transparent',
        transform: active ? 'translateY(-4px)' : 'translateY(0)'
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = `0 8px 16px ${color}30`;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
      <div style={{
        fontSize: '2.5rem',
        fontWeight: '700',
        marginBottom: '0.5rem'
      }}>
        {count}
      </div>
      <div style={{
        fontSize: '0.875rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        opacity: active ? 0.95 : 0.7
      }}>
        {label}
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.5rem 1.25rem',
        borderRadius: '8px',
        border: active ? '2px solid #6366f1' : '2px solid #e5e7eb',
        background: active ? '#6366f1' : 'white',
        color: active ? 'white' : '#6b7280',
        fontWeight: '600',
        fontSize: '0.875rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      {label}
    </button>
  );
}

function PaymentRow({ payment, onViewDetails, onSubmit, onDelete }) {
  return (
    <tr style={{
      borderBottom: '1px solid #f3f4f6',
      transition: 'background 0.2s ease'
    }}
      onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <td style={tableCellStyle}>
        <span style={{
          fontWeight: '700',
          color: '#6366f1',
          fontFamily: 'monospace',
          fontSize: '1rem'
        }}>
          #{payment.id}
        </span>
      </td>
      <td style={tableCellStyle}>
        <div>
          <div style={{ fontWeight: '600', color: '#1f2937' }}>
            {payment.User?.fullName || 'N/A'}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {payment.User?.accountNumber || 'N/A'}
          </div>
        </div>
      </td>
      <td style={tableCellStyle}>
        <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1f2937' }}>
          {parseFloat(payment.amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </span>
      </td>
      <td style={tableCellStyle}>
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '6px',
          background: '#f3f4f6',
          fontWeight: '600',
          fontSize: '0.875rem',
          fontFamily: 'monospace'
        }}>
          {payment.currency}
        </span>
      </td>
      <td style={tableCellStyle}>
        <span style={{ fontFamily: 'monospace', color: '#6b7280' }}>
          {payment.payeeAccount}
        </span>
      </td>
      <td style={tableCellStyle}>
        <span style={{
          fontFamily: 'monospace',
          fontWeight: '600',
          color: '#1f2937'
        }}>
          {payment.swiftCode}
        </span>
      </td>
      <td style={tableCellStyle}>
        <StatusBadge status={payment.status} />
      </td>
      <td style={tableCellStyle}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {payment.status === 'pending' && (
            <button
              onClick={onViewDetails}
              className="btn btn-warning"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap'
              }}
            >
              ✓ Verify
            </button>
          )}
          {payment.status === 'verified' && (
            <button
              onClick={onSubmit}
              className="btn btn-primary"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap'
              }}
            >
              🚀 Submit to SWIFT
            </button>
          )}
          {payment.status === 'submitted' && (
            <span style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              color: '#10b981',
              fontWeight: '600'
            }}>
              ✓ Complete
            </span>
          )}
          <button
            onClick={onViewDetails}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              color: '#6b7280',
              whiteSpace: 'nowrap'
            }}
          >
            👁️ View
          </button>
          <button
            onClick={() => onDelete(payment)}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              color: '#dc2626',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fecaca';
              e.currentTarget.style.borderColor = '#f87171';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fee2e2';
              e.currentTarget.style.borderColor = '#fecaca';
            }}
          >
            🗑️ Delete
          </button>
        </div>
      </td>
    </tr>
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
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.875rem',
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

function HelpCard({ step, title, description }) {
  return (
    <div style={{
      background: '#f9fafb',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '2px solid #e5e7eb'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '1rem'
      }}>
        {step}
      </div>
      <h4 style={{
        fontSize: '1.1rem',
        color: '#1f2937',
        marginBottom: '0.5rem',
        fontWeight: '600'
      }}>
        {title}
      </h4>
      <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.6' }}>
        {description}
      </p>
    </div>
  );
}

const tableHeaderStyle = {
  padding: '1rem',
  textAlign: 'left',
  fontWeight: '700',
  color: '#1f2937',
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  letterSpacing: '0.05em'
};

const tableCellStyle = {
  padding: '1.25rem 1rem',
  textAlign: 'left'
};