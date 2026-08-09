export type ProductCondition = 'new' | 'like_new' | 'good' | 'fair';
export type ProductStatus = 'active' | 'reserved' | 'sold';

export interface Category {
  id: string;
  name: string;
  icon: string; // Nombre del icono de Ionicons
  slug: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  size: string;
  brand: string;
  condition: ProductCondition;
  categorySlug: string;
  imageUrls: string[];
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerAvatar?: string;
  createdAt: string;
  status: ProductStatus;
  location?: string;
  buyerId?: string;
  soldAt?: string;
}
