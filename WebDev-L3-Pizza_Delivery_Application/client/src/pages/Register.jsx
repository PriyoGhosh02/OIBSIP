import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Pizza, User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
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
      await register(name, email, password, confirmPassword);
      showToast('Account created successfully! Welcome to PizzaHub 🍕', 'success');
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.message || 'Failed to create account.';
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
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join PizzaHub for delicious custom creations</p>
          </div>

          {error && (
                <div className="auth-error-banner">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-with-icon">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      name="name"
                      className="form-input with-icon"
                      placeholder="Priyo Ghosh"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      className="form-input with-icon"
                      placeholder="user@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      name="password"
                      className="form-input with-icon"
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-input with-icon"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full btn-lg mt-2"
                  disabled={loading}
                >
                  {loading ? (
                    'Creating Account...'
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="auth-link">
                    Sign In
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
          max-width: 460px;
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
        .mt-2 {
          margin-top: 0.75rem;
        }
        .mt-3 {
          margin-top: 1.25rem;
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
        .verification-notice {
          text-align: center;
          padding: 1.5rem 0.5rem;
        }
        .verify-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--green-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
        }
        .verification-notice h3 {
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
        }
        .verification-notice p {
          color: var(--muted-text);
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .dev-verify-helper {
          background: #F8FAFC;
          border: 1px dashed var(--orange);
          padding: 0.75rem;
          border-radius: var(--radius-md);
          margin-top: 1.5rem;
          font-size: 0.8rem;
        }
        .helper-label {
          color: var(--orange);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default Register;
