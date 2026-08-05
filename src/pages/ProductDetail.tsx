import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonButton,
  IonSpinner,
  useIonToast
} from '@ionic/react';
import { star, pinOutline } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { productService } from '../services/productService';
import { userService } from '../services/userService';
import { Product } from '../models/product';
import { formatCurrency, formatCondition, getConditionColor } from '../utils/format';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [presentToast] = useIonToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const prod = await productService.getProductById(id);
        if (prod) {
          setProduct(prod);
        } else {
          presentToast({
            message: 'Publicación no encontrada.',
            duration: 2000,
            color: 'danger'
          });
          history.replace('/feed');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, history, presentToast]);

  const handleChat = async () => {
    if (!product) return;
    try {
      if (product.sellerId === 'user_me') {
        presentToast({
          message: 'Este artículo es tuyo.',
          duration: 1500,
          color: 'warning'
        });
        return;
      }
      
      const chatId = await userService.createChatForProduct(product);
      history.push(`/inbox?chatId=${chatId}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBuy = () => {
    if (!product) return;
    if (product.sellerId === 'user_me') {
      presentToast({
        message: 'No puedes comprar tu propio artículo.',
        duration: 1500,
        color: 'warning'
      });
      return;
    }
    
    presentToast({
      message: '🎉 ¡Compra simulada con éxito! Se ha coordinado con el vendedor.',
      duration: 3000,
      color: 'success'
    });
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader className="ion-no-border">
          <IonToolbar className="glass-header">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/feed" text="Atrás" />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="loading-container">
            <IonSpinner name="crescent" color="primary" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!product) return null;

  const ratingStars = [];
  const roundedRating = Math.round(product.sellerRating);
  for (let i = 1; i <= 5; i++) {
    ratingStars.push(
      <IonIcon
        key={i}
        icon={star}
        style={{ color: i <= roundedRating ? '#f59e0b' : '#cbd5e1', fontSize: '0.9rem' }}
      />
    );
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="glass-header">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/feed" text="Atrás" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Imagen del Producto */}
        <div className="detail-image-container">
          <img src={product.imageUrls[0]} alt={product.title} className="detail-image" />
        </div>

        {/* Detalles del Producto */}
        <div className="detail-content">
          <div className="detail-price">{formatCurrency(product.price)}</div>
          <h1 className="detail-title">{product.title}</h1>
          
          {product.location && (
            <div className="detail-location">
              <IonIcon icon={pinOutline} />
              <span>{product.location}</span>
            </div>
          )}

          {/* Grilla de Especificaciones */}
          <div className="specs-grid">
            <div className="spec-item">
              <span className="spec-label">Marca</span>
              <span className="spec-value">{product.brand}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Talle</span>
              <span className="spec-value">{product.size}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Estado</span>
              <span className="spec-value">
                <span className={`badge-condition condition-${product.condition}`} style={{ marginLeft: 0 }}>
                  {formatCondition(product.condition)}
                </span>
              </span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Categoría</span>
              <span className="spec-value" style={{ textTransform: 'capitalize' }}>
                {product.categorySlug}
              </span>
            </div>
          </div>

          {/* Descripción */}
          <h2 className="section-title">Descripción</h2>
          <p className="description-text">{product.description}</p>

          {/* Información del Vendedor */}
          <h2 className="section-title">Vendedor</h2>
          <div className="seller-card">
            <img
              src={product.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={product.sellerName}
              className="seller-avatar"
            />
            <div className="seller-info">
              <h3 className="seller-name">{product.sellerName}</h3>
              <div className="seller-rating-meta">
                <div className="stars">{ratingStars}</div>
                <span>({product.sellerRating})</span>
              </div>
            </div>
          </div>
        </div>
      </IonContent>

      {/* Botones de acción flotantes en la parte inferior */}
      <div className="bottom-actions-container">
        <IonButton fill="outline" className="btn-chat" onClick={handleChat}>
          Preguntar
        </IonButton>
        <IonButton className="btn-buy" onClick={handleBuy}>
          Comprar Ahora
        </IonButton>
      </div>
    </IonPage>
  );
};

export default ProductDetail;
