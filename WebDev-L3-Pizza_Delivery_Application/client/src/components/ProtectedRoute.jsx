import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>🍕</div>
          <p style={{ marginTop: '1rem', color: 'var(--muted-text)', fontWeight: 500 }}>
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  if (adminOnly) {
    if (!isAuthenticated || !isAdmin) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
  } else {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
