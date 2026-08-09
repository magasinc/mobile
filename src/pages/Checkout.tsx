import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  useIonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import { Cart, CartItem } from '../models/cart';

const Checkout: React.FC = () => {
  const history = useHistory();
  const [presentToast] = useIonToast();
  const [cart, setCart] = useState<Cart | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('Quito, Ecuador');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCart = async () => {
      const current = await cartService.getCart();
      setCart(current);
    };

    getCart();
  }, []);

  const subtotal = cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  const handleConfirm = async () => {
    if (!cart || cart.items.length === 0) {
      presentToast({ message: 'Tu carrito está vacío.', duration: 2000, color: 'warning' });
      return;
    }

    setLoading(true);

    try {
      const order = await orderService.createOrder(cart, 'user_me', deliveryAddress);
      await cartService.clear();
      setCart({ items: [], updatedAt: new Date().toISOString() });

      presentToast({
        message: `Pedido ${order.id} confirmado`,
        duration: 2500,
        color: 'success'
      });

      history.replace('/profile');
    } catch (e: any) {
      presentToast({ message: e?.message || 'No se pudo confirmar la compra.', duration: 2500, color: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="glass-header">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/feed" text="Volver" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Checkout</h1>

        <IonList>
          {(cart?.items || []).map((item: CartItem) => (
            <IonItem key={item.productId} lines="inset">
              <IonLabel>
                <h2>{item.title}</h2>
                <p>{item.quantity} x ${item.price}</p>
              </IonLabel>
              <span>${item.price * item.quantity}</span>
            </IonItem>
          ))}
        </IonList>

        <IonItem className="custom-item" lines="none">
          <IonLabel position="stacked">Dirección de entrega</IonLabel>
          <IonInput value={deliveryAddress} onIonInput={(e) => setDeliveryAddress(e.detail.value || '')} />
        </IonItem>

        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span>
            <strong>${subtotal}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span>Envío</span>
            <strong>$10</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '1rem' }}>
            <span>Total</span>
            <strong>${subtotal + 10}</strong>
          </div>
        </div>

        <IonButton expand="block" onClick={handleConfirm} disabled={loading || !cart?.items.length} style={{ marginTop: 24 }}>
          {loading ? 'Confirmando...' : 'Confirmar compra'}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Checkout;
