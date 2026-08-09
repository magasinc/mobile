import { Category, Product } from '../models/product';
import { User, ChatItem, Message } from '../models/user';

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Todos', icon: 'grid-outline', slug: 'all' },
  { id: '2', name: 'Zapatillas', icon: 'footsteps-outline', slug: 'shoes' },
  { id: '3', name: 'Buzos', icon: 'snow-outline', slug: 'jackets' },
  { id: '4', name: 'Pantalones', icon: 'shirt-outline', slug: 'pants' }, // Usamos shirt-outline como fallback visual
  { id: '5', name: 'Vestidos', icon: 'female-outline', slug: 'dresses' },
  { id: '6', name: 'Accesorios', icon: 'watch-outline', slug: 'accessories' }
];

export const MOCK_USERS: User[] = [
  {
    id: 'user_me',
    name: 'Tus Artículos',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
    rating: 4.8,
    memberSince: 'Marzo 2024',
    location: 'Quito, Pichincha',
    listingsCount: 3
  },
  {
    id: 'user_lucia',
    name: 'Lucía Gómez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
    rating: 4.9,
    memberSince: 'Septiembre 2023',
    location: 'Quito, Pichincha',
    listingsCount: 12
  },
  {
    id: 'user_mateo',
    name: 'Mateo Silva',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
    rating: 4.6,
    memberSince: 'Enero 2024',
    location: 'Guayaquil, Guayas',
    listingsCount: 5
  },
  {
    id: 'user_sofia',
    name: 'Sofía Rodríguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop',
    rating: 4.7,
    memberSince: 'Noviembre 2023',
    location: 'Cuenca, Azuay',
    listingsCount: 8
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    title: 'Zapatillas Nike Air Force 1 Retro',
    description: 'Zapatillas clásicas de cuero color blanco con detalles negros. Están en excelente estado, solo se usaron un par de veces. Se entregan en su caja original.',
    price: 95000,
    originalPrice: 160000,
    size: '41 AR',
    brand: 'Nike',
    condition: 'like_new',
    categorySlug: 'shoes',
    imageUrls: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop'],
    sellerId: 'user_lucia',
    sellerName: 'Lucía Gómez',
    sellerRating: 4.9,
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(), // hace 4 horas
    status: 'active',
    location: 'Quito, Pichincha'
  },
  {
    id: 'prod_2',
    title: 'Buzo Levi\'s Vintage Oversized',
    description: 'Buzo de algodón con estilo clásico, color azul grisáceo y corte amplio. Tiene buen peso y una construcción sólida para uso diario.',
    price: 85000,
    originalPrice: 140000,
    size: 'L',
    brand: 'Levi\'s',
    condition: 'good',
    categorySlug: 'jackets',
    imageUrls: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop'],
    sellerId: 'user_mateo',
    sellerName: 'Mateo Silva',
    sellerRating: 4.6,
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), // hace 1 día
    status: 'active',
    location: 'Guayaquil, Guayas'
  },
  {
    id: 'prod_3',
    title: 'Vestido de Fiesta Zara Satinado',
    description: 'Vestido midi satinado de cuello fluido y tirantes finos cruzados en espalda. Hermoso color esmeralda. Nuevo con etiquetas, ideal para un evento formal.',
    price: 52000,
    originalPrice: 89000,
    size: 'M',
    brand: 'Zara',
    condition: 'new',
    categorySlug: 'dresses',
    imageUrls: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop'],
    sellerId: 'user_sofia',
    sellerName: 'Sofía Rodríguez',
    sellerRating: 4.7,
    sellerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(), // hace 2 días
    status: 'active',
    location: 'Cuenca, Azuay'
  },
  {
    id: 'prod_4',
    title: 'Buzo con Capucha Adidas Originals Trefoil',
    description: 'Buzo clásico gris melange con el logo trébol bordado en el pecho en color negro. Es súper cómodo y abrigado, ideal para uso diario.',
    price: 45000,
    originalPrice: 75000,
    size: 'M',
    brand: 'Adidas',
    condition: 'good',
    categorySlug: 'jackets',
    imageUrls: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop'],
    sellerId: 'user_lucia',
    sellerName: 'Lucía Gómez',
    sellerRating: 4.9,
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(), // hace 3 días
    status: 'active',
    location: 'Quito, Pichincha'
  },
  {
    id: 'prod_5',
    title: 'Jeans Levi\'s 501 Original Fit',
    description: 'Jeans de corte recto clásicos en color azul índigo. Denim grueso premium rígido. Tiene un detalle mínimo de desgaste en el ruedo de la pierna izquierda.',
    price: 58000,
    originalPrice: 110000,
    size: 'W32 / L32',
    brand: 'Levi\'s',
    condition: 'fair',
    categorySlug: 'pants',
    imageUrls: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop'],
    sellerId: 'user_mateo',
    sellerName: 'Mateo Silva',
    sellerRating: 4.6,
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 96 * 3600000).toISOString(), // hace 4 días
    status: 'active',
    location: 'Guayaquil, Guayas'
  },
  {
    id: 'prod_6',
    title: 'Gorro Beanie Carhartt WIP',
    description: 'Gorro tejido clásico en color ocre/mostaza. Logo icónico bordado al frente. Excelente elasticidad y abrigo, unisex.',
    price: 24000,
    originalPrice: 40000,
    size: 'Único',
    brand: 'Carhartt',
    condition: 'like_new',
    categorySlug: 'accessories',
    imageUrls: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop'],
    sellerId: 'user_sofia',
    sellerName: 'Sofía Rodríguez',
    sellerRating: 4.7,
    sellerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 120 * 3600000).toISOString(), // hace 5 días
    status: 'active',
    location: 'Cuenca, Azuay'
  },
  // Artículos propios del usuario actual
  {
    id: 'prod_my_1',
    title: 'Camisa Ralph Lauren Slim Fit Oxford',
    description: 'Camisa Ralph Lauren original talla M, color azul celeste con logo bordado multicolor. Ideal para oficina o eventos semi-formales. Como nueva.',
    price: 60000,
    originalPrice: 120000,
    size: 'M',
    brand: 'Ralph Lauren',
    condition: 'like_new',
    categorySlug: 'jackets', // O categorizado general
    imageUrls: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop'],
    sellerId: 'user_me',
    sellerName: 'Tu Perfil',
    sellerRating: 4.8,
    createdAt: new Date(Date.now() - 15 * 3600000).toISOString(),
    status: 'active',
    location: 'Quito, Pichincha'
  },
  {
    id: 'prod_my_2',
    title: 'Buzo Bomber Negro Premium',
    description: 'Buzo bomber de tejido premium con interior forrado. Tiene un uso moderado y se conserva en excelente estado.',
    price: 48000,
    originalPrice: 85000,
    size: 'M',
    brand: 'H&M',
    condition: 'good',
    categorySlug: 'jackets',
    imageUrls: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop'],
    sellerId: 'user_me',
    sellerName: 'Tu Perfil',
    sellerRating: 4.8,
    createdAt: new Date(Date.now() - 180 * 3600000).toISOString(),
    status: 'sold',
    location: 'Quito, Pichincha'
  }
];

export const MOCK_CHATS: ChatItem[] = [
  {
    id: 'chat_1',
    otherUser: MOCK_USERS[1], // Lucía Gómez
    lastMessage: 'Hola! Sí, todavía las tengo. Hago envíos por correo certificado.',
    lastMessageTime: new Date(Date.now() - 20 * 60000).toISOString(), // hace 20 mins
    unread: true,
    productId: 'prod_1',
    productTitle: 'Zapatillas Nike Air Force 1 Retro',
    productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop'
  },
  {
    id: 'chat_2',
    otherUser: MOCK_USERS[2], // Mateo Silva
    lastMessage: 'Dale, coordinamos para el sábado a la tarde entonces.',
    lastMessageTime: new Date(Date.now() - 2 * 3600000).toISOString(), // hace 2 horas
    unread: false,
    productId: 'prod_2',
    productTitle: 'Buzo Levi\'s Vintage Oversized',
    productImage: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=150&auto=format&fit=crop'
  }
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  chat_1: [
    {
      id: 'm1_1',
      chatId: 'chat_1',
      senderId: 'user_me',
      text: 'Hola Lucía, ¿cómo estás? Quería consultarte si las zapatillas Nike aún están disponibles y si haces envíos.',
      timestamp: new Date(Date.now() - 35 * 60000).toISOString()
    },
    {
      id: 'm1_2',
      chatId: 'chat_1',
      senderId: 'user_lucia',
      text: 'Hola! Sí, todavía las tengo. Hago envíos por correo certificado.',
      timestamp: new Date(Date.now() - 20 * 60000).toISOString()
    }
  ],
  chat_2: [
    {
      id: 'm2_1',
      chatId: 'chat_2',
      senderId: 'user_me',
      text: 'Buenas! Me interesa mucho el buzo Levi\'s. ¿Te sirve encontrarnos en la estación central de Quito para retirar?',
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString()
    },
    {
      id: 'm2_2',
      chatId: 'chat_2',
      senderId: 'user_mateo',
      text: 'Hola qué tal. Sí, me queda perfecto retirar por la estación central de Quito.',
      timestamp: new Date(Date.now() - 2.5 * 3600000).toISOString()
    },
    {
      id: 'm2_3',
      chatId: 'chat_2',
      senderId: 'user_me',
      text: 'Excelente, ¿puede ser el sábado?',
      timestamp: new Date(Date.now() - 2.2 * 3600000).toISOString()
    },
    {
      id: 'm2_4',
      chatId: 'chat_2',
      senderId: 'user_mateo',
      text: 'Dale, coordinamos para el sábado a la tarde entonces.',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString()
    }
  ]
};
