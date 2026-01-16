// src/api/orders.ts
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/orders';

/* 🔐 SAFE AUTH HEADER */
const authHeader = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No auth token found');
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

/* 🧾 CHECKOUT */
export const checkout = async (
  items: { productId: string; quantity: number }[]
) => {
  try {
    const res = await axios.post(
      `${API_BASE}/checkout`,
      items,
      { headers: authHeader() }
    );
    return res.data;
  } catch (err: any) {
    console.error('CHECKOUT ERROR:', err.response?.data || err.message);
    throw err;
  }
};

/* 📜 ORDER HISTORY */
export const fetchOrders = async () => {
  try {
    const res = await axios.get(
      API_BASE,
      { headers: authHeader() }
    );
    return res.data;
  } catch (err: any) {
    console.error('FETCH ORDERS ERROR:', err.response?.data || err.message);
    throw err;
  }
};
