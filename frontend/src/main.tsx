import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import LoginPage from './pages/LoginPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage'; // ✅ NEW

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

import './styles.css';

/* 🔁 Page transition wrapper */
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="page-wrapper">{children}</div>;
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider> {/* ✅ Cart context now global */}
        <BrowserRouter>
          <Routes>

            {/* 🔐 LOGIN */}
            <Route
              path="/login"
              element={
                <PageWrapper>
                  <LoginPage />
                </PageWrapper>
              }
            />

            {/* 🏠 HOME */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <App />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* 📦 PRODUCT DETAILS */}
            <Route
              path="/products/:id"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <ProductDetailPage />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* 🛒 CART */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <CartPage />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* 📜 ORDER HISTORY */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <OrdersPage />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
