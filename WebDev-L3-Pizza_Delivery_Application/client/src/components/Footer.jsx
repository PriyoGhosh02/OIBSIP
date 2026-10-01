import React from 'react';
import { Link } from 'react-router-dom';
import { Pizza, Heart, Clock, ShieldCheck, PhoneCall } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <div className="brand-icon-wrapper-sm">
                <Pizza size={20} />
              </div>
              <span className="brand-name">Pizza<span className="brand-accent">Hub</span></span>
            </div>
            <p className="footer-desc">
              Freshly baked artisanal pizzas made from fresh ingredients, secret sauces, and pure love.
              Delivered piping hot to your doorstep!
            </p>
            <div className="footer-perks">
              <span className="perk-item"><Clock size={16} /> 30-Min Delivery</span>
              <span className="perk-item"><ShieldCheck size={16} /> 100% Fresh Dough</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Menu & Build</h4>
            <ul className="footer-links">
              <li><Link to="/">Signature Pizzas</Link></li>
              <li><Link to="/builder">Pizza Builder Wizard</Link></li>
              <li><Link to="/my-orders">Track Live Order</Link></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="footer-col">
            <h4 className="footer-heading">Customer Hub</h4>
            <ul className="footer-links">
              <li><Link to="/login">User Account Login</Link></li>
              <li><Link to="/register">Create New Account</Link></li>
              <li><Link to="/admin/login">Staff & Admin Portal</Link></li>
            </ul>
          </div>

          {/* Delivery Hours */}
          <div className="footer-col">
            <h4 className="footer-heading">Kitchen Hours</h4>
            <p className="footer-text">Monday – Sunday</p>
            <p className="footer-highlight">11:00 AM – 11:30 PM</p>
            <div className="footer-contact">
              <PhoneCall size={16} />
              <span>+1 (800) 555-PIZZA</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PizzaHub Delivery App. Built with React & Node.js.</p>
          <div className="admin-link-subtle">
            <Link to="/admin/login">Admin Access</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer-section {
          background-color: var(--dark);
          color: #94A3B8;
          padding: 3.5rem 0 1.5rem;
          margin-top: auto;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.2fr;
          gap: 2.5rem;
          margin-bottom: 2.5rem;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'Poppins', sans-serif;
          font-size: 1.35rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.75rem;
        }
        .brand-icon-wrapper-sm {
          background: linear-gradient(135deg, var(--primary-red), var(--orange));
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .footer-desc {
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.25rem;
          max-width: 340px;
        }
        .footer-perks {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #CBD5E1;
        }
        .perk-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .footer-heading {
          color: white;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          font-size: 0.9rem;
        }
        .footer-links a:hover {
          color: var(--orange);
          text-decoration: underline;
        }
        .footer-text {
          font-size: 0.85rem;
          margin-bottom: 0.25rem;
        }
        .footer-highlight {
          color: #F8FAFC;
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        .footer-contact {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--orange);
          font-weight: 600;
          font-size: 0.9rem;
        }
        .footer-bottom {
          border-top: 1px solid #334155;
          padding-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
        }
        .admin-link-subtle a {
          color: #64748B;
          font-size: 0.8rem;
        }
        .admin-link-subtle a:hover {
          color: #CBD5E1;
        }
        @media (max-width: 868px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }
        @media (max-width: 520px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 0.75rem;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
