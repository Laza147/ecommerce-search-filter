import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useCart } from '../hooks/useCart';
import { checkout } from '../api/orders';
import { useAuth } from '../context/AuthContext';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const { token } = useAuth();

const handleCheckout = async () => {
  try {
    await checkout(
      items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
      }))
    );
    

    clearCart();
    navigate('/orders'); // ✅ THIS WILL NOW ALWAYS RUN ON SUCCESS
  } catch (err) {
    console.error(err);
    alert('Checkout failed. Please try again.');
  }
};


  return (
    <div className="app-root">
      <Header query="" onSearch={() => navigate('/')} />

      <main className="main-layout">
        <section className="content" style={{ gridColumn: '1 / -1' }}>
          <h2 style={{ marginBottom: '1rem' }}>Shopping Cart</h2>

          {items.length === 0 ? (
            <div className="status status-empty">
              <p>Your cart is empty.</p>
              <button
                onClick={() => navigate('/')}
                style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem 1rem',
                  borderRadius: 6,
                  border: 'none',
                  background: '#febd69',
                  fontWeight: 600,
                }}
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '1.5rem',
              }}
            >
              {/* LEFT: CART ITEMS */}
              <div>
                {items.map((item) => (
                  <div
                    key={item.productId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 0',
                      borderBottom: '1px solid #334155',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.title}</div>
                      <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        ₹{item.price}
                      </div>

                      {/* ➕➖ QUANTITY CONTROLS */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginTop: '0.4rem',
                        }}
                      >
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          +
                        </button>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          style={{
                            marginLeft: '0.75rem',
                            color: '#ef4444',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div style={{ fontWeight: 600 }}>
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT: ORDER SUMMARY */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid #334155',
                  height: 'fit-content',
                }}
              >
                <h3>Order Summary</h3>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.5rem',
                  }}
                >
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.25rem',
                  }}
                >
                  <span>Delivery</span>
                  <span>FREE</span>
                </div>

                <hr
                  style={{
                    margin: '0.75rem 0',
                    borderColor: '#334155',
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 700,
                  }}
                >
                  <span>Total</span>
                  <span>₹{subtotal}</span>
                </div>

                <button
  onClick={handleCheckout}
  style={{
    marginTop: '1rem',
    width: '100%',
    padding: '0.65rem',
    background: '#febd69',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
  }}
>
  Proceed to Checkout
</button>

                <button onClick={handleCheckout}>
                  Place Order
                  </button>

                <button
                  onClick={clearCart}
                  style={{
                    marginTop: '0.5rem',
                    width: '100%',
                    padding: '0.5rem',
                    background: 'transparent',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#e5e7eb',
                  }}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CartPage;
