import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Pizza, ShoppingBag, Shield, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to={isAdmin ? '/admin/dashboard' : '/'} className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-wrapper">
            <Pizza className="brand-pizza-icon" />
          </div>
          <span className="brand-name">Pizza<span className="brand-accent">Hub</span></span>
          {isAdmin && <span className="admin-pill">ADMIN</span>}
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          {isAdmin ? (
            /* Admin Navigation Bar */
            <div className="nav-links">
              <Link
                to="/admin/dashboard"
                className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/inventory"
                className={`nav-link ${isActive('/admin/inventory') ? 'active' : ''}`}
              >
                Inventory
              </Link>
              <Link
                to="/admin/orders"
                className={`nav-link ${isActive('/admin/orders') ? 'active' : ''}`}
              >
                Orders
              </Link>
            </div>
          ) : (
            /* User Navigation Bar */
            <div className="nav-links">
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                Home
              </Link>
              <Link
                to="/builder"
                className={`nav-link ${isActive('/builder') ? 'active' : ''}`}
              >
                Build Your Pizza
              </Link>
              {isAuthenticated && (
                <Link
                  to="/my-orders"
                  className={`nav-link ${isActive('/my-orders') ? 'active' : ''}`}
                >
                  My Orders
                </Link>
              )}
            </div>
          )}
        </nav>

        {/* User Actions / Auth Buttons */}
        <div className="desktop-actions">
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <div className="user-chip">
                <div className="user-avatar">
                  {isAdmin ? <Shield size={16} /> : <User size={16} />}
                </div>
                <div className="user-info-text">
                  <span className="user-name">{user?.name}</span>
                  <span className="user-role">{isAdmin ? 'Administrator' : 'Customer'}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-logout" title="Log Out">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons-group">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Hamburger */}
        <button
          className="mobile-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer animate-fade-in">
          <div className="mobile-menu-links">
            {isAdmin ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/inventory"
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Inventory Management
                </Link>
                <Link
                  to="/admin/orders"
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders Management
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link
                  to="/builder"
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Build Your Pizza
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/my-orders"
                    className="mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                )}
              </>
            )}

            <div className="mobile-menu-divider" />

            {isAuthenticated ? (
              <div className="mobile-user-actions">
                <div className="mobile-user-details">
                  <span className="user-name">{user?.name}</span>
                  <span className="user-email">{user?.email}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary btn-full">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="mobile-auth-actions">
                <Link
                  to="/login"
                  className="btn btn-secondary btn-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .navbar-header {
          background-color: #ffffff;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'Poppins', sans-serif;
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--dark);
        }
        .brand-icon-wrapper {
          background: linear-gradient(135deg, var(--primary-red), var(--orange));
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(230, 57, 70, 0.25);
        }
        .brand-pizza-icon {
          width: 22px;
          height: 22px;
        }
        .brand-accent {
          color: var(--primary-red);
        }
        .admin-pill {
          background: var(--dark);
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 6px;
          letter-spacing: 0.05em;
        }
        .desktop-nav {
          display: flex;
          align-items: center;
        }
        .nav-links {
          display: flex;
          gap: 1.5rem;
        }
        .nav-link {
          font-weight: 600;
          color: var(--muted-text);
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          transition: var(--transition);
          font-size: 0.95rem;
        }
        .nav-link:hover {
          color: var(--primary-red);
          background-color: var(--cream);
        }
        .nav-link.active {
          color: var(--primary-red);
          background-color: var(--primary-red-light);
        }
        .desktop-actions {
          display: flex;
          align-items: center;
        }
        .auth-buttons-group {
          display: flex;
          gap: 0.75rem;
        }
        .user-profile-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .user-chip {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: #F8FAFC;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border);
        }
        .user-avatar {
          width: 30px;
          height: 30px;
          background: var(--orange-light);
          color: var(--orange);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-info-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }
        .user-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--dark);
        }
        .user-role {
          font-size: 0.7rem;
          color: var(--muted-text);
        }
        .btn-logout {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--muted-text);
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.4rem 0.6rem;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }
        .btn-logout:hover {
          color: var(--danger);
          background-color: var(--danger-light);
        }
        .mobile-hamburger {
          display: none;
          color: var(--dark);
          padding: 0.5rem;
        }
        .mobile-menu-drawer {
          position: absolute;
          top: 72px;
          left: 0;
          right: 0;
          background: white;
          border-bottom: 2px solid var(--border);
          box-shadow: var(--shadow-lg);
          padding: 1.5rem;
        }
        .mobile-menu-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .mobile-nav-link {
          font-weight: 600;
          font-size: 1.05rem;
          color: var(--dark);
          padding: 0.75rem 0.5rem;
          border-bottom: 1px solid #F1F5F9;
        }
        .mobile-menu-divider {
          height: 1px;
          background: var(--border);
          margin: 0.5rem 0;
        }
        .mobile-user-details {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }
        .mobile-user-details .user-email {
          font-size: 0.8rem;
          color: var(--muted-text);
        }
        .mobile-auth-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        @media (max-width: 768px) {
          .desktop-nav, .desktop-actions {
            display: none;
          }
          .mobile-hamburger {
            display: block;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
