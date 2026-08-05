import { Product, Category } from '../models/product';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockData';

// Estado en memoria para simular una base de datos interactiva en la sesión
let products: Product[] = [...MOCK_PRODUCTS];

export const productService = {
  getProducts: async (filters?: { 
    query?: string; 
    categorySlug?: string; 
    sellerId?: string; 
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

  createProduct: async (productData: Omit<Product, 'id' | 'createdAt' | 'status' | 'sellerId' | 'sellerName' | 'sellerRating' | 'sellerAvatar' | 'location'>): Promise<Product> => {
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
      location: 'Palermo, CABA'
    };
    
    // Lo agregamos al principio de la lista en memoria
    products = [newProduct, ...products];
    return newProduct;
  }
};
