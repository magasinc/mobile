export interface CartItem {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  quantity: number;
  sellerId: string;
  sellerName?: string;
  size?: string;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}
