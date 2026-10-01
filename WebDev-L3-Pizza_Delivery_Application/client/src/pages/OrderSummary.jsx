import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePizza } from '../context/PizzaContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  Pizza,
  MapPin,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  Edit2,
  Sparkles,
} from 'lucide-react';

const OrderSummary = () => {
  const navigate = useNavigate();
  const { pizza, resetPizza, calculatePricing } = usePizza();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [address, setAddress] = useState({
    street: '42 Blossom Avenue, Apt 4B',
    city: 'Foodville',
    postalCode: '10001',
    phone: '9876543210',
  });

  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const pricing = calculatePricing();

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = async () => {
    if (!isAuthenticated) {
      showToast('Please login to complete your pizza order.', 'warning');
      navigate('/login', { state: { from: { pathname: '/summary' } } });
      return;
    }

    if (!address.street || !address.city || !address.phone) {
      setErrorMsg('Please provide your complete delivery address and contact phone number.');
      return;
    }

    setErrorMsg('');
    setProcessing(true);

    try {
      // 1. Create Pending Order on Backend (validates stock & calculates server price)
      const orderRes = await api.post('/orders', {
        items: pizza,
        deliveryAddress: address,
      });

      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || 'Failed to initialize order.');
      }

      const orderData = orderRes.data.order;
      setCurrentOrder(orderData);

      // 2. Create Razorpay Test Payment Order
      const paymentRes = await api.post('/payment/create', {
        orderId: orderData._id,
      });

      const { razorpayOrderId, amount, currency, keyId, isSandboxMock } = paymentRes.data;

      // 3. Check if real Razorpay checkout is available in browser
      if (
        window.Razorpay &&
        keyId &&
        !keyId.includes('sandbox') &&
        !isSandboxMock
      ) {
        const options = {
          key: keyId,
          amount: amount,
          currency: currency,
          name: 'PizzaHub Delivery',
          description: `Order #${orderData._id.slice(-6)} - Test Mode`,
          order_id: razorpayOrderId,
          prefill: {
            name: user.name,
            email: user.email,
            contact: address.phone,
          },
          theme: {
            color: '#E63946',
          },
          handler: async function (response) {
            await verifyOrderPayment({
              orderId: orderData._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
              showToast('Payment window was dismissed.', 'info');
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (failRes) {
          setErrorMsg(failRes.error.description || 'Payment failed.');
          setProcessing(false);
        });
        rzp.open();
      } else {
        // Display Sandbox Test Checkout Modal for smooth local development / evaluation
        setShowSandboxModal(true);
      }
    } catch (err) {
      console.error('Payment flow error:', err);
      const msg = err.response?.data?.message || err.message || 'Payment processing error.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setProcessing(false);
    }
  };

  // 4. Verify Payment on Backend
  const verifyOrderPayment = async (payload) => {
    try {
      setProcessing(true);
      const res = await api.post('/payment/verify', payload);

      if (res.data.success) {
        showToast('Payment Successful! Order Confirmed 🎉', 'success');
        resetPizza();
        navigate('/my-orders');
      } else {
        throw new Error(res.data.message || 'Payment confirmation failed.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Verification error.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setProcessing(false);
      setShowSandboxModal(false);
    }
  };

  const handleSimulatedTestPayment = async () => {
    if (!currentOrder) return;
    await verifyOrderPayment({
      orderId: currentOrder._id,
      razorpay_order_id: currentOrder.razorpayOrderId || `order_test_${Date.now()}`,
      razorpay_payment_id: `pay_test_${Date.now()}_simulated`,
      simulated: true,
    });
  };

  return (
    <div className="summary-page animate-fade-in">
      <div className="container" style={{ padding: '3rem 1.25rem 5rem' }}>
        <div className="summary-header">
          <Link to="/builder" className="back-link">
            <ArrowLeft size={16} /> Edit Pizza
          </Link>
          <h1 className="page-title">Order Summary</h1>
          <p className="page-subtitle">Review your custom creation and finalize delivery details.</p>
        </div>

        {errorMsg && (
          <div className="error-alert">
            <AlertCircle size={20} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="summary-grid">
          {/* Pizza Configuration Card */}
          <div className="card summary-main-card">
            <div className="card-top-title">
              <div className="pizza-title-group">
                <Pizza size={24} color="var(--primary-red)" />
                <h2>Your Pizza</h2>
              </div>
              <Link to="/builder" className="btn btn-secondary btn-sm">
                <Edit2 size={14} /> Edit
              </Link>
            </div>

            <div className="config-item-list">
              <div className="config-row">
                <div className="config-meta">
                  <span className="config-tag">Base</span>
                  <h4 className="config-name">{pizza.base}</h4>
                </div>
                <span className="check-badge"><CheckCircle2 size={16} color="var(--green)" /> Ready</span>
              </div>

              <div className="config-row">
                <div className="config-meta">
                  <span className="config-tag">Sauce</span>
                  <h4 className="config-name">{pizza.sauce}</h4>
                </div>
                <span className="check-badge"><CheckCircle2 size={16} color="var(--green)" /> Ready</span>
              </div>

              <div className="config-row">
                <div className="config-meta">
                  <span className="config-tag">Cheese</span>
                  <h4 className="config-name">{pizza.cheese}</h4>
                </div>
                <span className="check-badge"><CheckCircle2 size={16} color="var(--green)" /> Ready</span>
              </div>

              <div className="config-row veg-config-row">
                <div className="config-meta">
                  <span className="config-tag">Vegetables</span>
                  <div className="vegetable-pill-list">
                    {pizza.vegetables.length === 0 ? (
                      <span className="empty-text">No vegetables selected</span>
                    ) : (
                      pizza.vegetables.map((v) => (
                        <span key={v} className="veg-badge">
                          {v}
                        </span>
                      ))
                    )}
                  </div>
                </div>
                <span className="check-badge"><CheckCircle2 size={16} color="var(--green)" /> {pizza.vegetables.length} Items</span>
              </div>
            </div>

            <div className="address-section">
              <div className="address-header">
                <MapPin size={20} color="var(--orange)" />
                <h3>Delivery Address</h3>
              </div>

              <div className="address-form-grid">
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    className="form-input"
                    placeholder="e.g. 123 Main St, Apt 4"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="form-input"
                    placeholder="e.g. New York"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleAddressChange}
                    className="form-input"
                    placeholder="10001"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    className="form-input"
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Checkout Summary Card */}
          <div className="summary-sidebar-col">
            <div className="card payment-summary-card">
              <h3 className="bill-title">Payment Summary</h3>

              <div className="bill-rows">
                <div className="bill-row">
                  <span>Subtotal</span>
                  <strong>₹{pricing.subtotal}</strong>
                </div>
                <div className="bill-row">
                  <span>Delivery Fee</span>
                  <span>₹{pricing.deliveryFee}</span>
                </div>
                <div className="bill-row promo-row">
                  <span>Freshness Guarantee</span>
                  <span className="free-text">FREE</span>
                </div>
                <div className="bill-divider" />
                <div className="bill-row total-bill-row">
                  <div>
                    <span className="total-title">Total</span>
                    <span className="tax-notice">Includes all taxes</span>
                  </div>
                  <strong className="grand-total">₹{pricing.total}</strong>
                </div>
              </div>

              <div className="payment-mode-pill">
                <CreditCard size={18} color="var(--primary-red)" />
                <span>Razorpay Test Mode / Sandbox</span>
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={processing}
                className="btn btn-primary btn-full btn-lg checkout-btn"
              >
                {processing ? (
                  'Validating & Opening Checkout...'
                ) : (
                  <>
                    <CreditCard size={18} />
                    Proceed to Payment
                  </>
                )}
              </button>

              <div className="security-badges">
                <span className="sec-item"><ShieldCheck size={14} color="var(--green)" /> Safe Test Checkout</span>
                <span className="sec-item"><Truck size={14} color="var(--orange)" /> Free Fast Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Test Mode / Sandbox Modal */}
      {showSandboxModal && (
        <div className="modal-backdrop animate-fade-in">
          <div className="sandbox-modal card">
            <div className="sandbox-modal-header">
              <div className="modal-icon-wrap">
                <CreditCard size={28} />
              </div>
              <h3>Razorpay Test Checkout</h3>
              <p className="modal-subtitle">
                Official Razorpay Sandbox Test Mode Payment Verification
              </p>
            </div>

            <div className="sandbox-details-card">
              <div className="sb-row">
                <span>Order Reference:</span>
                <strong>#{currentOrder?._id?.slice(-8)}</strong>
              </div>
              <div className="sb-row">
                <span>Total Amount:</span>
                <strong className="text-red">₹{currentOrder?.totalAmount}</strong>
              </div>
              <div className="sb-row">
                <span>Customer:</span>
                <span>{user?.name} ({user?.email})</span>
              </div>
              <div className="sb-row">
                <span>Payment Mode:</span>
                <span className="badge badge-success">Razorpay Test Sandbox</span>
              </div>
            </div>

            <p className="sandbox-note">
              Click <strong>"Complete Test Payment"</strong> to simulate a successful Razorpay transaction. The backend will verify credentials, confirm the order, deduct ingredient stock atomically from MongoDB, and notify the kitchen!
            </p>

            <div className="sandbox-actions">
              <button
                onClick={() => setShowSandboxModal(false)}
                className="btn btn-secondary flex-1"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleSimulatedTestPayment}
                className="btn btn-primary flex-1"
                disabled={processing}
              >
                {processing ? 'Confirming...' : 'Complete Test Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .summary-header {
          margin-bottom: 2.5rem;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--muted-text);
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }
        .back-link:hover {
          color: var(--primary-red);
        }
        .page-title {
          font-size: 2.25rem;
          margin-bottom: 0.35rem;
        }
        .page-subtitle {
          color: var(--muted-text);
          font-size: 1rem;
        }
        .error-alert {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #FEE2E2;
          border: 1px solid #FCA5A5;
          color: var(--danger);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          margin-bottom: 2rem;
          font-weight: 500;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 2.5rem;
          align-items: start;
        }
        .summary-main-card {
          padding: 2.25rem;
        }
        .card-top-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }
        .pizza-title-group {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .pizza-title-group h2 {
          font-size: 1.4rem;
        }
        .config-item-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        .config-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #F8FAFC;
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
        }
        .config-meta {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .config-tag {
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--muted-text);
          letter-spacing: 0.05em;
        }
        .config-name {
          font-size: 1.05rem;
          color: var(--dark);
        }
        .check-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--green);
        }
        .veg-config-row {
          align-items: flex-start;
        }
        .vegetable-pill-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.35rem;
        }
        .veg-badge {
          background: white;
          border: 1px solid var(--border);
          color: var(--dark);
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
        }
        .empty-text {
          font-size: 0.85rem;
          color: var(--muted-text);
          font-style: italic;
        }
        .address-section {
          border-top: 1px solid var(--border);
          padding-top: 2rem;
        }
        .address-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .address-header h3 {
          font-size: 1.2rem;
        }
        .address-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        /* Sidebar Bill */
        .payment-summary-card {
          padding: 2rem;
          border-radius: var(--radius-xl);
          border: 1.5px solid var(--border);
        }
        .bill-title {
          font-size: 1.35rem;
          margin-bottom: 1.5rem;
        }
        .bill-rows {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-bottom: 1.5rem;
        }
        .bill-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          color: var(--muted-text);
        }
        .bill-row strong {
          color: var(--dark);
        }
        .free-text {
          color: var(--green);
          font-weight: 700;
        }
        .bill-divider {
          height: 1px;
          border-top: 1px dashed var(--border);
          margin: 0.5rem 0;
        }
        .total-bill-row {
          align-items: flex-start;
          padding-top: 0.5rem;
        }
        .total-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--dark);
          display: block;
        }
        .tax-notice {
          font-size: 0.75rem;
          color: var(--muted-text);
        }
        .grand-total {
          font-size: 1.75rem;
          color: var(--primary-red);
        }
        .payment-mode-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #FFF7ED;
          border: 1px solid #FED7AA;
          padding: 0.65rem 0.9rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--orange);
          margin-bottom: 1.5rem;
        }
        .checkout-btn {
          margin-bottom: 1.25rem;
        }
        .security-badges {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--muted-text);
          padding-top: 0.75rem;
          border-top: 1px solid var(--border);
        }
        .sec-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        /* Sandbox Modal */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 1.5rem;
        }
        .sandbox-modal {
          background: white;
          max-width: 500px;
          width: 100%;
          padding: 2.25rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
        }
        .sandbox-modal-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .modal-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--primary-red-light);
          color: var(--primary-red);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }
        .sandbox-modal-header h3 {
          font-size: 1.4rem;
          margin-bottom: 0.3rem;
        }
        .modal-subtitle {
          font-size: 0.85rem;
          color: var(--muted-text);
        }
        .sandbox-details-card {
          background: #F8FAFC;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          font-size: 0.9rem;
        }
        .sb-row {
          display: flex;
          justify-content: space-between;
        }
        .text-red {
          color: var(--primary-red);
          font-size: 1.1rem;
        }
        .sandbox-note {
          font-size: 0.85rem;
          color: var(--muted-text);
          line-height: 1.5;
          margin-bottom: 1.75rem;
        }
        .sandbox-actions {
          display: flex;
          gap: 1rem;
        }
        @media (max-width: 900px) {
          .summary-grid {
            grid-template-columns: 1fr;
          }
          .address-form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderSummary;
