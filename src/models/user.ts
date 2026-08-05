export interface User {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  memberSince: string;
  location: string;
  listingsCount: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatItem {
  id: string;
  otherUser: User;
  lastMessage?: string;
  lastMessageTime?: string;
  unread: boolean;
  productId?: string;
  productTitle?: string;
  productImage?: string;
}
