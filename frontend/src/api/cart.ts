import axios from 'axios';

export const addToCart = async (productId: string, quantity = 1) => {
  const token = localStorage.getItem('token');

  await axios.post(
    '/api/cart/add',
    { productId, quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
