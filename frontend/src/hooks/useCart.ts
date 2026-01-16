import { useCartContext } from '../context/CartContext';

export const useCart = () => {
  const {
    items,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCartContext();

  return {
    items,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
