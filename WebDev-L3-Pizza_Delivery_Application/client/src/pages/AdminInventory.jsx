import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Layers,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  ArrowUpDown,
} from 'lucide-react';

const AdminInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [editValues, setEditValues] = useState({}); // { [id]: { stock, threshold } }
  const { showToast } = useToast();

  const categories = [
    { label: 'All', value: 'All' },
    { label: 'Pizza Bases', value: 'Bases' },
    { label: 'Sauces', value: 'Sauces' },
    { label: 'Cheeses', value: 'Cheeses' },
    { label: 'Vegetables', value: 'Vegetables' },
  ];

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/inventory');
      if (res.data.success) {
        setItems(res.data.items);
        // Initialize edit values
        const initialEdits = {};
        res.data.items.forEach((item) => {
          initialEdits[item._id] = {
            stock: item.stock,
            threshold: item.threshold,
          };
        });
        setEditValues(initialEdits);
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
      showToast('Failed to load inventory items.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleInputChange = (id, field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleUpdateStock = async (item) => {
    const edit = editValues[item._id];
    if (!edit) return;

    const newStock = parseInt(edit.stock, 10);
    const newThreshold = parseInt(edit.threshold, 10);

    if (isNaN(newStock) || newStock < 0) {
      showToast('Stock count must be a non-negative number.', 'error');
      return;
    }

    try {
      setUpdatingId(item._id);
      const res = await api.patch(`/admin/inventory/${item._id}`, {
        stock: newStock,
        threshold: isNaN(newThreshold) ? item.threshold : newThreshold,
      });

      if (res.data.success) {
        showToast(`Stock updated successfully.`, 'success');
        // Update local item
        setItems((prev) =>
          prev.map((i) => (i._id === item._id ? res.data.item : i))
        );
      }
    } catch (err) {
      console.error('Update inventory stock error:', err);
      showToast(err.response?.data?.message || 'Failed to update stock.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category === selectedCategory ||
      (selectedCategory === 'Bases' && (item.category === 'Bases' || item.category === 'Pizza Bases'));
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const lowStockCount = items.filter((i) => i.stock <= i.threshold).length;

  return (
    <div className="admin-page animate-fade-in">
      <div className="container" style={{ padding: '3rem 1.25rem 5rem' }}>
        {/* Header */}
        <div className="inventory-header-row">
          <div>
            <span className="admin-tag">KITCHEN STOCK CONTROL</span>
            <h1 className="admin-title">Inventory Management</h1>
            <p className="admin-subtitle">
              Manage live stock quantities and threshold limits for all pizza dough bases, sauces, cheeses, and toppings.
            </p>
          </div>
          <button
            onClick={fetchInventory}
            className="btn btn-secondary btn-sm"
            title="Reload from Database"
          >
            <RefreshCw size={16} /> Refresh Stock
          </button>
        </div>

        {/* Low Stock Warning Banner if any */}
        {lowStockCount > 0 && (
          <div className="low-stock-banner card">
            <div className="banner-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="banner-text">
              <h4>Low Stock Alert Triggered</h4>
              <p>
                {lowStockCount} ingredient{lowStockCount > 1 ? 's are' : ' is'} currently at or below minimum threshold. Automated notification jobs run every 30 minutes.
              </p>
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="inventory-controls card">
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`category-tab-btn ${
                  selectedCategory === cat.value ? 'active' : ''
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="search-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search ingredient by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Inventory Table */}
        <div className="inventory-table-card card">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted-text)' }}>
              <div style={{ fontSize: '2.5rem', animation: 'spin 1s infinite' }}>🍕</div>
              <p style={{ marginTop: '1rem' }}>Loading inventory items from MongoDB...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted-text)' }}>
              No inventory ingredients match your filter criteria.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Unit Price</th>
                    <th>Status</th>
                    <th>Current Stock</th>
                    <th>Low Threshold</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const edit = editValues[item._id] || {
                      stock: item.stock,
                      threshold: item.threshold,
                    };
                    const isOutOfStock = item.stock <= 0;
                    const isLowStock = !isOutOfStock && item.stock <= item.threshold;
                    const isUpdating = updatingId === item._id;

                    return (
                      <tr key={item._id} className={isLowStock ? 'row-low-stock' : ''}>
                        <td>
                          <div className="item-name-cell">
                            <strong>{item.name}</strong>
                            {item.description && (
                              <span className="item-sub-desc">{item.description}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="category-pill">{item.category}</span>
                        </td>
                        <td>
                          <span className="price-tag">₹{item.price}</span>
                        </td>
                        <td>
                          {isOutOfStock ? (
                            <span className="badge badge-danger">
                              <ShieldAlert size={12} /> Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="badge badge-warning">
                              <AlertTriangle size={12} /> Low Stock
                            </span>
                          ) : (
                            <span className="badge badge-success">
                              <ShieldCheck size={12} /> In Stock
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="stock-input-group">
                            <input
                              type="number"
                              min="0"
                              className="stock-num-input"
                              value={edit.stock}
                              onChange={(e) =>
                                handleInputChange(item._id, 'stock', e.target.value)
                              }
                            />
                            <span className="units-label">units</span>
                          </div>
                        </td>
                        <td>
                          <div className="thresh-input-group">
                            <input
                              type="number"
                              min="0"
                              className="thresh-num-input"
                              value={edit.threshold}
                              onChange={(e) =>
                                handleInputChange(item._id, 'threshold', e.target.value)
                              }
                              title="Alert threshold limit"
                            />
                            <span className="units-label">min</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => handleUpdateStock(item)}
                            disabled={isUpdating}
                            className="btn btn-primary btn-sm update-stock-btn"
                          >
                            {isUpdating ? 'Saving...' : 'Update Stock'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .inventory-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        .low-stock-banner {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem 1.5rem;
          border-radius: var(--radius-lg);
          margin-bottom: 2rem;
          color: var(--danger);
        }
        .banner-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #FEE2E2;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .banner-text h4 {
          color: var(--danger);
          font-size: 1.05rem;
          margin-bottom: 0.2rem;
        }
        .banner-text p {
          font-size: 0.85rem;
          color: #991B1B;
        }
        .inventory-controls {
          padding: 1rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.75rem;
          gap: 1.25rem;
          flex-wrap: wrap;
        }
        .category-tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .category-tab-btn {
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--muted-text);
          background: #F1F5F9;
          transition: var(--transition);
        }
        .category-tab-btn:hover {
          background: #E2E8F0;
          color: var(--dark);
        }
        .category-tab-btn.active {
          background: var(--primary-red);
          color: white;
        }
        .search-wrap {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 260px;
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
        .inventory-table-card {
          padding: 0;
          overflow: hidden;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .inventory-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }
        .inventory-table th {
          background-color: #F8FAFC;
          color: var(--muted-text);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 1rem 1.25rem;
          border-bottom: 2px solid var(--border);
        }
        .inventory-table td {
          padding: 1.15rem 1.25rem;
          border-bottom: 1px solid var(--border);
          vertical-align: middle;
        }
        .row-low-stock {
          background-color: #FFFDFB;
        }
        .item-name-cell {
          display: flex;
          flex-direction: column;
        }
        .item-name-cell strong {
          color: var(--dark);
          font-size: 0.95rem;
        }
        .item-sub-desc {
          font-size: 0.75rem;
          color: var(--muted-text);
        }
        .category-pill {
          background: #F1F5F9;
          color: var(--dark);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
        }
        .price-tag {
          font-weight: 700;
          color: var(--dark);
        }
        .stock-input-group, .thresh-input-group {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .stock-num-input, .thresh-num-input {
          width: 75px;
          padding: 0.4rem 0.5rem;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--dark);
          text-align: center;
        }
        .stock-num-input:focus, .thresh-num-input:focus {
          border-color: var(--orange);
          outline: none;
        }
        .units-label {
          font-size: 0.75rem;
          color: var(--muted-text);
        }
        .update-stock-btn {
          min-width: 110px;
        }
        @media (max-width: 768px) {
          .inventory-controls {
            flex-direction: column;
            align-items: stretch;
          }
          .search-wrap {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminInventory;
