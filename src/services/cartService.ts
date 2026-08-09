import { Cart, CartItem } from '../models/cart';

const CART_STORAGE_KEY = 'thread-blue-cart';

const emptyCart = (): Cart => ({
  items: [],
  updatedAt: new Date().toISOString()
});

const readCart = (): Cart => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return emptyCart();
  }

  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) {
    const cart = emptyCart();
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return cart;
  }

  try {
    const parsed = JSON.parse(raw) as Cart;
    if (!parsed || !Array.isArray(parsed.items)) {
      return emptyCart();
    }

    return parsed;
  } catch (e) {
    console.error('No se pudo cargar el carrito.', e);
    return emptyCart();
  }
};

const saveCart = (cart: Cart) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  cart.updatedAt = new Date().toISOString();
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

export const cartService = {
  getCart: async (): Promise<Cart> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return readCart();
  },

  addItem: async (item: CartItem): Promise<Cart> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const cart = readCart();

    const existing = cart.items.find(line => line.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
      existing.addedAt = new Date().toISOString();
    } else {
      cart.items.push(item);
    }

    saveCart(cart);
    return cart;
  },

  removeItem: async (productId: string): Promise<Cart> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const cart = readCart();
    cart.items = cart.items.filter(line => line.productId !== productId);
    saveCart(cart);
    return cart;
  },

  updateQuantity: async (productId: string, quantity: number): Promise<Cart> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const cart = readCart();
    const line = cart.items.find(i => i.productId === productId);

    if (!line) {
      return cart;
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.productId !== productId);
    } else {
      line.quantity = quantity;
    }

    saveCart(cart);
    return cart;
  },

  clear: async (): Promise<Cart> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const cart = emptyCart();
    saveCart(cart);
    return cart;
  }
};
