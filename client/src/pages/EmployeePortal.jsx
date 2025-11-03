import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function EmployeePortal() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  async function verify(id) {
    try {
      await api.post(`/api/staff/payments/${id}/verify`);
      fetchPayments();
    } catch (e) {
      setError('Failed to verify payment.');
    }
  }

  async function submitToSwift(id) {
    try {
      await api.post(`/api/staff/payments/${id}/submit`);
      fetchPayments();
    } catch (e) {
      setError('Failed to submit payment.');
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <div className="page-header">
          <h2>Staff Payment Portal</h2>
          <p>Review and process pending payments</p>
        </div>

        {error && (
          <div className="alert alert-error">
            ✕ {error}
          </div>
        )}

        {loading ? (
          <div className="spinner"></div>
        ) : payments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <p>No payments to review at the moment</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Payee Account</th>
                  <th>SWIFT Code</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>
                      #{p.id}
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      {parseFloat(p.amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td>{p.currency}</td>
                    <td style={{ fontFamily: 'monospace' }}>{p.payeeAccount}</td>
                    <td style={{ fontFamily: 'monospace' }}>{p.swiftCode}</td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {p.status === 'pending' && (
                          <button
                            className="btn btn-warning"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                            onClick={() => verify(p.id)}
                          >
                            Verify
                          </button>
                        )}
                        {p.status === 'verified' && (
                          <button
                            className="btn btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                            onClick={() => submitToSwift(p.id)}
                          >
                            Submit to SWIFT
                          </button>
                        )}
                        {p.status === 'submitted' && (
                          <span style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            color: 'var(--success)',
                            fontWeight: '600'
                          }}>
                            Complete
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{
          marginTop: '2rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <StatCard
            label="Pending"
            count={payments.filter(p => p.status === 'pending').length}
            color="#f59e0b"
          />
          <StatCard
            label="Verified"
            count={payments.filter(p => p.status === 'verified').length}
            color="#6366f1"
          />
          <StatCard
            label="Submitted"
            count={payments.filter(p => p.status === 'submitted').length}
            color="#10b981"
          />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: { background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' },
    verified: { background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', border: '1px solid rgba(99, 102, 241, 0.3)' },
    submitted: { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }
  };

  return (
    <span style={{
      ...styles[status],
      padding: '0.375rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.875rem',
      fontWeight: '600',
      display: 'inline-block',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      {status}
    </span>
  );
}

function StatCard({ label, count, color }) {
  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '15px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      minWidth: '150px',
      textAlign: 'center',
      borderTop: `4px solid ${color}`
    }}>
      <div style={{ fontSize: '2rem', fontWeight: '700', color, marginBottom: '0.5rem' }}>
        {count}
      </div>
      <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </div>
    </div>
  );
}