import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonList,
  IonItem,
  IonModal,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonSpinner,
  useIonViewWillEnter
} from '@ionic/react';
import { sendOutline, arrowBackOutline } from 'ionicons/icons';
import { useLocation } from 'react-router-dom';
import { userService } from '../services/userService';
import { ChatItem, Message } from '../models/user';
import { formatRelativeTime } from '../utils/format';
import './Inbox.css';

const Inbox: React.FC = () => {
  const location = useLocation();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Estado para el Chat Seleccionado / Activo
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Cargar lista de chats
  const loadChats = async () => {
    try {
      const chatList = await userService.getChats();
      setChats(chatList);
      return chatList;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  useIonViewWillEnter(() => {
    setLoading(true);
    loadChats().then((chatList) => {
      setLoading(false);
      
      // Manejar ruteo desde "Preguntar al Vendedor"
      const searchParams = new URLSearchParams(location.search);
      const queryChatId = searchParams.get('chatId');
      if (queryChatId) {
        const foundChat = chatList.find(c => c.id === queryChatId);
        if (foundChat) {
          handleOpenChat(foundChat);
        }
      }
    });
  });

  // Efecto para hacer scroll al fondo al abrir chat o recibir mensajes
  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, modalOpen]);

  // Polling simulado para ver las respuestas del bot vendedor
  useEffect(() => {
    let interval: any;
    if (modalOpen && selectedChat) {
      interval = setInterval(async () => {
        const updatedMsgs = await userService.getChatMessages(selectedChat.id);
        if (updatedMsgs.length !== messages.length) {
          setMessages(updatedMsgs);
          // Marcar chat local como leido
          setChats(prev => prev.map(c => c.id === selectedChat.id ? { ...c, unread: false } : c));
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [modalOpen, selectedChat, messages]);

  const handleOpenChat = async (chat: ChatItem) => {
    setSelectedChat(chat);
    setModalOpen(true);
    
    // Quitar indicador de no leído
    chat.unread = false;
    
    const chatMsgs = await userService.getChatMessages(chat.id);
    setMessages(chatMsgs);
  };

  const handleCloseChat = () => {
    setModalOpen(false);
    setSelectedChat(null);
    setMessages([]);
    loadChats(); // Recargar para actualizar los resúmenes y unread states
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || !inputText.trim()) return;

    const textToSend = inputText;
    setInputText('');

    try {
      // Agregar mensaje localmente de inmediato para mejorar velocidad percibida
      const tempMsg: Message = {
        id: `temp_${Date.now()}`,
        chatId: selectedChat.id,
        senderId: 'user_me',
        text: textToSend,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempMsg]);

      // Enviar a través de mock service
      await userService.sendMessage(selectedChat.id, textToSend);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="glass-header">
          <div className="feed-header-content">
            <span className="logo-text">Mensajes</span>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {loading ? (
          <div className="loading-container">
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : chats.length > 0 ? (
          <IonList className="inbox-list" lines="none">
            {chats.map((chat) => (
              <IonItem
                key={chat.id}
                button
                onClick={() => handleOpenChat(chat)}
                className="chat-item-wrapper"
              >
                <div className="chat-item-content">
                  
                  {/* Avatar con indicador de no leído */}
                  <div className="user-avatar-container">
                    <img src={chat.otherUser.avatar} alt={chat.otherUser.name} className="chat-user-avatar" />
                    {chat.unread && <span className="unread-dot" />}
                  </div>

                  {/* Resumen del Chat */}
                  <div className="chat-details">
                    <div className="chat-header-row">
                      <span className="chat-user-name">{chat.otherUser.name}</span>
                      {chat.lastMessageTime && (
                        <span className="chat-time">{formatRelativeTime(chat.lastMessageTime)}</span>
                      )}
                    </div>
                    {chat.productTitle && (
                      <span className="chat-product-context">{chat.productTitle}</span>
                    )}
                    <span className={`chat-last-message ${chat.unread ? 'unread' : ''}`}>
                      {chat.lastMessage}
                    </span>
                  </div>

                  {/* Miniatura del producto negociado */}
                  {chat.productImage && (
                    <img src={chat.productImage} alt="Miniatura" className="chat-product-thumbnail" />
                  )}
                </div>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <div className="no-results" style={{ marginTop: '100px' }}>
            <div className="no-results-icon">💬</div>
            <h3>Bandeja vacía</h3>
            <p>Aquí verás las conversaciones con otros compradores y vendedores.</p>
          </div>
        )}

        {/* Modal de Conversación (Chat Room) */}
        <IonModal isOpen={modalOpen} onDidDismiss={handleCloseChat}>
          <IonHeader className="ion-no-border modal-chat-header">
            <IonToolbar className="glass-header">
              <IonButtons slot="start">
                <IonButton onClick={handleCloseChat}>
                  <IonIcon icon={arrowBackOutline} />
                </IonButton>
              </IonButtons>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {selectedChat?.otherUser.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--ion-color-success)' }}>
                  Activo ahora
                </span>
              </div>
              
              <div slot="end" style={{ width: '48px' }} /> {/* Espaciador simétrico */}
            </IonToolbar>

            {/* Contexto del producto en la cabecera del chat */}
            {selectedChat && (
              <div style={{ padding: '0 16px 8px 16px', background: 'var(--ion-item-background)' }}>
                <div className="chat-header-product">
                  {selectedChat.productImage && (
                    <img
                      src={selectedChat.productImage}
                      alt="Mini"
                      style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="chat-header-product-info">
                    <span className="chat-header-product-title">{selectedChat.productTitle}</span>
                    <span className="chat-header-product-price">Negociación de prenda</span>
                  </div>
                </div>
              </div>
            )}
          </IonHeader>

          {/* Área de burbujas de chat */}
          <IonContent className="messages-content">
            <div className="messages-list">
              {messages.map((msg) => {
                const isMe = msg.senderId === 'user_me';
                return (
                  <div key={msg.id} className={`bubble-container ${isMe ? 'me' : 'other'}`}>
                    <div className="chat-bubble">
                      <span>{msg.text}</span>
                      <span className="bubble-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          </IonContent>

          {/* Entrada de texto inferior */}
          <div className="chat-input-toolbar">
            <form onSubmit={handleSendMessage} className="chat-input-row">
              <IonInput
                value={inputText}
                onIonInput={(e) => setInputText(e.detail.value || '')}
                placeholder="Escribe un mensaje..."
                className="chat-input-field"
                inputmode="text"
              />
              <IonButton
                type="submit"
                color="primary"
                className="btn-send"
                disabled={!inputText.trim()}
              >
                <IonIcon icon={sendOutline} style={{ fontSize: '1.1rem' }} />
              </IonButton>
            </form>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Inbox;
