import React, { useState } from 'react';
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
  IonIcon,
  IonRadioGroup,
  IonRadio,
  useIonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { addOutline, removeOutline, trashOutline, cartOutline } from 'ionicons/icons';
import { useCart } from '../contexts/CartContext';
import { orderService } from '../services/orderService';
import { CartItem } from '../models/cart';
import { formatCurrency } from '../utils/format';
import './Checkout.css';

const Checkout: React.FC = () => {
  const history = useHistory();
  const [presentToast] = useIonToast();
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  
  const [deliveryAddress, setDeliveryAddress] = useState('Quito, Ecuador');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'pickup'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'cash'>('card');
  const [loading, setLoading] = useState(false);

  // Datos de tarjeta de crédito simulada
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const getShippingCost = () => {
    switch (shippingMethod) {
      case 'express': return 15;
      case 'pickup': return 0;
      default: return 10;
    }
  };

  const shippingCost = getShippingCost();
  const total = subtotal + shippingCost;

  // Validadores y formateadores dinámicos de inputs de tarjeta (solo permiten números)
  const handleCardNumberInput = (value: string) => {
    const clean = value.replace(/\D/g, ''); // Quita no-dígitos
    const truncated = clean.slice(0, 16);
    const matches = truncated.match(/\d{1,4}/g);
    const formatted = matches ? matches.join(' ') : '';
    setCardNumber(formatted);
  };

  const handleCardExpiryInput = (value: string) => {
    let clean = value.replace(/\D/g, ''); // Quita no-dígitos
    
    // Si el primer número ingresado es > 1 (e.g. 5), ponerle el cero adelante "05/" para mayor comodidad
    if (clean.length === 1 && parseInt(clean, 10) > 1) {
      clean = '0' + clean;
    }

    const truncated = clean.slice(0, 4);
    if (truncated.length > 2) {
      const month = truncated.slice(0, 2);
      const year = truncated.slice(2);
      setCardExpiry(`${month}/${year}`);
    } else {
      setCardExpiry(truncated);
    }
  };

  const handleCardCvvInput = (value: string) => {
    const clean = value.replace(/\D/g, ''); // Quita no-dígitos
    setCardCvv(clean.slice(0, 4));
  };

  const handleConfirm = async () => {
    if (cart.items.length === 0) {
      presentToast({ message: 'Tu carrito está vacío.', duration: 2000, color: 'warning' });
      return;
    }

    if (shippingMethod !== 'pickup' && !deliveryAddress.trim()) {
      presentToast({ message: 'Por favor, ingresa una dirección de entrega.', duration: 2000, color: 'warning' });
      return;
    }

    if (paymentMethod === 'card') {
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length !== 16) {
        presentToast({ message: 'El número de tarjeta simulada debe tener exactamente 16 dígitos.', duration: 2000, color: 'warning' });
        return;
      }

      if (cardExpiry.length !== 5) {
        presentToast({ message: 'La fecha de expiración debe tener el formato MM/AA (ej. 12/28).', duration: 2000, color: 'warning' });
        return;
      }

      const [monthStr, yearStr] = cardExpiry.split('/');
      const month = parseInt(monthStr, 10);
      if (Number.isNaN(month) || month < 1 || month > 12) {
        presentToast({ message: 'El mes de expiración debe estar entre 01 y 12.', duration: 2000, color: 'warning' });
        return;
      }

      if (cardCvv.length < 3 || cardCvv.length > 4) {
        presentToast({ message: 'El código de seguridad (CVV) debe tener 3 o 4 dígitos.', duration: 2000, color: 'warning' });
        return;
      }
    }

    setLoading(true);

    try {
      const address = shippingMethod === 'pickup' ? 'Retiro en Tienda (Quito, Central)' : deliveryAddress;
      const order = await orderService.createOrder(cart, 'user_me', address);
      
      // Limpiar carrito en el contexto
      await clearCart();

      presentToast({
        message: `🎉 ¡Compra simulada! Pedido ${order.id} confirmado con éxito.`,
        duration: 3000,
        color: 'success'
      });

      history.replace('/profile');
    } catch (e: any) {
      presentToast({ message: e?.message || 'No se pudo confirmar la compra.', duration: 2500, color: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleQtyChange = async (item: CartItem, increment: boolean) => {
    const newQty = increment ? item.quantity + 1 : item.quantity - 1;
    if (newQty <= 0) {
      await removeItem(item.productId);
    } else {
      await updateQuantity(item.productId, newQty);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="glass-header">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/feed" text="Volver" />
          </IonButtons>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 auto', textAlign: 'center', flex: 1 }}>
            Mi Carrito
          </h1>
          <div style={{ width: 48 }}></div> {/* Espaciador para centrar título */}
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {cart.items.length === 0 ? (
          <div className="empty-cart-container">
            <div className="empty-cart-icon-wrapper">
              <IonIcon icon={cartOutline} className="empty-cart-icon" />
            </div>
            <h2 className="empty-cart-title">Tu carrito está vacío</h2>
            <p className="empty-cart-subtitle">
              ¡Aún no has agregado ninguna prenda! Explora nuestro catálogo y encuentra algo que te encante.
            </p>
            <IonButton expand="block" shape="round" onClick={() => history.push('/feed')}>
              Explorar Catálogo
            </IonButton>
          </div>
        ) : (
          <>
            <h2 className="section-header">Artículos ({cart.items.length})</h2>
            <IonList className="cart-list">
              {cart.items.map((item) => (
                <div key={item.productId} className="cart-item-card">
                  <div className="cart-item-container">
                    <img src={item.imageUrl} alt={item.title} className="cart-item-thumbnail" />
                    <div className="cart-item-details">
                      <h3 className="cart-item-title">{item.title}</h3>
                      <p className="cart-item-meta">
                        {item.size ? `Talla ${item.size} • ` : ''} {formatCurrency(item.price)} c/u
                      </p>
                      <div className="cart-item-controls">
                        <IonButton
                          fill="clear"
                          size="small"
                          className="qty-btn"
                          onClick={() => handleQtyChange(item, false)}
                        >
                          <IonIcon icon={removeOutline} slot="icon-only" />
                        </IonButton>
                        <span className="qty-val">{item.quantity}</span>
                        <IonButton
                          fill="clear"
                          size="small"
                          className="qty-btn"
                          onClick={() => handleQtyChange(item, true)}
                        >
                          <IonIcon icon={addOutline} slot="icon-only" />
                        </IonButton>
                      </div>
                    </div>
                    <div className="cart-item-right">
                      <span className="cart-item-price">{formatCurrency(item.price * item.quantity)}</span>
                      <IonButton
                        fill="clear"
                        size="small"
                        className="remove-btn"
                        onClick={() => removeItem(item.productId)}
                      >
                        <IonIcon icon={trashOutline} slot="icon-only" />
                      </IonButton>
                    </div>
                  </div>
                </div>
              ))}
            </IonList>

            {/* Opciones de Envío */}
            <h2 className="section-header">Método de Envío</h2>
            <div className="custom-card">
              <IonRadioGroup value={shippingMethod} onIonChange={(e) => setShippingMethod(e.detail.value)}>
                <IonItem lines="none" style={{ margin: 0, padding: 0 }}>
                  <IonRadio slot="start" value="standard" />
                  <IonLabel>
                    <h3 style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Envío Estándar</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem' }}>3-5 días hábiles</p>
                  </IonLabel>
                  <span slot="end" style={{ fontWeight: 600, fontSize: '0.9rem' }}>$10.00</span>
                </IonItem>
                <IonItem lines="none" style={{ marginTop: 8 }}>
                  <IonRadio slot="start" value="express" />
                  <IonLabel>
                    <h3 style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Envío Exprés</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem' }}>1-2 días hábiles</p>
                  </IonLabel>
                  <span slot="end" style={{ fontWeight: 600, fontSize: '0.9rem' }}>$15.00</span>
                </IonItem>
                <IonItem lines="none" style={{ marginTop: 8 }}>
                  <IonRadio slot="start" value="pickup" />
                  <IonLabel>
                    <h3 style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Retirar en Local</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem' }}>Listo en 2 horas</p>
                  </IonLabel>
                  <span slot="end" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ion-color-success)' }}>Gratis</span>
                </IonItem>
              </IonRadioGroup>
            </div>

            {/* Dirección de entrega si no es retiro en local */}
            {shippingMethod !== 'pickup' && (
              <>
                <h2 className="section-header">Dirección de Entrega</h2>
                <div className="custom-card" style={{ padding: 4 }}>
                  <IonItem lines="none">
                    <IonInput
                      value={deliveryAddress}
                      placeholder="Calle Principal, Nro de Casa, Ciudad"
                      onIonInput={(e) => setDeliveryAddress(e.detail.value || '')}
                    />
                  </IonItem>
                </div>
              </>
            )}

            {/* Método de Pago */}
            <h2 className="section-header">Método de Pago</h2>
            <div className="custom-card">
              <IonRadioGroup value={paymentMethod} onIonChange={(e) => setPaymentMethod(e.detail.value)}>
                <IonItem lines="none">
                  <IonLabel style={{ fontSize: '0.9rem', fontWeight: 500 }}>Tarjeta de Crédito / Débito</IonLabel>
                  <IonRadio slot="end" value="card" />
                </IonItem>
                <IonItem lines="none" style={{ marginTop: 8 }}>
                  <IonLabel style={{ fontSize: '0.9rem', fontWeight: 500 }}>PayPal</IonLabel>
                  <IonRadio slot="end" value="paypal" />
                </IonItem>
                <IonItem lines="none" style={{ marginTop: 8 }}>
                  <IonLabel style={{ fontSize: '0.9rem', fontWeight: 500 }}>Pago Contra Entrega</IonLabel>
                  <IonRadio slot="end" value="cash" />
                </IonItem>
              </IonRadioGroup>

              {paymentMethod === 'card' && (
                <div className="payment-card-grid">
                  <div className="payment-card-input-item full-width">
                    <IonItem lines="none">
                      <IonInput
                        type="text"
                        inputmode="numeric"
                        placeholder="Nro. Tarjeta: 4111 2222 3333 4444"
                        value={cardNumber}
                        maxlength={19}
                        onIonInput={(e) => handleCardNumberInput(e.detail.value || '')}
                      />
                    </IonItem>
                  </div>
                  <div className="payment-card-input-item">
                    <IonItem lines="none">
                      <IonInput
                        type="text"
                        inputmode="numeric"
                        placeholder="MM/AA"
                        value={cardExpiry}
                        maxlength={5}
                        onIonInput={(e) => handleCardExpiryInput(e.detail.value || '')}
                      />
                    </IonItem>
                  </div>
                  <div className="payment-card-input-item">
                    <IonItem lines="none">
                      <IonInput
                        type="password"
                        inputmode="numeric"
                        placeholder="CVV"
                        value={cardCvv}
                        maxlength={4}
                        onIonInput={(e) => handleCardCvvInput(e.detail.value || '')}
                      />
                    </IonItem>
                  </div>
                </div>
              )}
            </div>

            {/* Resumen del Pedido */}
            <h2 className="section-header">Resumen del Pedido</h2>
            <div className="custom-card">
              <div className="summary-row">
                <span>Subtotal</span>
                <span style={{ color: 'var(--ion-color-dark)', fontWeight: 500 }}>{formatCurrency(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Costo de Envío</span>
                <span style={{ color: 'var(--ion-color-dark)', fontWeight: 500 }}>{shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <IonButton
              expand="block"
              onClick={handleConfirm}
              disabled={loading || cart.items.length === 0}
              style={{ marginTop: 24, marginBottom: 40 }}
            >
              {loading ? 'Confirmando Compra...' : `Confirmar Compra por ${formatCurrency(total)}`}
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Checkout;
