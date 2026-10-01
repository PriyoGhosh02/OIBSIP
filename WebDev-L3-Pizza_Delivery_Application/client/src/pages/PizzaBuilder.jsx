import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePizza } from '../context/PizzaContext';
import { Check, ArrowRight, ArrowLeft, Pizza, ShieldAlert, Sparkles } from 'lucide-react';

const PizzaBuilder = () => {
  const navigate = useNavigate();
  const {
    pizza,
    options,
    loadingOptions,
    setBase,
    setSauce,
    setCheese,
    toggleVegetable,
    calculatePricing,
  } = usePizza();

  const [currentStep, setCurrentStep] = useState(1);

  // Helper icons / imagery badges for ingredients
  const getIngredientIcon = (name) => {
    switch (name) {
      case 'Classic':
      case 'Thin Crust':
      case 'Cheese Burst':
      case 'Whole Wheat':
      case 'Gluten Free':
        return '🥖';
      case 'Classic Tomato':
      case 'Spicy Marinara':
      case 'BBQ':
        return '🍅';
      case 'Garlic Cream':
        return '🧄';
      case 'Pesto':
        return '🌿';
      case 'Mozzarella':
      case 'Cheddar':
      case 'Parmesan':
      case 'Cheese Blend':
        return '🧀';
      case 'Bell Pepper':
        return '🫑';
      case 'Onion':
        return '🧅';
      case 'Mushroom':
        return '🍄';
      case 'Olive':
        return '🫒';
      case 'Tomato':
        return '🍅';
      case 'Jalapeño':
        return '🌶️';
      case 'Corn':
        return '🌽';
      case 'Spinach':
        return '🥬';
      default:
        return '🍕';
    }
  };

  const steps = [
    { num: 1, label: 'Base' },
    { num: 2, label: 'Sauce' },
    { num: 3, label: 'Cheese' },
    { num: 4, label: 'Vegetables' },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      navigate('/summary');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const pricing = calculatePricing();

  if (loadingOptions) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', animation: 'spin 1.2s infinite' }}>🍕</div>
        <p style={{ marginTop: '1rem', color: 'var(--muted-text)', fontSize: '1.1rem' }}>
          Loading fresh kitchen ingredients...
        </p>
      </div>
    );
  }

  return (
    <div className="builder-page animate-fade-in">
      {/* Top Banner / Progress Indicator */}
      <section className="builder-header-bar">
        <div className="container">
          <div className="builder-title-wrap">
            <span className="builder-badge">Step-by-Step Customization</span>
            <h1 className="builder-main-title">Craft Your Pizza</h1>
          </div>

          {/* Progress Indicator: 1 Base → 2 Sauce → 3 Cheese → 4 Vegetables → Summary */}
          <div className="progress-wizard">
            {steps.map((s, idx) => (
              <React.Fragment key={s.num}>
                <div
                  className={`wizard-step ${currentStep === s.num ? 'active' : ''} ${
                    currentStep > s.num ? 'completed' : ''
                  }`}
                  onClick={() => s.num < currentStep && setCurrentStep(s.num)}
                >
                  <div className="wizard-circle">
                    {currentStep > s.num ? <Check size={16} /> : s.num}
                  </div>
                  <span className="wizard-label">{s.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`wizard-connector ${
                      currentStep > s.num ? 'completed' : ''
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
            <div className="wizard-connector" />
            <div className="wizard-step summary-step">
              <div className="wizard-circle">5</div>
              <span className="wizard-label">Summary</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Builder Content */}
      <div className="container builder-layout">
        <div className="builder-selection-area">
          {/* STEP 1: PIZZA BASE */}
          {currentStep === 1 && (
            <div className="step-container animate-fade-in">
              <div className="step-heading-row">
                <div>
                  <h2 className="step-title">Choose Your Pizza Base</h2>
                  <p className="step-instruction">
                    Select exactly 1 handcrafted crust for your foundation.
                  </p>
                </div>
                <span className="selected-indicator">Selected: <strong>{pizza.base}</strong></span>
              </div>

              <div className="options-grid">
                {options.bases.map((baseItem) => {
                  const isSelected = pizza.base === baseItem.name;
                  const isOutOfStock = baseItem.stock <= 0;

                  return (
                    <div
                      key={baseItem._id || baseItem.name}
                      className={`option-card card ${isSelected ? 'selected' : ''} ${
                        isOutOfStock ? 'disabled' : ''
                      }`}
                      onClick={() => !isOutOfStock && setBase(baseItem.name)}
                    >
                      <div className="card-top">
                        <span className="ingredient-emoji">{getIngredientIcon(baseItem.name)}</span>
                        <div className="item-price-tag">₹{baseItem.price}</div>
                      </div>
                      <div className="card-info">
                        <h3 className="item-name">{baseItem.name}</h3>
                        <p className="item-desc">{baseItem.description}</p>
                      </div>
                      <div className="card-footer">
                        {isOutOfStock ? (
                          <span className="stock-alert out-of-stock">
                            <ShieldAlert size={14} /> Out of Stock
                          </span>
                        ) : (
                          <span className={`select-chip ${isSelected ? 'active' : ''}`}>
                            {isSelected ? (
                              <>
                                <Check size={14} /> Selected
                              </>
                            ) : (
                              'Select'
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SAUCE */}
          {currentStep === 2 && (
            <div className="step-container animate-fade-in">
              <div className="step-heading-row">
                <div>
                  <h2 className="step-title">Choose Your Sauce</h2>
                  <p className="step-instruction">
                    Select 1 secret signature sauce spread across the base.
                  </p>
                </div>
                <span className="selected-indicator">Selected: <strong>{pizza.sauce}</strong></span>
              </div>

              <div className="options-grid">
                {options.sauces.map((sauceItem) => {
                  const isSelected = pizza.sauce === sauceItem.name;
                  const isOutOfStock = sauceItem.stock <= 0;

                  return (
                    <div
                      key={sauceItem._id || sauceItem.name}
                      className={`option-card card ${isSelected ? 'selected' : ''} ${
                        isOutOfStock ? 'disabled' : ''
                      }`}
                      onClick={() => !isOutOfStock && setSauce(sauceItem.name)}
                    >
                      <div className="card-top">
                        <span className="ingredient-emoji">{getIngredientIcon(sauceItem.name)}</span>
                        <div className="item-price-tag">+₹{sauceItem.price}</div>
                      </div>
                      <div className="card-info">
                        <h3 className="item-name">{sauceItem.name}</h3>
                        <p className="item-desc">{sauceItem.description}</p>
                      </div>
                      <div className="card-footer">
                        {isOutOfStock ? (
                          <span className="stock-alert out-of-stock">
                            <ShieldAlert size={14} /> Out of Stock
                          </span>
                        ) : (
                          <span className={`select-chip ${isSelected ? 'active' : ''}`}>
                            {isSelected ? (
                              <>
                                <Check size={14} /> Selected
                              </>
                            ) : (
                              'Select'
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: CHEESE */}
          {currentStep === 3 && (
            <div className="step-container animate-fade-in">
              <div className="step-heading-row">
                <div>
                  <h2 className="step-title">Choose Your Cheese</h2>
                  <p className="step-instruction">
                    Select 1 premium cheese variety melted to gooey perfection.
                  </p>
                </div>
                <span className="selected-indicator">Selected: <strong>{pizza.cheese}</strong></span>
              </div>

              <div className="options-grid">
                {options.cheeses.map((cheeseItem) => {
                  const isSelected = pizza.cheese === cheeseItem.name;
                  const isOutOfStock = cheeseItem.stock <= 0;

                  return (
                    <div
                      key={cheeseItem._id || cheeseItem.name}
                      className={`option-card card ${isSelected ? 'selected' : ''} ${
                        isOutOfStock ? 'disabled' : ''
                      }`}
                      onClick={() => !isOutOfStock && setCheese(cheeseItem.name)}
                    >
                      <div className="card-top">
                        <span className="ingredient-emoji">{getIngredientIcon(cheeseItem.name)}</span>
                        <div className="item-price-tag">+₹{cheeseItem.price}</div>
                      </div>
                      <div className="card-info">
                        <h3 className="item-name">{cheeseItem.name}</h3>
                        <p className="item-desc">{cheeseItem.description}</p>
                      </div>
                      <div className="card-footer">
                        {isOutOfStock ? (
                          <span className="stock-alert out-of-stock">
                            <ShieldAlert size={14} /> Out of Stock
                          </span>
                        ) : (
                          <span className={`select-chip ${isSelected ? 'active' : ''}`}>
                            {isSelected ? (
                              <>
                                <Check size={14} /> Selected
                              </>
                            ) : (
                              'Select'
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: VEGETABLES */}
          {currentStep === 4 && (
            <div className="step-container animate-fade-in">
              <div className="step-heading-row">
                <div>
                  <h2 className="step-title">Choose Your Vegetables</h2>
                  <p className="step-instruction">
                    Pick as many fresh toppings as you love. Multiple selections allowed!
                  </p>
                </div>
                <span className="selected-indicator">
                  Selected: <strong>{pizza.vegetables.length} toppings</strong>
                </span>
              </div>

              <div className="options-grid grid-4-options">
                {options.vegetables.map((vegItem) => {
                  const isSelected = pizza.vegetables.includes(vegItem.name);
                  const isOutOfStock = vegItem.stock <= 0;

                  return (
                    <div
                      key={vegItem._id || vegItem.name}
                      className={`option-card card veg-card ${isSelected ? 'selected' : ''} ${
                        isOutOfStock ? 'disabled' : ''
                      }`}
                      onClick={() => !isOutOfStock && toggleVegetable(vegItem.name)}
                    >
                      <div className="card-top">
                        <span className="ingredient-emoji">{getIngredientIcon(vegItem.name)}</span>
                        <div className="item-price-tag">+₹{vegItem.price}</div>
                      </div>
                      <div className="card-info">
                        <h3 className="item-name">{vegItem.name}</h3>
                        <p className="item-desc">{vegItem.description}</p>
                      </div>
                      <div className="card-footer">
                        {isOutOfStock ? (
                          <span className="stock-alert out-of-stock">
                            <ShieldAlert size={14} /> Out of Stock
                          </span>
                        ) : (
                          <div className={`checkbox-chip ${isSelected ? 'active' : ''}`}>
                            <div className="custom-check-box">
                              {isSelected && <Check size={12} strokeWidth={3} />}
                            </div>
                            <span>{isSelected ? 'Added' : 'Add'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Control Buttons */}
          <div className="builder-nav-footer">
            {currentStep > 1 ? (
              <button onClick={handleBack} className="btn btn-secondary btn-lg">
                <ArrowLeft size={18} />
                Back
              </button>
            ) : (
              <div />
            )}

            <button onClick={handleNext} className="btn btn-primary btn-lg">
              {currentStep === 4 ? (
                <>
                  View Order Summary
                  <ArrowRight size={18} />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sticky Live Pizza Summary Sidebar */}
        <aside className="builder-sidebar">
          <div className="sticky-summary-card card">
            <div className="sidebar-header">
              <Pizza size={22} color="var(--primary-red)" />
              <h3 className="sidebar-title">Your Live Pizza</h3>
            </div>

            <div className="live-layers-list">
              <div className="layer-item">
                <span className="layer-label">Base</span>
                <span className="layer-value">{pizza.base || 'None'}</span>
              </div>
              <div className="layer-item">
                <span className="layer-label">Sauce</span>
                <span className="layer-value">{pizza.sauce || 'None'}</span>
              </div>
              <div className="layer-item">
                <span className="layer-label">Cheese</span>
                <span className="layer-value">{pizza.cheese || 'None'}</span>
              </div>
              <div className="layer-item vegetables-layer">
                <span className="layer-label">Vegetables ({pizza.vegetables.length})</span>
                <div className="layer-tags">
                  {pizza.vegetables.length === 0 ? (
                    <span className="empty-tag">No toppings selected yet</span>
                  ) : (
                    pizza.vegetables.map((v) => (
                      <span key={v} className="veg-pill">
                        {v}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <hr className="sidebar-divider" />

            <div className="pricing-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <strong>₹{pricing.subtotal}</strong>
              </div>
              <div className="price-row">
                <span>Delivery Fee</span>
                <span>₹{pricing.deliveryFee}</span>
              </div>
              <div className="price-row total-row">
                <span>Estimated Total</span>
                <strong className="total-amount">₹{pricing.total}</strong>
              </div>
            </div>

            <button onClick={handleNext} className="btn btn-orange btn-full btn-lg mt-4">
              {currentStep === 4 ? 'Review & Pay' : 'Next Step'}
            </button>
          </div>
        </aside>
      </div>

      <style>{`
        .builder-page {
          padding-bottom: 4rem;
        }
        .builder-header-bar {
          background: white;
          border-bottom: 1px solid var(--border);
          padding: 2rem 0 1.5rem;
          margin-bottom: 2.5rem;
        }
        .builder-title-wrap {
          text-align: center;
          margin-bottom: 2rem;
        }
        .builder-badge {
          background: var(--cream);
          color: var(--orange);
          font-weight: 700;
          font-size: 0.8rem;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .builder-main-title {
          font-size: 2.4rem;
          margin-top: 0.4rem;
        }
        /* Wizard Steps */
        .progress-wizard {
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 750px;
          margin: 0 auto;
        }
        .wizard-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
          user-select: none;
        }
        .wizard-circle {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 2px solid var(--border);
          background: white;
          color: var(--muted-text);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.95rem;
          transition: var(--transition);
        }
        .wizard-step.active .wizard-circle {
          border-color: var(--primary-red);
          background: var(--primary-red);
          color: white;
          box-shadow: 0 0 0 4px var(--primary-red-light);
        }
        .wizard-step.completed .wizard-circle {
          border-color: var(--green);
          background: var(--green);
          color: white;
        }
        .wizard-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--muted-text);
        }
        .wizard-step.active .wizard-label {
          color: var(--primary-red);
          font-weight: 700;
        }
        .wizard-connector {
          flex: 1;
          height: 3px;
          background: var(--border);
          margin: 0 0.5rem;
          margin-bottom: 1.5rem;
        }
        .wizard-connector.completed {
          background: var(--green);
        }
        .summary-step {
          opacity: 0.7;
          cursor: default;
        }
        /* Layout Grid */
        .builder-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 2.5rem;
          align-items: start;
        }
        .step-heading-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 1.75rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }
        .step-title {
          font-size: 1.6rem;
          margin-bottom: 0.25rem;
        }
        .step-instruction {
          color: var(--muted-text);
          font-size: 0.95rem;
        }
        .selected-indicator {
          font-size: 0.9rem;
          color: var(--dark-text);
          background: #F1F5F9;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
        }
        .selected-indicator strong {
          color: var(--primary-red);
        }
        /* Option Cards */
        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        .grid-4-options {
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        }
        .option-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          border: 2px solid var(--border);
          padding: 1.25rem;
          position: relative;
        }
        .option-card:hover {
          border-color: #FDBA74;
          transform: translateY(-2px);
        }
        .option-card.selected {
          border-color: var(--primary-red);
          background: #FFF5F5;
          box-shadow: 0 4px 14px rgba(230, 57, 70, 0.15);
        }
        .option-card.disabled {
          opacity: 0.55;
          cursor: not-allowed;
          background: #F8FAFC;
        }
        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.85rem;
        }
        .ingredient-emoji {
          font-size: 2rem;
        }
        .item-price-tag {
          font-weight: 700;
          font-size: 1rem;
          color: var(--dark);
          background: #F1F5F9;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
        }
        .option-card.selected .item-price-tag {
          background: var(--primary-red-light);
          color: var(--primary-red);
        }
        .item-name {
          font-size: 1.1rem;
          margin-bottom: 0.4rem;
        }
        .item-desc {
          font-size: 0.85rem;
          color: var(--muted-text);
          line-height: 1.4;
          margin-bottom: 1.25rem;
        }
        .card-footer {
          margin-top: auto;
        }
        .select-chip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          width: 100%;
          padding: 0.45rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          background: #F8FAFC;
          border: 1px solid var(--border);
          color: var(--dark);
          transition: var(--transition);
        }
        .select-chip.active {
          background: var(--primary-red);
          border-color: var(--primary-red);
          color: white;
        }
        .checkbox-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--dark);
        }
        .custom-check-box {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 2px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          color: white;
          transition: var(--transition);
        }
        .checkbox-chip.active .custom-check-box {
          background: var(--primary-red);
          border-color: var(--primary-red);
        }
        .stock-alert.out-of-stock {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--danger);
          font-size: 0.8rem;
          font-weight: 700;
        }
        /* Nav Buttons */
        .builder-nav-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        /* Sticky Sidebar */
        .builder-sidebar {
          position: sticky;
          top: 96px;
        }
        .sticky-summary-card {
          padding: 1.75rem;
          border-radius: var(--radius-xl);
          background: white;
          border: 1.5px solid var(--border);
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.25rem;
        }
        .sidebar-title {
          font-size: 1.25rem;
        }
        .live-layers-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .layer-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }
        .layer-label {
          color: var(--muted-text);
          font-weight: 500;
        }
        .layer-value {
          font-weight: 600;
          color: var(--dark);
        }
        .vegetables-layer {
          flex-direction: column;
          gap: 0.4rem;
        }
        .layer-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }
        .veg-pill {
          background: #F1F5F9;
          color: var(--dark);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
        }
        .empty-tag {
          font-size: 0.8rem;
          color: var(--muted-text);
          font-style: italic;
        }
        .sidebar-divider {
          border: none;
          border-top: 1px dashed var(--border);
          margin: 1.25rem 0;
        }
        .pricing-breakdown {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .price-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--muted-text);
        }
        .total-row {
          font-size: 1.15rem;
          color: var(--dark);
          padding-top: 0.5rem;
          border-top: 1px solid var(--border);
        }
        .total-amount {
          color: var(--primary-red);
          font-size: 1.35rem;
        }
        .mt-4 {
          margin-top: 1.25rem;
        }
        @media (max-width: 900px) {
          .builder-layout {
            grid-template-columns: 1fr;
          }
          .builder-sidebar {
            position: static;
            margin-top: 2rem;
          }
        }
        @media (max-width: 640px) {
          .progress-wizard {
            overflow-x: auto;
            justify-content: flex-start;
            padding: 0.5rem 0;
          }
          .wizard-label {
            display: none;
          }
          .options-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PizzaBuilder;
