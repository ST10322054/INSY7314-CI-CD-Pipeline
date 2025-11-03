import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeePortal from './pages/EmployeePortal';
import PaymentVerification from './pages/PaymentVerification';
import PaymentSubmission from './pages/PaymentSubmission';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    // Check localStorage for login state on initial load
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const handleLogin = () => {
    setLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    // Optionally clear any tokens or user data
    localStorage.removeItem('authToken');
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        <Navigation loggedIn={loggedIn} onLogout={handleLogout} />

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employee" element={<EmployeePortal />} />
          <Route path="/employee/verify/:id" element={<PaymentVerification />} />
          <Route path="/employee/submit/:id" element={<PaymentSubmission />} />
          <Route path="/" element={<WelcomePage loggedIn={loggedIn} />} />
        </Routes>
      </div>
    </Router>
  );
}

function Navigation({ loggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav>
      <Link to="/">Home</Link>

      {!loggedIn && (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}

      {loggedIn && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/employee">Employee Portal</Link>
          <button onClick={handleLogoutClick}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

function WelcomePage({ loggedIn }) {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <div className="welcome-container">
        <div style={{ marginBottom: '1rem' }}>
          <span style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '0.5rem 1.5rem',
            borderRadius: '50px',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Trusted by Businesses Worldwide
          </span>
        </div>

        <h1>Enterprise Payment Solutions</h1>
        <p style={{ maxWidth: '700px', margin: '0 auto 2.5rem', fontSize: '1.15rem', lineHeight: '1.8' }}>
          Streamline your international transactions with our secure, compliant, and efficient payment processing platform.
          Built for businesses that demand reliability and speed.
        </p>

        {!loggedIn ? (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                Get Started Free →
              </button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                Sign In
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                Make a Payment →
              </button>
            </Link>
            <Link to="/employee" style={{ textDecoration: 'none' }}>
              <button className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                Employee Portal
              </button>
            </Link>
          </div>
        )}

        {/* Trust Indicators */}
        <div style={{
          display: 'flex',
          gap: '3rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          padding: '2rem 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <TrustStat number="SSL/TLS" label="Encrypted" />
          <TrustStat number="RegEx" label="Input Validation" />
          <TrustStat number="Bcrypt" label="Password Security" />
          <TrustStat number="SWIFT" label="Network" />
        </div>
      </div>

      {/* Features Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#1f2937', marginBottom: '1rem', fontWeight: '700' }}>
            Why Choose Global Payments?
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Everything you need to manage international payments with confidence
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          <FeatureCard
            icon="🔒"
            title="Password Hashing & Salting"
            description="Industry-standard bcrypt password hashing with salting ensures your credentials are never stored in plain text. Each password is uniquely encrypted for maximum security."
            showIcon={false}
          />
          <FeatureCard
            icon="⚡"
            title="HTTPS/SSL Encryption"
            description="All data transmitted between your browser and our servers is encrypted using SSL/TLS certificates, protecting your sensitive payment information in transit."
            showIcon={false}
          />
          <FeatureCard
            icon="🌐"
            title="SWIFT Payment Integration"
            description="Direct integration with the SWIFT network for international payments. Support for ZAR, USD, and EUR currencies with real-time SWIFT code validation."
            showIcon={false}
          />
          <FeatureCard
            icon="📊"
            title="Input Validation & Whitelisting"
            description="Advanced RegEx patterns whitelist all user inputs, blocking SQL injection, XSS attacks, and malicious code before it reaches our servers."
            showIcon={false}
          />
          <FeatureCard
            icon="🤝"
            title="Two-Stage Verification"
            description="All payments require staff verification before SWIFT submission. Our compliance team reviews transaction details and validates SWIFT codes for your protection."
            showIcon={false}
          />
          <FeatureCard
            icon="✅"
            title="Attack Protection Suite"
            description="Protected against Session Hijacking, Clickjacking, SQL Injection, XSS, Man-in-the-Middle, and DDoS attacks using Helmet, Express-Brute, and security middleware."
            showIcon={false}
          />
        </div>
      </div>

      {/* How It Works Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '4rem 2rem',
        boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#1f2937', marginBottom: '1rem', fontWeight: '700' }}>
              How It Works
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              Simple, secure, and compliant payment processing in three steps
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            <ProcessStep
              number="1"
              title="Register & Login"
              description="Create your account with full name, ID number, and account details. Login securely with username and password to access the payment portal."
            />
            <ProcessStep
              number="2"
              title="Submit Payment Request"
              description="Enter payment amount, select currency (ZAR/USD/EUR), choose SWIFT provider, and provide payee account number and SWIFT code."
            />
            <ProcessStep
              number="3"
              title="Staff Verification & SWIFT"
              description="Bank employees verify your transaction details and SWIFT code accuracy. Once approved, payments are submitted to the SWIFT network for processing."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!loggedIn && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            color: 'white',
            marginBottom: '1rem',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>
            Ready to Get Started?
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: '2rem',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}>
            Join thousands of businesses processing international payments with confidence
          </p>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary" style={{
              padding: '1.25rem 3rem',
              fontSize: '1.1rem',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
            }}>
              Create Free Account →
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

function TrustStat({ number, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: '2rem',
        fontWeight: '700',
        color: 'white',
        marginBottom: '0.25rem',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
      }}>
        {number}
      </div>
      <div style={{
        fontSize: '0.875rem',
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {label}
      </div>
    </div>
  );
}

function ProcessStep({ number, title, description }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: '700',
        margin: '0 auto 1.5rem',
        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
      }}>
        {number}
      </div>
      <h3 style={{
        fontSize: '1.5rem',
        color: '#1f2937',
        marginBottom: '1rem',
        fontWeight: '600'
      }}>
        {title}
      </h3>
      <p style={{
        color: '#6b7280',
        lineHeight: '1.7',
        fontSize: '1rem'
      }}>
        {description}
      </p>
    </div>
  );
}

function FeatureCard({ icon, title, description, showIcon = true }) {
  // Map icons to professional symbols
  const iconMap = {
    '🔒': '🛡️',
    '⚡': '⚡',
    '🌐': '🌍',
    '📊': '📈',
    '🤝': '🤝',
    '✅': '✓'
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '2.5rem 2rem',
      borderRadius: '15px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(99, 102, 241, 0.1)',
      height: '100%'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(99, 102, 241, 0.15)';
        e.currentTarget.style.borderColor = 'var(--primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.1)';
      }}
    >
      {showIcon ? (
        <div style={{
          fontSize: '3rem',
          marginBottom: '1.5rem',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
        }}>
          {icon}
        </div>
      ) : (
        <div style={{
          width: '70px',
          height: '70px',
          margin: '0 auto 1.5rem',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '2rem',
          fontWeight: '700',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
        }}>
          {iconMap[icon] || icon}
        </div>
      )}
      <h3 style={{
        fontSize: '1.5rem',
        marginBottom: '1rem',
        color: '#1f2937',
        fontWeight: '600'
      }}>
        {title}
      </h3>
      <p style={{
        color: '#6b7280',
        lineHeight: '1.7',
        fontSize: '1rem'
      }}>
        {description}
      </p>
    </div>
  );
}