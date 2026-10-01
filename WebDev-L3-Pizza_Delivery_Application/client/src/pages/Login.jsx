import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Pizza, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const data = await login(email, password);
      showToast('Logged in successfully!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      showToast(msg, 'error');
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
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to track orders and save your favorite pizzas</p>
          </div>

          {error && (
            <div className="auth-error-banner">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input with-icon"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">Password</label>
                <Link to="/forgot-password" className="forgot-pass-link">
                  Forgot Password?
                </Link>
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  className="form-input with-icon"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg mt-2" disabled={loading}>
              {loading ? (
                'Signing In...'
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: calc(100vh - 160px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.25rem;
          background: linear-gradient(180deg, #FFF7ED 0%, #F8FAFC 100%);
        }
        .auth-card-wrapper {
          width: 100%;
          max-width: 440px;
        }
        .auth-card {
          padding: 2.5rem 2.25rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
        }
        .auth-card-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .auth-logo-badge {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--primary-red), var(--orange));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          box-shadow: 0 8px 16px rgba(230, 57, 70, 0.25);
        }
        .auth-title {
          font-size: 1.75rem;
          margin-bottom: 0.35rem;
        }
        .auth-subtitle {
          color: var(--muted-text);
          font-size: 0.9rem;
        }
        .auth-error-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #FEE2E2;
          color: var(--danger);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          border: 1px solid #FCA5A5;
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--muted-text);
        }
        .form-input.with-icon {
          padding-left: 42px;
        }
        .form-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .forgot-pass-link {
          font-size: 0.8rem;
          color: var(--orange);
          font-weight: 600;
        }
        .forgot-pass-link:hover {
          text-decoration: underline;
        }
        .mt-2 {
          margin-top: 0.75rem;
        }
        .auth-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          font-size: 0.9rem;
          color: var(--muted-text);
        }
        .auth-link {
          color: var(--primary-red);
          font-weight: 700;
        }
        .auth-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Login;
