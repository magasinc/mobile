import { Order, OrderStatus } from '../models/order';
import { Cart } from '../models/cart';

const ORDERS_STORAGE_KEY = 'thread-blue-orders';

const readOrders = (): Order[] => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([]));
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Order[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('No se pudieron leer las órdenes.', e);
    return [];
  }
};

const saveOrders = (orders: Order[]) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

export const orderService = {
  getOrders: async (buyerId = 'user_me'): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return readOrders().filter(order => order.buyerId === buyerId);
  },

  createOrder: async (cart: Cart, buyerId = 'user_me', deliveryAddress = 'Quito, Ecuador'): Promise<Order> => {
    await new Promise(resolve => setTimeout(resolve, 250));

    if (!cart.items.length) {
      throw new Error('El carrito está vacío.');
    }

    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order: Order = {
      id: `order_${Date.now()}`,
      buyerId,
      status: 'pending' as OrderStatus,
      createdAt: new Date().toISOString(),
      total,
      items: cart.items.map(item => ({
        productId: item.productId,
        title: item.title,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: item.quantity
      })),
      deliveryAddress
    };

    const orders = readOrders();
    orders.unshift(order);
    saveOrders(orders);

    return order;
  }
};
