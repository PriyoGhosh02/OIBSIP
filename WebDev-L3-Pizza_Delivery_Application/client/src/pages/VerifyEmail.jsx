import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Pizza, ArrowRight } from 'lucide-react';

const VerifyEmail = () => {
  const { token } = useParams();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleVerify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing verification token in URL.');
        return;
      }

      try {
        const res = await verifyEmail(token);
        setStatus('success');
        setMessage(res.message || 'Email verified successfully! You can now log in.');
      } catch (err) {
        setStatus('error');
        setMessage(
          err.response?.data?.message || 'Verification link is invalid or has expired.'
        );
      }
    };

    handleVerify();
  }, [token]);

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-card-wrapper">
        <div className="auth-card card" style={{ textAlign: 'center' }}>
          <div className="auth-logo-badge">
            <Pizza size={28} />
          </div>

          {status === 'verifying' && (
            <div>
              <div style={{ fontSize: '2.5rem', animation: 'spin 1.2s infinite' }}>🍕</div>
              <h2 style={{ marginTop: '1rem', fontSize: '1.4rem' }}>Verifying your email...</h2>
              <p style={{ color: 'var(--muted-text)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Please wait while we confirm your credentials with the database.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="animate-fade-in">
              <div className="verify-status-icon success-icon">
                <CheckCircle2 size={40} color="var(--green)" />
              </div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Account Verified!</h2>
              <p style={{ color: 'var(--muted-text)', fontSize: '0.95rem', marginBottom: '2rem' }}>
                {message}
              </p>
              <Link to="/login" className="btn btn-primary btn-full btn-lg">
                Proceed to Login
                <ArrowRight size={18} />
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="animate-fade-in">
              <div className="verify-status-icon error-icon">
                <AlertCircle size={40} color="var(--danger)" />
              </div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Verification Failed</h2>
              <p style={{ color: 'var(--muted-text)', fontSize: '0.95rem', marginBottom: '2rem' }}>
                {message}
              </p>
              <Link to="/register" className="btn btn-secondary btn-full">
                Register Again
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .verify-status-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }
        .success-icon {
          background: var(--green-light);
        }
        .error-icon {
          background: var(--danger-light);
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;
