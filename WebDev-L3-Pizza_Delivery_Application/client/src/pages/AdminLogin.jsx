import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@pizzahub.test');
  const [password, setPassword] = useState('AdminPassword123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide admin credentials.');
      return;
    }

    try {
      setLoading(true);
      await adminLogin(email, password);
      showToast('Admin access authorized. Welcome back!', 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin login error:', err);
      const msg = err.response?.data?.message || 'Access denied. Invalid admin credentials.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-auth-page animate-fade-in">
      <div className="auth-card-wrapper">
        <div className="auth-card card admin-auth-card">
          <div className="auth-card-header">
            <div className="admin-logo-badge">
              <Shield size={32} />
            </div>
            <h1 className="auth-title">Administrator Portal</h1>
            <p className="auth-subtitle">Restricted to authorized kitchen & store managers</p>
          </div>

          {error && (
            <div className="auth-error-banner">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="admin-demo-creds">
            <KeyRound size={16} color="var(--orange)" />
            <div>
              <strong>Pre-seeded Admin Account:</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted-text)', marginTop: '2px' }}>
                admin@pizzahub.test &bull; AdminPassword123
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input with-icon"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pizzahub.test"
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
                  className="form-input with-icon"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-dark btn-full btn-lg"
              style={{ marginTop: '1rem' }}
              disabled={loading}
            >
              {loading ? (
                'Authenticating...'
              ) : (
                <>
                  Enter Admin Console
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <span style={{ fontSize: '0.85rem', color: 'var(--muted-text)' }}>
              Looking for user orders?{' '}
              <a href="/" style={{ color: 'var(--primary-red)', fontWeight: 600 }}>
                Customer Home
              </a>
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .admin-auth-page {
          background: #111827;
        }
        .admin-auth-card {
          background: #1F2937;
          border-color: #374151;
          color: white;
        }
        .admin-auth-card .auth-title {
          color: white;
        }
        .admin-auth-card .auth-subtitle {
          color: #9CA3AF;
        }
        .admin-auth-card .form-label {
          color: #E5E7EB;
        }
        .admin-auth-card .form-input {
          background: #111827;
          border-color: #4B5563;
          color: white;
        }
        .admin-auth-card .form-input:focus {
          border-color: var(--orange);
        }
        .admin-logo-badge {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: linear-gradient(135deg, #1F2937, #374151);
          border: 2px solid #4B5563;
          color: var(--orange);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        .admin-demo-creds {
          background: #111827;
          border: 1px solid #374151;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
          color: #E5E7EB;
        }
        .admin-auth-card .auth-footer {
          border-top-color: #374151;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
