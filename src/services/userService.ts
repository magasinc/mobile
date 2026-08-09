import { ChatItem, Message } from '../models/user';
import { Product } from '../models/product';
import { MOCK_CHATS, MOCK_MESSAGES, MOCK_USERS } from '../data/mockData';

// Estados en memoria para simular chat interactivo
let chats: ChatItem[] = [...MOCK_CHATS];
let messages: Record<string, Message[]> = { ...MOCK_MESSAGES };

export const userService = {
  getChats: async (): Promise<ChatItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 150));
    // Devolver los chats ordenados por fecha del último mensaje descendente
    return [...chats].sort((a, b) => {
      const timeA = new Date(a.lastMessageTime || 0).getTime();
      const timeB = new Date(b.lastMessageTime || 0).getTime();
      return timeB - timeA;
    });
  },

  getChatMessages: async (chatId: string): Promise<Message[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return messages[chatId] || [];
  },

  sendMessage: async (chatId: string, text: string): Promise<Message> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId: 'user_me',
      text,
      timestamp: new Date().toISOString()
    };

    if (!messages[chatId]) {
      messages[chatId] = [];
    }
    messages[chatId] = [...messages[chatId], newMessage];

    // Actualizar el ChatItem correspondiente en el listado global
    chats = chats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          lastMessage: text,
          lastMessageTime: newMessage.timestamp,
          unread: false
        };
      }
      return chat;
    });

    // Simular una respuesta automática del vendedor después de 2 segundos para dar dinamismo a la demo
    setTimeout(() => {
      const replyMessage: Message = {
        id: `msg_reply_${Date.now()}`,
        chatId,
        senderId: 'other', // ID simplificado del otro interlocutor
        text: '¡Hola! Qué bueno que te interese. ¿De qué zona sos? Así vemos cómo coordinamos.',
        timestamp: new Date().toISOString()
      };
      
      messages[chatId] = [...(messages[chatId] || []), replyMessage];
      
      chats = chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            lastMessage: replyMessage.text,
            lastMessageTime: replyMessage.timestamp,
            unread: true
          };
        }
        return chat;
      });
    }, 2000);

    return newMessage;
  },

  createChatForProduct: async (product: Product): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Validar si ya existe un chat para este producto con este vendedor
    const existingChat = chats.find(c => c.productId === product.id);
    if (existingChat) {
      return existingChat.id;
    }

    const chatId = `chat_${Date.now()}`;
    const seller = MOCK_USERS.find(u => u.id === product.sellerId) || {
      id: product.sellerId,
      name: product.sellerName,
      avatar: product.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      rating: product.sellerRating,
      memberSince: 'Agosto 2026',
      location: product.location || 'Ecuador',
      listingsCount: 1
    };

    const newChat: ChatItem = {
      id: chatId,
      otherUser: seller,
      lastMessage: `Hola! Me interesa tu artículo: ${product.title}`,
      lastMessageTime: new Date().toISOString(),
      unread: false,
      productId: product.id,
      productTitle: product.title,
      productImage: product.imageUrls[0]
    };

    chats = [newChat, ...chats];
    
    // Mensaje automático inicial del usuario comprador
    messages[chatId] = [
      {
        id: `msg_init_${Date.now()}`,
        chatId,
        senderId: 'user_me',
        text: `Hola! Me interesa tu artículo: "${product.title}"`,
        timestamp: new Date().toISOString()
      }
    ];

    return chatId;
  }
};
