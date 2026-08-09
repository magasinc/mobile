export type OrderStatus = 'pending' | 'confirmed' | 'in_transit' | 'delivered';

export interface OrderLine {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  buyerId: string;
  status: OrderStatus;
  createdAt: string;
  total: number;
  items: OrderLine[];
  deliveryAddress: string;
}
