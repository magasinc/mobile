import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartItem } from '../models/cart';
import { cartService } from '../services/cartService';

interface CartContextType {
  cart: Cart;
  loading: boolean;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({ items: [], updatedAt: new Date().toISOString() });
  const [loading, setLoading] = useState<boolean>(true);

  // Cargar el carrito inicial desde localStorage al montar el proveedor
  useEffect(() => {
    const loadCart = async () => {
      try {
        const initialCart = await cartService.getCart();
        setCart(initialCart);
      } catch (error) {
        console.error('Error al cargar el carrito en el proveedor:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const addItem = async (item: CartItem) => {
    try {
      const updatedCart = await cartService.addItem(item);
      setCart({ ...updatedCart });
    } catch (error) {
      console.error('Error al agregar artículo en el proveedor:', error);
      throw error;
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const updatedCart = await cartService.removeItem(productId);
      setCart({ ...updatedCart });
    } catch (error) {
      console.error('Error al eliminar artículo en el proveedor:', error);
      throw error;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const updatedCart = await cartService.updateQuantity(productId, quantity);
      setCart({ ...updatedCart });
    } catch (error) {
      console.error('Error al actualizar cantidad en el proveedor:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const updatedCart = await cartService.clear();
      setCart({ ...updatedCart });
    } catch (error) {
      console.error('Error al limpiar el carrito en el proveedor:', error);
      throw error;
    }
  };

  const totalItemsCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};
