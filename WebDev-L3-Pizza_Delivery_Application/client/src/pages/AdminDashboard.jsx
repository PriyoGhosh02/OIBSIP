import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  ShoppingBag,
  Clock,
  AlertTriangle,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  ShieldCheck,
  PackageCheck,
  Truck,
  Pizza,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    todayOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders || []);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      showToast('Failed to load dashboard metrics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="admin-page animate-fade-in">
      <div className="container" style={{ padding: '3rem 1.25rem 5rem' }}>
        {/* Top Header */}
        <div className="admin-header-row">
          <div>
            <span className="admin-tag">STORE MANAGEMENT CONSOLE</span>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">
              Overview of real-time store performance, kitchen orders, and ingredient stock.
            </p>
          </div>
          <div className="header-actions">
            <button
              onClick={fetchDashboardData}
              className="btn btn-secondary btn-sm"
              title="Refresh Stats"
            >
              <RefreshCw size={16} /> Refresh
            </button>
            <Link to="/admin/orders" className="btn btn-primary btn-sm">
              <ShoppingBag size={16} /> Manage Orders
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="stats-grid">
          {/* Card 1: Total Orders */}
          <div className="stat-card card">
            <div className="stat-card-top">
              <span className="stat-label">Total Orders</span>
              <div className="stat-icon-wrap icon-blue">
                <ShoppingBag size={22} />
              </div>
            </div>
            <div className="stat-value">{loading ? '...' : stats.totalOrders}</div>
            <div className="stat-footer">
              <TrendingUp size={14} color="var(--green)" />
              <span>Lifetime orders placed</span>
            </div>
          </div>

          {/* Card 2: Pending Orders */}
          <div className="stat-card card">
            <div className="stat-card-top">
              <span className="stat-label">Active / Pending</span>
              <div className="stat-icon-wrap icon-orange">
                <Clock size={22} />
              </div>
            </div>
            <div className="stat-value text-orange">{loading ? '...' : stats.pendingOrders}</div>
            <div className="stat-footer">
              <span>Orders currently in preparation or delivery</span>
            </div>
          </div>

          {/* Card 3: Low Stock Items */}
          <div className="stat-card card">
            <div className="stat-card-top">
              <span className="stat-label">Low Stock Items</span>
              <div className="stat-icon-wrap icon-red">
                <AlertTriangle size={22} />
              </div>
            </div>
            <div className={`stat-value ${stats.lowStockItems > 0 ? 'text-danger' : 'text-green'}`}>
              {loading ? '...' : stats.lowStockItems}
            </div>
            <div className="stat-footer">
              {stats.lowStockItems > 0 ? (
                <Link to="/admin/inventory" className="stat-action-link">
                  Needs replenishment &rarr;
                </Link>
              ) : (
                <span style={{ color: 'var(--green)' }}>All ingredients well stocked</span>
              )}
            </div>
          </div>

          {/* Card 4: Today's Orders */}
          <div className="stat-card card">
            <div className="stat-card-top">
              <span className="stat-label">Today's Orders</span>
              <div className="stat-icon-wrap icon-green">
                <Calendar size={22} />
              </div>
            </div>
            <div className="stat-value text-green">{loading ? '...' : stats.todayOrders}</div>
            <div className="stat-footer">
              <span>Placed since midnight today</span>
            </div>
          </div>
        </div>

        {/* Quick Nav Banners */}
        <div className="quick-nav-grid">
          <div className="nav-action-card card">
            <div className="action-card-content">
              <div className="action-icon icon-orange">
                <Layers size={28} />
              </div>
              <div>
                <h3 className="action-card-title">Inventory Management</h3>
                <p className="action-card-desc">
                  Monitor and manually adjust stock quantities for bases, sauces, cheeses, and vegetables.
                  Set automated low-stock alert thresholds.
                </p>
              </div>
            </div>
            <Link to="/admin/inventory" className="btn btn-secondary">
              Open Inventory <ArrowRight size={16} />
            </Link>
          </div>

          <div className="nav-action-card card">
            <div className="action-card-content">
              <div className="action-icon icon-blue">
                <ShoppingBag size={28} />
              </div>
              <div>
                <h3 className="action-card-title">Live Kitchen Orders</h3>
                <p className="action-card-desc">
                  View incoming customer orders, review pizza configurations, and advance order status in real time
                  via Socket.IO.
                </p>
              </div>
            </div>
            <Link to="/admin/orders" className="btn btn-primary">
              View All Orders <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Recent Orders Preview */}
        <div className="recent-orders-section card">
          <div className="recent-header">
            <div className="recent-title-group">
              <Pizza size={22} color="var(--primary-red)" />
              <h3 className="recent-title">Recent Incoming Orders</h3>
            </div>
            <Link to="/admin/orders" className="view-all-link">
              View All ({stats.totalOrders}) &rarr;
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted-text)' }}>
              Loading recent orders...
            </div>
          ) : recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted-text)' }}>
              No orders have been received yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Pizza Recipe</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <strong>#{order._id.slice(-6).toUpperCase()}</strong>
                      </td>
                      <td>
                        <div className="customer-cell">
                          <span className="cust-name">{order.userId?.name || 'Guest'}</span>
                          <span className="cust-email">{order.userId?.email || ''}</span>
                        </div>
                      </td>
                      <td>
                        <span className="recipe-snippet">
                          {order.items?.base} &bull; {order.items?.sauce} &bull; {order.items?.cheese}
                        </span>
                      </td>
                      <td>
                        <strong>₹{order.totalAmount}</strong>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            order.paymentStatus === 'Paid'
                              ? 'badge-success'
                              : order.paymentStatus === 'Pending'
                              ? 'badge-warning'
                              : 'badge-danger'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-primary">{order.orderStatus}</span>
                      </td>
                      <td>
                        <Link to="/admin/orders" className="btn btn-secondary btn-sm">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-page {
          background-color: var(--bg-light);
          min-height: calc(100vh - 160px);
        }
        .admin-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2.5rem;
        }
        .admin-tag {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--orange);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .admin-title {
          font-size: 2.25rem;
          margin: 0.25rem 0 0.4rem;
        }
        .admin-subtitle {
          color: var(--muted-text);
          font-size: 0.95rem;
        }
        .header-actions {
          display: flex;
          gap: 0.75rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .stat-card {
          padding: 1.75rem;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .stat-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .stat-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--muted-text);
        }
        .stat-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-blue {
          background: #EFF6FF;
          color: #3B82F6;
        }
        .icon-orange {
          background: #FFF7ED;
          color: var(--orange);
        }
        .icon-red {
          background: #FEF2F2;
          color: var(--danger);
        }
        .icon-green {
          background: #F0FDF4;
          color: var(--green);
        }
        .stat-value {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--dark);
          line-height: 1;
          margin-bottom: 0.75rem;
          font-family: 'Poppins', sans-serif;
        }
        .text-orange {
          color: var(--orange);
        }
        .text-danger {
          color: var(--danger);
        }
        .text-green {
          color: var(--green);
        }
        .stat-footer {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--muted-text);
          border-top: 1px solid #F1F5F9;
          padding-top: 0.75rem;
        }
        .stat-action-link {
          color: var(--danger);
          font-weight: 700;
        }
        .stat-action-link:hover {
          text-decoration: underline;
        }
        .quick-nav-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .nav-action-card {
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .action-card-content {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
        }
        .action-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .action-card-title {
          font-size: 1.25rem;
          margin-bottom: 0.35rem;
        }
        .action-card-desc {
          font-size: 0.85rem;
          color: var(--muted-text);
          line-height: 1.5;
          max-width: 380px;
        }
        .recent-orders-section {
          padding: 2rem;
        }
        .recent-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }
        .recent-title-group {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .recent-title {
          font-size: 1.25rem;
        }
        .view-all-link {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--primary-red);
        }
        .table-responsive {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }
        .admin-table th {
          background-color: #F8FAFC;
          color: var(--muted-text);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.85rem 1rem;
          border-bottom: 2px solid var(--border);
        }
        .admin-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          vertical-align: middle;
        }
        .customer-cell {
          display: flex;
          flex-direction: column;
        }
        .cust-name {
          font-weight: 600;
          color: var(--dark);
        }
        .cust-email {
          font-size: 0.75rem;
          color: var(--muted-text);
        }
        .recipe-snippet {
          color: var(--muted-text);
          font-size: 0.85rem;
        }
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .quick-nav-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .admin-header-row {
            flex-direction: column;
            gap: 1rem;
          }
          .nav-action-card {
            flex-direction: column;
            text-align: center;
          }
          .action-card-content {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
