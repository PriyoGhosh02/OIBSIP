import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePizza } from '../context/PizzaContext';
import api from '../services/api';
import { Pizza, Sparkles, ChefHat, Clock, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { loadPreset } = usePizza();
  const [curatedPizzas, setCuratedPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurated = async () => {
      try {
        const res = await api.get('/pizzas');
        if (res.data.success) {
          setCuratedPizzas(res.data.pizzas);
        }
      } catch (err) {
        console.error('Failed to load curated pizzas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurated();
  }, []);

  const handleOrderPreset = (pizzaItem) => {
    loadPreset(pizzaItem);
    navigate('/summary');
  };

  const handleCustomizePreset = (pizzaItem) => {
    loadPreset(pizzaItem);
    navigate('/builder');
  };

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-tag">
              <Sparkles size={16} /> Handcrafted Artisan Crusts
            </div>
            <h1 className="hero-title">
              Build Your <span className="highlight-text">Perfect Pizza</span>
            </h1>
            <p className="hero-subtitle">
              Choose your base, sauce, cheese, and favorite vegetables. Freshly rolled dough, slow-simmered sauces, and premium toppings baked to crispy perfection.
            </p>
            <div className="hero-actions">
              <Link to="/builder" className="btn btn-primary btn-lg">
                <ChefHat size={20} />
                Build Your Pizza
                <ArrowRight size={18} />
              </Link>
              <a href="#signature-menu" className="btn btn-secondary btn-lg">
                Explore Menu
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat-pill">
                <Clock size={16} color="var(--orange)" /> 30-min express bake & delivery
              </div>
              <div className="stat-pill">
                <ShieldCheck size={16} color="var(--green)" /> 100% Real Mozzarella & Natural Veggies
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="pizza-showcase-circle">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"
                alt="Artisan Fresh Pizza"
                className="hero-pizza-img"
              />
              <div className="floating-badge fresh-badge">
                <Flame size={16} color="white" />
                <span>Wood-fired Fresh</span>
              </div>
              <div className="floating-badge price-badge">
                <span>Starts at</span>
                <strong>₹240</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Varieties Section */}
      <section id="signature-menu" className="signature-section">
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">OUR MASTER RECIPES</div>
            <h2 className="section-title">Popular Pizza Varieties</h2>
            <p className="section-desc">
              Enjoy one of our chef-crafted classics or customize any pizza to your personal liking.
            </p>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner">🍕</div>
              <p>Preparing menu...</p>
            </div>
          ) : (
            <div className="grid-3 pizza-grid">
              {curatedPizzas.map((pizzaItem) => (
                <div key={pizzaItem.id} className="pizza-card card card-hover">
                  <div className="pizza-card-img-wrap">
                    <img
                      src={pizzaItem.image}
                      alt={pizzaItem.name}
                      className="pizza-card-img"
                      loading="lazy"
                    />
                    <div className="pizza-price-tag">₹{pizzaItem.price}</div>
                  </div>
                  <div className="pizza-card-body">
                    <h3 className="pizza-name">{pizzaItem.name}</h3>
                    <p className="pizza-desc">{pizzaItem.description}</p>

                    <div className="pizza-config-badges">
                      <span className="mini-badge">{pizzaItem.configuration.base}</span>
                      <span className="mini-badge">{pizzaItem.configuration.sauce}</span>
                      <span className="mini-badge">{pizzaItem.configuration.cheese}</span>
                    </div>

                    <div className="pizza-card-actions">
                      <button
                        onClick={() => handleCustomizePreset(pizzaItem)}
                        className="btn btn-secondary btn-sm flex-1"
                      >
                        Customize
                      </button>
                      <button
                        onClick={() => handleOrderPreset(pizzaItem)}
                        className="btn btn-primary btn-sm flex-1"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Callout Banner */}
          <div className="builder-callout card">
            <div className="callout-content">
              <div className="callout-icon">
                <Pizza size={40} />
              </div>
              <div>
                <h3 className="callout-title">Want something uniquely yours?</h3>
                <p className="callout-text">
                  Customize every single element: 5 artisanal dough bases, 5 rich sauces, 4 premium cheeses, and crisp garden vegetables.
                </p>
              </div>
            </div>
            <Link to="/builder" className="btn btn-orange btn-lg">
              Launch Pizza Builder
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .hero-section {
          background: linear-gradient(180deg, #FFF7ED 0%, #F8FAFC 100%);
          padding: 4.5rem 0 3.5rem;
          border-bottom: 1px solid var(--border);
        }
        .hero-container {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 3.5rem;
          align-items: center;
        }
        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #FFEDD5;
          color: var(--orange);
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.4rem 0.9rem;
          border-radius: var(--radius-full);
          margin-bottom: 1.25rem;
        }
        .hero-title {
          font-size: 3.25rem;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }
        .highlight-text {
          color: var(--primary-red);
          position: relative;
        }
        .hero-subtitle {
          font-size: 1.15rem;
          color: var(--muted-text);
          margin-bottom: 2rem;
          max-width: 540px;
          line-height: 1.6;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .hero-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .stat-pill {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: white;
          padding: 0.5rem 0.9rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--dark);
          box-shadow: var(--shadow-sm);
        }
        .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
        }
        .pizza-showcase-circle {
          position: relative;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          padding: 10px;
          background: linear-gradient(135deg, rgba(230, 57, 70, 0.2), rgba(249, 115, 22, 0.2));
        }
        .hero-pizza-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          box-shadow: 0 20px 40px rgba(0,0,0,0.18);
          animation: floatSlow 6s ease-in-out infinite alternate;
        }
        @keyframes floatSlow {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-10px) rotate(4deg); }
        }
        .floating-badge {
          position: absolute;
          padding: 0.6rem 1rem;
          border-radius: var(--radius-full);
          font-weight: 700;
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          gap: 0.45rem;
          z-index: 2;
        }
        .fresh-badge {
          top: 20px;
          left: -15px;
          background: var(--dark);
          color: white;
          font-size: 0.85rem;
        }
        .price-badge {
          bottom: 25px;
          right: -15px;
          background: white;
          color: var(--dark);
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1.1;
          font-size: 0.75rem;
          border: 1px solid var(--border);
        }
        .price-badge strong {
          font-size: 1.2rem;
          color: var(--primary-red);
        }
        .signature-section {
          padding: 4.5rem 0;
        }
        .section-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 3rem;
        }
        .section-subtitle {
          color: var(--orange);
          font-weight: 800;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          margin-bottom: 0.4rem;
        }
        .section-title {
          font-size: 2.2rem;
          margin-bottom: 0.75rem;
        }
        .section-desc {
          color: var(--muted-text);
          font-size: 1rem;
        }
        .pizza-grid {
          margin-bottom: 3.5rem;
        }
        .pizza-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 0;
        }
        .pizza-card-img-wrap {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        .pizza-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .pizza-card:hover .pizza-card-img {
          transform: scale(1.05);
        }
        .pizza-price-tag {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(31, 41, 55, 0.9);
          backdrop-filter: blur(4px);
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
        }
        .pizza-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .pizza-name {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .pizza-desc {
          font-size: 0.9rem;
          color: var(--muted-text);
          line-height: 1.5;
          margin-bottom: 1rem;
          flex: 1;
        }
        .pizza-config-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1.25rem;
        }
        .mini-badge {
          background: #F1F5F9;
          color: var(--dark);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
        }
        .pizza-card-actions {
          display: flex;
          gap: 0.75rem;
        }
        .flex-1 {
          flex: 1;
        }
        .builder-callout {
          background: linear-gradient(135deg, #FFF7ED, #FFFFFF);
          border: 2px dashed #FDBA74;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2.25rem 2.5rem;
          gap: 2rem;
        }
        .callout-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .callout-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: #FFEDD5;
          color: var(--orange);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .callout-title {
          font-size: 1.35rem;
          margin-bottom: 0.3rem;
        }
        .callout-text {
          color: var(--muted-text);
          font-size: 0.95rem;
          max-width: 580px;
        }
        .loading-state {
          text-align: center;
          padding: 4rem 0;
          color: var(--muted-text);
        }
        .loading-spinner {
          font-size: 2.5rem;
          animation: spin 1s linear infinite;
          margin-bottom: 0.75rem;
        }
        @media (max-width: 900px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-subtitle {
            margin: 0 auto 2rem;
          }
          .hero-actions {
            justify-content: center;
          }
          .hero-stats {
            justify-content: center;
          }
          .builder-callout {
            flex-direction: column;
            text-align: center;
          }
          .callout-content {
            flex-direction: column;
          }
        }
        @media (max-width: 640px) {
          .hero-title {
            font-size: 2.35rem;
          }
          .pizza-showcase-circle {
            width: 280px;
            height: 280px;
          }
          .hero-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
