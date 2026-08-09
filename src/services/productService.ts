import { Product, Category } from '../models/product';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockData';

const STORAGE_KEY = 'thread-blue-products';

const readPersistedProducts = (): Product[] => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [...MOCK_PRODUCTS];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PRODUCTS));
    return [...MOCK_PRODUCTS];
  }

  try {
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) ? parsed : [...MOCK_PRODUCTS];
  } catch (e) {
    console.error('No se pudieron leer los productos persistidos.', e);
    return [...MOCK_PRODUCTS];
  }
};

const saveProducts = (items: Product[]) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

// Estado en memoria para simular una base de datos interactiva en la sesión
let products: Product[] = readPersistedProducts();

export const productService = {
  getProducts: async (filters?: { 
    query?: string; 
    categorySlug?: string; 
    sellerId?: string; 
    buyerId?: string;
    status?: 'active' | 'reserved' | 'sold' 
  }): Promise<Product[]> => {
    // Simular retraso de red breve para fidelidad de UX
    await new Promise(resolve => setTimeout(resolve, 150));
    
    let result = [...products];
    
    if (filters) {
      if (filters.categorySlug && filters.categorySlug !== 'all') {
        result = result.filter(p => p.categorySlug === filters.categorySlug);
      }
      if (filters.query) {
        const q = filters.query.toLowerCase();
        result = result.filter(
          p => p.title.toLowerCase().includes(q) || 
               p.description.toLowerCase().includes(q) || 
               p.brand.toLowerCase().includes(q)
        );
      }
      if (filters.sellerId) {
        result = result.filter(p => p.sellerId === filters.sellerId);
      }
      if (filters.buyerId) {
        result = result.filter(p => p.buyerId === filters.buyerId);
      }
      if (filters.status) {
        result = result.filter(p => p.status === filters.status);
      }
    }
    
    return result;
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return products.find(p => p.id === id);
  },

  getCategories: async (): Promise<Category[]> => {
    return MOCK_CATEGORIES;
  },

  createProduct: async (productData: Omit<Product, 'id' | 'createdAt' | 'status' | 'sellerId' | 'sellerName' | 'sellerRating' | 'sellerAvatar' | 'location' | 'buyerId' | 'soldAt'>): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      sellerId: 'user_me',
      sellerName: 'Tu Perfil',
      sellerRating: 4.8,
      sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
      location: 'Quito, Pichincha'
    };
    
    // Lo agregamos al principio de la lista en memoria
    products = [newProduct, ...products];
    saveProducts(products);
    return newProduct;
  },

  purchaseProduct: async (productId: string, buyerId: string): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 250));

    const target = products.find(item => item.id === productId);
    if (!target) {
      throw new Error('Publicación no encontrada.');
    }

    if (target.sellerId === buyerId) {
      throw new Error('No puedes comprar tu propio artículo.');
    }

    if (target.status === 'sold') {
      throw new Error('Este artículo ya fue vendido.');
    }

    target.status = 'sold';
    target.buyerId = buyerId;
    target.soldAt = new Date().toISOString();

    saveProducts(products);

    return target;
  }
};
