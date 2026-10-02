import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  Sparkles,
} from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get('/orders/my-orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      if (!silent) console.error('Failed to load orders:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Auto-sync polling every 6 seconds for serverless deployments
    const pollInterval = setInterval(() => {
      fetchOrders(true);
    }, 6000);

    // Setup Socket.IO listener for real-time status updates when supported
    const socketServerUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
        ? 'http://localhost:5000'
        : (typeof window !== 'undefined' ? window.location.origin : '');

    let socket;
    try {
      socket = io(socketServerUrl, {
        withCredentials: true,
        reconnectionAttempts: 3,
        timeout: 5000,
      });

      socket.on('orderStatusUpdated', (updatedOrder) => {
        setOrders((prevOrders) => {
          const orderExists = prevOrders.some((o) => o._id === updatedOrder._id);
          if (orderExists) {
            showToast(
              `Order #${updatedOrder._id.slice(-6)} status updated to: "${updatedOrder.orderStatus}"!`,
              'info'
            );
            return prevOrders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o));
          }
          return prevOrders;
        });
      });
    } catch (_) {}

    return () => {
      clearInterval(pollInterval);
      if (socket) socket.disconnect();
    };
  }, []);

  const getStatusStepNumber = (status) => {
    switch (status) {
      case 'Order Received':
        return 1;
      case 'In Kitchen':
        return 2;
      case 'Sent to Delivery':
        return 3;
      default:
        return 1;
    }
  };

  return (
    <div className="orders-page animate-fade-in">
      <div className="container" style={{ padding: '3.5rem 1.25rem 5rem' }}>
        <div className="orders-page-header">
          <div>
            <span className="orders-badge">
              <Sparkles size={14} /> Real-Time Order Stream
            </span>
            <h1 className="page-title">My Orders</h1>
            <p className="page-subtitle">
              Live updates via Socket.IO — statuses refresh automatically as our kitchen cooks!
            </p>
          </div>
          <button onClick={fetchOrders} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="orders-loading card">
            <div className="loading-spinner">🍕</div>
            <p>Fetching your order history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty card">
            <div className="empty-icon-wrap">
              <ShoppingBag size={48} />
            </div>
            <h2>No orders yet!</h2>
            <p>You haven't ordered any handcrafted pizzas yet. Build your first custom pizza now!</p>
            <Link to="/builder" className="btn btn-primary btn-lg mt-3">
              Build Your Pizza Now
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const currentStep = getStatusStepNumber(order.orderStatus);

              return (
                <div key={order._id} className="order-card card">
                  <div className="order-card-header">
                    <div className="order-ref-group">
                      <div className="order-id-badge">
                        <Pizza size={18} color="var(--primary-red)" />
                        <span>Order #{order._id.slice(-6).toUpperCase()}</span>
                      </div>
                      <span className="order-date">
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

                    <div className="order-badges-group">
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
                      <span className="badge badge-primary">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* 3-Step Live Progress Tracker */}
                  <div className="order-status-tracker">
                    <div className={`status-node ${currentStep >= 1 ? 'completed active' : ''}`}>
                      <div className="node-icon">
                        <CheckCircle2 size={18} />
                      </div>
                      <span className="node-title">Order Received</span>
                    </div>

                    <div className={`status-line ${currentStep >= 2 ? 'filled' : ''}`} />

                    <div className={`status-node ${currentStep >= 2 ? 'completed active' : ''}`}>
                      <div className="node-icon">
                        <ChefHat size={18} />
                      </div>
                      <span className="node-title">In Kitchen</span>
                    </div>

                    <div className={`status-line ${currentStep >= 3 ? 'filled' : ''}`} />

                    <div className={`status-node ${currentStep >= 3 ? 'completed active' : ''}`}>
                      <div className="node-icon">
                        <Truck size={18} />
                      </div>
                      <span className="node-title">Sent to Delivery</span>
                    </div>
                  </div>

                  {/* Pizza Details Breakdown */}
                  <div className="order-details-grid">
                    <div className="order-config-box">
                      <h4 className="box-title">Pizza Recipe</h4>
                      <p className="order-item-text">
                        <strong>Base:</strong> {order.items?.base}
                      </p>
                      <p className="order-item-text">
                        <strong>Sauce:</strong> {order.items?.sauce}
                      </p>
                      <p className="order-item-text">
                        <strong>Cheese:</strong> {order.items?.cheese}
                      </p>
                      <div className="order-item-text">
                        <strong>Vegetables:</strong>{' '}
                        {order.items?.vegetables?.length > 0 ? (
                          <span className="order-veg-list">
                            {order.items.vegetables.join(', ')}
                          </span>
                        ) : (
                          'None'
                        )}
                      </div>
                    </div>

                    <div className="order-address-box">
                      <h4 className="box-title">Delivering To</h4>
                      <p className="order-item-text">
                        {order.deliveryAddress?.street}, {order.deliveryAddress?.city}{' '}
                        {order.deliveryAddress?.postalCode}
                      </p>
                      <p className="order-item-text">
                        <strong>Phone:</strong> {order.deliveryAddress?.phone}
                      </p>
                      {order.paymentId && (
                        <p className="order-item-text tx-id">
                          <strong>Payment Ref:</strong> {order.paymentId}
                        </p>
                      )}
                    </div>

                    <div className="order-total-box">
                      <span className="total-label">Grand Total</span>
                      <strong className="total-amount-display">₹{order.totalAmount}</strong>
                      <span className="subtotal-small">
                        (Subtotal: ₹{order.subtotal} + Delivery: ₹{order.deliveryFee})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .orders-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2.5rem;
        }
        .orders-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--cream);
          color: var(--orange);
          font-weight: 700;
          font-size: 0.8rem;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          margin-bottom: 0.5rem;
        }
        .orders-loading, .orders-empty {
          text-align: center;
          padding: 5rem 2rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .empty-icon-wrap {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #F1F5F9;
          color: var(--muted-text);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }
        .orders-empty h2 {
          font-size: 1.6rem;
          margin-bottom: 0.5rem;
        }
        .orders-empty p {
          color: var(--muted-text);
          max-width: 440px;
          margin: 0 auto;
        }
        .mt-3 {
          margin-top: 1.5rem;
        }
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .order-card {
          padding: 2rem;
          border-radius: var(--radius-lg);
          border: 1.5px solid var(--border);
        }
        .order-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 2rem;
        }
        .order-ref-group {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .order-id-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 800;
          font-size: 1.15rem;
          color: var(--dark);
        }
        .order-date {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: var(--muted-text);
        }
        .order-badges-group {
          display: flex;
          gap: 0.6rem;
        }
        /* 3-Step Live Progress Tracker */
        .order-status-tracker {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 1.5rem 0 2.5rem;
          padding: 1.25rem 2rem;
          background: #F8FAFC;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
        }
        .status-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          z-index: 1;
        }
        .node-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: white;
          border: 2px solid var(--border);
          color: var(--muted-text);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        .status-node.completed .node-icon {
          background: var(--green);
          border-color: var(--green);
          color: white;
        }
        .status-node.active .node-icon {
          box-shadow: 0 0 0 5px var(--green-light);
        }
        .node-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--muted-text);
        }
        .status-node.completed .node-title {
          color: var(--dark);
        }
        .status-line {
          flex: 1;
          height: 4px;
          background: var(--border);
          margin: 0 1rem;
          margin-bottom: 1.5rem;
          transition: var(--transition);
        }
        .status-line.filled {
          background: var(--green);
        }
        /* Details Grid */
        .order-details-grid {
          display: grid;
          grid-template-columns: 1.2fr 1.2fr 1fr;
          gap: 1.5rem;
          background: #FAFAFA;
          padding: 1.5rem;
          border-radius: var(--radius-md);
        }
        .box-title {
          font-size: 0.85rem;
          text-transform: uppercase;
          color: var(--muted-text);
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }
        .order-item-text {
          font-size: 0.9rem;
          margin-bottom: 0.35rem;
          color: var(--dark-text);
        }
        .order-veg-list {
          color: var(--orange);
          font-weight: 500;
        }
        .tx-id {
          font-size: 0.75rem;
          color: var(--muted-text);
          word-break: break-all;
        }
        .order-total-box {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          border-left: 1px solid var(--border);
          padding-left: 1.5rem;
        }
        .total-label {
          font-size: 0.85rem;
          color: var(--muted-text);
          font-weight: 600;
        }
        .total-amount-display {
          font-size: 1.75rem;
          color: var(--primary-red);
        }
        .subtotal-small {
          font-size: 0.75rem;
          color: var(--muted-text);
        }
        @media (max-width: 860px) {
          .order-details-grid {
            grid-template-columns: 1fr;
          }
          .order-total-box {
            border-left: none;
            border-top: 1px solid var(--border);
            padding-left: 0;
            padding-top: 1rem;
            align-items: flex-start;
          }
        }
        @media (max-width: 640px) {
          .order-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .order-status-tracker {
            padding: 1rem 0.5rem;
          }
          .node-title {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MyOrders;
