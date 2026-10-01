import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Pizza, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { showToast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, password, confirmPassword);
      setSuccess(true);
      showToast('Password updated successfully. You can now login.', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(
        err.response?.data?.message || 'Password reset token is invalid or has expired.'
      );
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
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">Create a strong new password for your PizzaHub account</p>
          </div>

          {success ? (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckCircle2 size={36} color="var(--green)" />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Password Updated!</h3>
              <p style={{ color: 'var(--muted-text)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Redirecting you to the login page now...
              </p>
              <Link to="/login" className="btn btn-primary btn-full">
                Go to Login Now
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
                  <label className="form-label">New Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      className="form-input with-icon"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      className="form-input with-icon"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {loading ? 'Updating Password...' : 'Save New Password'}
                </button>
              </form>

              <div className="auth-footer">
                <Link to="/login" className="back-link">
                  Return to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
