import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  ChefHat,
  Truck,
  Pizza,
  CreditCard,
  RefreshCw,
  Search,
  Filter,
  User,
  MapPin,
  ChevronDown,
} from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const { showToast } = useToast();

  const statusOptions = ['Order Received', 'In Kitchen', 'Sent to Delivery'];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
      showToast('Failed to load orders.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Listen for live order updates / incoming orders via Socket.IO
    const socketServerUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : 'http://localhost:5000';

    const socket = io(socketServerUrl, {
      withCredentials: true,
    });

    socket.on('orderStatusUpdated', (updatedOrder) => {
      setOrders((prev) => {
        const exists = prev.some((o) => o._id === updatedOrder._id);
        if (exists) {
          return prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o));
        } else {
          // New order placed! Prepend to list
          showToast(`🔔 New incoming order received! (#${updatedOrder._id.slice(-6)})`, 'info');
          return [updatedOrder, ...prev];
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await api.patch(`/admin/orders/${orderId}/status`, {
        status: newStatus,
      });

      if (res.data.success) {
        showToast(
          `Order #${orderId.slice(-6).toUpperCase()} updated to "${newStatus}".`,
          'success'
        );
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data.order : o))
        );
      }
    } catch (err) {
      console.error('Status update error:', err);
      showToast(err.response?.data?.message || 'Failed to update order status.', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filterStatus === 'All' || order.orderStatus === filterStatus;

    const query = searchQuery.toLowerCase();
    const orderIdMatch = order._id.toLowerCase().includes(query);
    const customerNameMatch = order.userId?.name?.toLowerCase().includes(query);
    const customerEmailMatch = order.userId?.email?.toLowerCase().includes(query);

    return matchesFilter && (orderIdMatch || customerNameMatch || customerEmailMatch);
  });

  return (
    <div className="admin-page animate-fade-in">
      <div className="container" style={{ padding: '3rem 1.25rem 5rem' }}>
        {/* Header */}
        <div className="orders-header-row">
          <div>
            <span className="admin-tag">KITCHEN DISPATCH & FULFILLMENT</span>
            <h1 className="admin-title">Order Management</h1>
            <p className="admin-subtitle">
              Live incoming customer orders. Advance status through kitchen prep and delivery dispatch in real time.
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="btn btn-secondary btn-sm"
            title="Reload Orders"
          >
            <RefreshCw size={16} /> Refresh List
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="orders-controls card">
          <div className="status-tabs">
            {['All', 'Order Received', 'In Kitchen', 'Sent to Delivery'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`status-tab-btn ${filterStatus === tab ? 'active' : ''}`}
              >
                {tab}
                {tab !== 'All' && (
                  <span className="count-pill">
                    {orders.filter((o) => o.orderStatus === tab).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="search-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by order ID, customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Orders List / Cards */}
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '5rem', color: 'var(--muted-text)' }}>
            <div style={{ fontSize: '2.5rem', animation: 'spin 1s infinite' }}>🍕</div>
            <p style={{ marginTop: '1rem' }}>Loading live orders from MongoDB...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted-text)' }}>
            <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3>No orders found</h3>
            <p>No orders match the current filter selection.</p>
          </div>
        ) : (
          <div className="admin-orders-list">
            {filteredOrders.map((order) => {
              const isUpdating = updatingOrderId === order._id;

              return (
                <div key={order._id} className="admin-order-card card">
                  <div className="admin-order-top">
                    <div className="order-id-group">
                      <div className="id-badge">
                        <Pizza size={18} color="var(--primary-red)" />
                        <strong>#ORD-{order._id.slice(-6).toUpperCase()}</strong>
                      </div>
                      <span className="order-time-stamp">
                        <Clock size={14} />
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="order-top-badges">
                      <span
                        className={`badge ${
                          order.paymentStatus === 'Paid'
                            ? 'badge-success'
                            : order.paymentStatus === 'Pending'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        <CreditCard size={12} /> {order.paymentStatus}
                      </span>
                      <span className="badge badge-primary">{order.orderStatus}</span>
                    </div>
                  </div>

                  <div className="admin-order-body-grid">
                    {/* Customer Info */}
                    <div className="order-col customer-col">
                      <div className="col-header">
                        <User size={16} color="var(--orange)" />
                        <span>Customer Details</span>
                      </div>
                      <p className="cust-full-name">{order.userId?.name || 'Guest'}</p>
                      <p className="cust-contact-info">{order.userId?.email || 'No email'}</p>
                      <div className="delivery-address-box">
                        <MapPin size={14} color="var(--muted-text)" />
                        <span>
                          {order.deliveryAddress?.street}, {order.deliveryAddress?.city}{' '}
                          ({order.deliveryAddress?.phone})
                        </span>
                      </div>
                    </div>

                    {/* Pizza Configuration */}
                    <div className="order-col recipe-col">
                      <div className="col-header">
                        <Pizza size={16} color="var(--primary-red)" />
                        <span>Pizza Configuration</span>
                      </div>
                      <div className="recipe-grid">
                        <div className="recipe-line">
                          <span className="line-label">Base:</span>
                          <strong className="line-val">{order.items?.base}</strong>
                        </div>
                        <div className="recipe-line">
                          <span className="line-label">Sauce:</span>
                          <strong className="line-val">{order.items?.sauce}</strong>
                        </div>
                        <div className="recipe-line">
                          <span className="line-label">Cheese:</span>
                          <strong className="line-val">{order.items?.cheese}</strong>
                        </div>
                        <div className="recipe-line veg-line">
                          <span className="line-label">Veggies:</span>
                          <span className="veg-tags-wrap">
                            {order.items?.vegetables?.length > 0 ? (
                              order.items.vegetables.map((v) => (
                                <span key={v} className="mini-veg-pill">
                                  {v}
                                </span>
                              ))
                            ) : (
                              <em className="text-muted">None</em>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Total & Status Updater */}
                    <div className="order-col action-col">
                      <div className="amount-group">
                        <span className="amt-label">Order Total</span>
                        <h2 className="grand-amount">₹{order.totalAmount}</h2>
                      </div>

                      <div className="status-updater-wrap">
                        <label className="updater-label">Update Kitchen Status:</label>
                        <div className="status-button-group">
                          {statusOptions.map((st) => {
                            const isCurrent = order.orderStatus === st;
                            return (
                              <button
                                key={st}
                                onClick={() => !isCurrent && handleStatusChange(order._id, st)}
                                disabled={isUpdating || isCurrent}
                                className={`status-toggle-btn ${isCurrent ? 'current' : ''}`}
                              >
                                {st === 'Order Received' && <CheckCircle2 size={14} />}
                                {st === 'In Kitchen' && <ChefHat size={14} />}
                                {st === 'Sent to Delivery' && <Truck size={14} />}
                                {st}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .orders-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        .orders-controls {
          padding: 1rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1.25rem;
          flex-wrap: wrap;
        }
        .status-tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .status-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--muted-text);
          background: #F1F5F9;
          transition: var(--transition);
        }
        .status-tab-btn:hover {
          background: #E2E8F0;
          color: var(--dark);
        }
        .status-tab-btn.active {
          background: var(--dark);
          color: white;
        }
        .count-pill {
          background: rgba(255,255,255,0.25);
          font-size: 0.75rem;
          padding: 1px 6px;
          border-radius: 999px;
        }
        .status-tab-btn:not(.active) .count-pill {
          background: #CBD5E1;
          color: var(--dark);
        }
        .search-wrap {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 280px;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--muted-text);
        }
        .search-input {
          width: 100%;
          padding: 0.5rem 1rem 0.5rem 36px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          font-size: 0.9rem;
          outline: none;
        }
        .search-input:focus {
          border-color: var(--orange);
        }
        .admin-orders-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .admin-order-card {
          padding: 1.75rem;
          border-radius: var(--radius-lg);
          border: 1.5px solid var(--border);
        }
        .admin-order-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 1.5rem;
        }
        .order-id-group {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .id-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.15rem;
          color: var(--dark);
        }
        .order-time-stamp {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
          color: var(--muted-text);
        }
        .order-top-badges {
          display: flex;
          gap: 0.5rem;
        }
        .admin-order-body-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr 1.2fr;
          gap: 1.75rem;
          background: #FAFAFA;
          padding: 1.5rem;
          border-radius: var(--radius-md);
        }
        .order-col {
          display: flex;
          flex-direction: column;
        }
        .col-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted-text);
          margin-bottom: 0.75rem;
        }
        .cust-full-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--dark);
          margin-bottom: 0.2rem;
        }
        .cust-contact-info {
          font-size: 0.85rem;
          color: var(--muted-text);
          margin-bottom: 0.75rem;
        }
        .delivery-address-box {
          display: flex;
          align-items: flex-start;
          gap: 0.35rem;
          font-size: 0.85rem;
          color: var(--dark-text);
          line-height: 1.4;
        }
        .recipe-grid {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.9rem;
        }
        .recipe-line {
          display: flex;
          gap: 0.5rem;
        }
        .line-label {
          color: var(--muted-text);
          width: 65px;
          flex-shrink: 0;
        }
        .line-val {
          color: var(--dark);
        }
        .veg-line {
          align-items: flex-start;
        }
        .veg-tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }
        .mini-veg-pill {
          background: white;
          border: 1px solid var(--border);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          color: var(--dark);
        }
        .action-col {
          border-left: 1px solid var(--border);
          padding-left: 1.5rem;
          justify-content: space-between;
        }
        .amount-group {
          margin-bottom: 1rem;
        }
        .amt-label {
          font-size: 0.8rem;
          color: var(--muted-text);
          font-weight: 600;
          display: block;
        }
        .grand-amount {
          font-size: 1.8rem;
          color: var(--primary-red);
          line-height: 1.1;
        }
        .updater-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--dark);
          margin-bottom: 0.5rem;
          display: block;
        }
        .status-button-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .status-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          background: white;
          border: 1px solid var(--border);
          color: var(--muted-text);
          transition: var(--transition);
          text-align: left;
        }
        .status-toggle-btn:hover:not(:disabled) {
          border-color: var(--primary-red);
          color: var(--primary-red);
          background: #FFF5F5;
        }
        .status-toggle-btn.current {
          background: var(--dark);
          border-color: var(--dark);
          color: white;
          cursor: default;
        }
        @media (max-width: 900px) {
          .admin-order-body-grid {
            grid-template-columns: 1fr;
          }
          .action-col {
            border-left: none;
            border-top: 1px solid var(--border);
            padding-left: 0;
            padding-top: 1.25rem;
          }
          .status-button-group {
            flex-direction: row;
            flex-wrap: wrap;
          }
        }
        @media (max-width: 640px) {
          .admin-order-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;
