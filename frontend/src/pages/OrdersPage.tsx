import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../api/orders';
import { Header } from '../components/layout/Header';

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="app-root">
      <Header query="" onSearch={() => navigate('/')} />

      <main className="main-layout">
        <section className="content" style={{ gridColumn: '1 / -1' }}>
          <h2 style={{ marginBottom: '1rem' }}>Your Orders</h2>

          {loading && <div className="status">Loading orders…</div>}

          {!loading && orders.length === 0 && (
            <div className="status status-empty">
              <p>You haven’t placed any orders yet.</p>
              <button onClick={() => navigate('/')}>
                Start shopping
              </button>
            </div>
          )}

          {!loading &&
            orders.map((order) => (
              <div
                key={order.id}
                style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  borderRadius: 10,
                  background: 'rgba(15,23,42,0.95)',
                  border: '1px solid #334155',
                }}
              >
                {/* ORDER HEADER */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      Order placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                      Status: {order.status}
                    </div>
                  </div>

                  <div style={{ fontWeight: 700 }}>
                    ₹{order.totalAmount}
                  </div>
                </div>

                {/* ITEMS */}
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingTop: '0.5rem',
                      marginTop: '0.5rem',
                      borderTop: '1px solid #334155',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500 }}>
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: '#9ca3af',
                        }}
                      >
                        Qty: {item.quantity}
                      </div>
                    </div>

                    <div style={{ fontWeight: 600 }}>
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </section>
      </main>
    </div>
  );
};

export default OrdersPage;
