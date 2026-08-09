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
  useIonToast,
  useIonViewWillEnter
} from '@ionic/react';
import { star, pinOutline, heart, heartOutline } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { productService } from '../services/productService';
import { userService } from '../services/userService';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { reviewService, Review } from '../services/reviewService';
import { Product } from '../models/product';
import { formatCurrency, formatCondition, getConditionColor } from '../utils/format';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [presentToast] = useIonToast();
  const [sellerReviews, setSellerReviews] = useState<Review[]>([]);
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const loadProductData = async () => {
    if (!id) return;
    try {
      const prod = await productService.getProductById(id);
      if (prod) {
        setProduct(prod);
        const reviews = await reviewService.getReviewsBySeller(prod.sellerId);
        setSellerReviews(reviews);
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

  useEffect(() => {
    setLoading(true);
    loadProductData();
  }, [id]);

  useIonViewWillEnter(() => {
    loadProductData();
  });

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

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addItem({
        productId: product.id,
        title: product.title,
        imageUrl: product.imageUrls[0],
        price: product.price,
        quantity: 1,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        size: product.size,
        addedAt: new Date().toISOString()
      });

      presentToast({
        message: 'Artículo agregado al carrito.',
        duration: 3000,
        color: 'success',
        buttons: [
          {
            text: 'Ver carrito',
            handler: () => {
              history.push('/checkout');
            }
          }
        ]
      });
    } catch (e) {
      presentToast({
        message: 'No se pudo agregar al carrito.',
        duration: 2000,
        color: 'danger'
      });
    }
  };

  const handleBuy = async () => {
    if (!product) return;
    if (product.sellerId === 'user_me') {
      presentToast({
        message: 'No puedes comprar tu propio artículo.',
        duration: 1500,
        color: 'warning'
      });
      return;
    }

    try {
      const updatedProduct = await productService.purchaseProduct(product.id, 'user_me');
      setProduct(updatedProduct);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('thread-blue-profile-segment', 'bought');
      }
      presentToast({
        message: '🎉 ¡Compra simulada con éxito! Se ha coordinado con el vendedor.',
        duration: 3000,
        color: 'success'
      });

      history.replace('/profile');
    } catch (error: any) {
      presentToast({
        message: error?.message || 'No se pudo completar la compra.',
        duration: 2500,
        color: 'danger'
      });
    }
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

  if (!product) {
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
          <div className="no-results" style={{ marginTop: '50px', textAlign: 'center' }}>
            <div className="no-results-icon">📦</div>
            <h3>Publicación no encontrada</h3>
            <p>El producto no está disponible.</p>
            <IonButton routerLink="/feed" shape="round" style={{ marginTop: 20 }}>
              Volver al Muro
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const totalRating = sellerReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = sellerReviews.length > 0
    ? parseFloat((totalRating / sellerReviews.length).toFixed(1))
    : product.sellerRating;

  const ratingStars = [];
  const roundedRating = Math.round(averageRating);
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
          {product && (
            <IonButtons slot="end">
              <IonButton onClick={() => toggleFavorite(product.id)}>
                <IonIcon
                  icon={isFavorite(product.id) ? heart : heartOutline}
                  style={{ color: isFavorite(product.id) ? '#ef4444' : 'var(--ion-color-dark)' }}
                  slot="icon-only"
                />
              </IonButton>
            </IonButtons>
          )}
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
              <span className="spec-label">Talla</span>
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
                <span>({averageRating})</span>
              </div>
            </div>
          </div>

          {/* Reseñas del Vendedor */}
          <h2 className="section-title" style={{ marginTop: 24 }}>Opiniones del Vendedor ({sellerReviews.length})</h2>
          {sellerReviews.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--ion-color-medium)', margin: '8px 0 24px 0' }}>
              Este vendedor aún no tiene reseñas. ¡Sé el primero en calificarlo tras comprar!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '12px 0 24px 0' }}>
              {sellerReviews.map((rev) => (
                <div key={rev.id} style={{
                  background: 'var(--ion-item-background, #ffffff)',
                  border: '1px solid var(--ion-border-color, #e2e8f0)',
                  borderRadius: '12px',
                  padding: '12px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <IonIcon
                          key={s}
                          icon={star}
                          style={{ color: s <= rev.rating ? '#f59e0b' : '#cbd5e1', fontSize: '0.8rem' }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--ion-color-medium)' }}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ion-text-color)', fontStyle: 'italic' }}>
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </IonContent>

      {/* Botones de acción flotantes en la parte inferior */}
      <div className="bottom-actions-container">
        <IonButton fill="outline" className="btn-chat" onClick={handleChat}>
          Preguntar
        </IonButton>
        <IonButton fill="outline" className="btn-cart" onClick={handleAddToCart}>
          Agregar al carrito
        </IonButton>
        <IonButton className="btn-buy" onClick={handleBuy}>
          Comprar Ahora
        </IonButton>
      </div>
    </IonPage>
  );
};

export default ProductDetail;
