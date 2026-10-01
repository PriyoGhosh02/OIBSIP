import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Pizza, Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [resetTokenData, setResetTokenData] = useState(null);

  const { forgotPassword } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please provide your account email.');
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email);
      setSubmitted(true);
      setResetTokenData(res);
      showToast('Password reset link sent to your email.', 'info');
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Failed to dispatch reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-card-wrapper">
        <div className="auth-card card">
          <div className="auth-card-header">
            <div className="auth-logo-badge">
              <Pizza size={28} />
            </div>
            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-subtitle">We'll send you a secure 15-minute password reset link</p>
          </div>

          {submitted ? (
            <div className="animate-fade-in" style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle2 size={36} color="var(--green)" />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Reset Link Dispatched</h3>
              <p style={{ color: 'var(--muted-text)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                If an account exists for <strong>{email}</strong>, you will receive an email shortly with instructions.
              </p>

              {resetTokenData?.resetToken && (
                <div style={{ background: '#F8FAFC', border: '1px dashed var(--orange)', padding: '0.75rem', borderRadius: 8, fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                  <span style={{ color: 'var(--orange)', fontWeight: 700 }}>Dev Quick-Reset:</span>
                  <Link
                    to={`/reset-password/${resetTokenData.resetToken}`}
                    className="btn btn-outline btn-sm btn-full"
                    style={{ marginTop: '0.5rem' }}
                  >
                    Click to Reset Directly (Development)
                  </Link>
                </div>
              )}

              <Link to="/login" className="btn btn-secondary btn-full">
                <ArrowLeft size={16} /> Return to Login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="auth-error-banner">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Account Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      className="form-input with-icon"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full btn-lg"
                  style={{ marginTop: '1rem' }}
                  disabled={loading}
                >
                  {loading ? 'Sending Request...' : 'Send Reset Link'}
                </button>
              </form>

              <div className="auth-footer">
                <Link to="/login" className="back-link">
                  <ArrowLeft size={16} /> Remembered your password? Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
