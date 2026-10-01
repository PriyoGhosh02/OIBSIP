import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PizzaProvider } from './context/PizzaContext';
import { ToastProvider } from './context/ToastContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Customer Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PizzaBuilder from './pages/PizzaBuilder';
import OrderSummary from './pages/OrderSummary';
import MyOrders from './pages/MyOrders';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminInventory from './pages/AdminInventory';
import AdminOrders from './pages/AdminOrders';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <PizzaProvider>
            <div className="app-container">
              <Navbar />
              <main className="main-content">
                <Routes>
                  {/* Public Customer Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/builder" element={<PizzaBuilder />} />
                  <Route path="/summary" element={<OrderSummary />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-email/:token" element={<VerifyEmail />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />

                  {/* Protected Customer Routes */}
                  <Route
                    path="/my-orders"
                    element={
                      <ProtectedRoute>
                        <MyOrders />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Authentication */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Protected Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/inventory"
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminInventory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminOrders />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </PizzaProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
