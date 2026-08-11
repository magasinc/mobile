import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonSpinner,
  useIonViewWillEnter,
  IonModal,
  IonButtons,
  IonButton,
  IonInput,
  IonItem
} from '@ionic/react';
import { pinOutline, star, calendarOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { MOCK_USERS } from '../data/mockData';
import { Product } from '../models/product';
import ProductCard from '../components/common/ProductCard';
import { useFavorites } from '../contexts/FavoritesContext';
import { formatCurrency } from '../utils/format';
import './Profile.css';

const Profile: React.FC = () => {
  const currentUser = MOCK_USERS[0];
  const [activeSegment, setActiveSegment] = useState<'active' | 'sold' | 'bought' | 'favorites'>('active');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { favorites } = useFavorites();

  // Refs to avoid stale closures in useIonViewWillEnter
  const activeSegmentRef = useRef(activeSegment);
  activeSegmentRef.current = activeSegment;
  const favoritesRef = useRef(favorites);
  favoritesRef.current = favorites;

  // Estados de reseñas
  const [ratedProductIds, setRatedProductIds] = useState<string[]>([]);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [ratingToSubmit, setRatingToSubmit] = useState<number>(5);
  const [commentToSubmit, setCommentToSubmit] = useState<string>('');
  const [selectedProductForReview, setSelectedProductForReview] = useState<Product | null>(null);

  // Contador de estados para el perfil
  const [counts, setCounts] = useState({ active: 0, sold: 0, bought: 0 });

  // --- Data loading functions (no useCallback, no localStorage hacks) ---

  const loadCounts = async () => {
    try {
      const userProducts = await productService.getProducts({ sellerId: 'user_me' });
      const boughtProducts = await productService.getProducts({ buyerId: 'user_me', status: 'sold' });
      setCounts({
        active: userProducts.filter(p => p.status === 'active').length,
        sold: userProducts.filter(p => p.status === 'sold').length,
        bought: boughtProducts.length
      });
    } catch (e) {
      console.error(e);
    }
  };

  const loadSegmentData = async (segment: string, favIds: string[]) => {
    setLoading(true);
    try {
      let result: Product[] = [];

      if (segment === 'active') {
        const userProducts = await productService.getProducts({ sellerId: 'user_me' });
        result = userProducts.filter(p => p.status === 'active');
      } else if (segment === 'sold') {
        const userProducts = await productService.getProducts({ sellerId: 'user_me' });
        result = userProducts.filter(p => p.status === 'sold');
      } else if (segment === 'bought') {
        result = await productService.getProducts({ buyerId: 'user_me', status: 'sold' });
        // Load which products have already been rated
        const reviews = await Promise.all(
          result.map(p => reviewService.getReviewForProduct(p.id))
        );
        setRatedProductIds(reviews.filter(Boolean).map(r => r!.productId));
      } else if (segment === 'favorites') {
        const allProducts = await productService.getProducts();
        result = allProducts.filter(p => favIds.includes(p.id));
      }

      setProducts(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch data whenever segment or favorites change
  useEffect(() => {
    loadSegmentData(activeSegment, favorites);
    loadCounts();
  }, [activeSegment, favorites]);

  // Refresh when navigating back to this page — read from refs to avoid stale closures
  useIonViewWillEnter(() => {
    loadSegmentData(activeSegmentRef.current, favoritesRef.current);
    loadCounts();
  });

  const handleOpenReviewModal = (product: Product) => {
    setSelectedProductForReview(product);
    setRatingToSubmit(5);
    setCommentToSubmit('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedProductForReview) return;
    try {
      await reviewService.createReview({
        productId: selectedProductForReview.id,
        sellerId: selectedProductForReview.sellerId,
        buyerId: 'user_me',
        rating: ratingToSubmit,
        comment: commentToSubmit.trim()
      });
      setRatedProductIds(prev => [...prev, selectedProductForReview.id]);
      setShowReviewModal(false);
    } catch (error) {
      console.error('Error al enviar calificación', error);
    }
  };

  const handleSegmentChange = (e: CustomEvent) => {
    const val = e.detail.value as 'active' | 'sold' | 'bought' | 'favorites';
    setActiveSegment(val);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="glass-header">
          <div className="feed-header-content">
            <span className="logo-text">Mi Perfil</span>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Cabecera del Perfil */}
        <div className="profile-header-card">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="profile-avatar"
          />
          <div className="profile-name-row">
            <h2 className="profile-name">{currentUser.name}</h2>
            <span className="verified-badge" title="Usuario verificado">
              <IonIcon icon={checkmarkCircleOutline} />
              <span className="verified-text">Verificado</span>
            </span>
          </div>
          
          <div className="profile-meta-row">
            <div className="profile-location-info">
              <IonIcon icon={pinOutline} />
              <span>{currentUser.location}</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <IonIcon icon={star} style={{ color: '#fbbf24' }} />
              <span>{currentUser.rating} (12 calificaciones)</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <IonIcon icon={calendarOutline} />
              <span>Miembro desde {currentUser.memberSince}</span>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="profile-stats-row">
            <div className="stat-item">
              <span className="stat-value">{counts.active}</span>
              <span className="stat-label">Activos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{counts.sold}</span>
              <span className="stat-label">Vendidos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{counts.bought}</span>
              <span className="stat-label">Compras</span>
            </div>
          </div>
        </div>

        {/* Segmentos de Filtro */}
        <IonSegment
          scrollable
          value={activeSegment}
          onIonChange={handleSegmentChange}
          className="custom-segment"
        >
          <IonSegmentButton value="active" className="custom-segment-button">
            <IonLabel>Activos ({counts.active})</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="sold" className="custom-segment-button">
            <IonLabel>Vendidos ({counts.sold})</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="bought" className="custom-segment-button">
            <IonLabel>Mis Compras ({counts.bought})</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="favorites" className="custom-segment-button">
            <IonLabel>Favoritos ({favorites.length})</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {/* Listado en Grilla */}
        {loading ? (
          <div className="loading-container">
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : activeSegment === 'bought' ? (
          products.length > 0 ? (
            <IonGrid className="products-grid ion-no-padding">
              <IonRow>
                {products.map((prod) => {
                  const hasBeenRated = ratedProductIds.includes(prod.id);
                  return (
                    <IonCol size="12" key={prod.id} className="ion-no-padding" style={{ padding: '6px 12px' }}>
                      <div className="bought-item-card">
                        <img src={prod.imageUrls[0]} alt={prod.title} className="bought-item-thumbnail" />
                        <div className="bought-item-details">
                          <h4>{prod.title}</h4>
                          <p>{prod.brand} • Talla {prod.size}</p>
                          <strong>{formatCurrency(prod.price)}</strong>
                        </div>
                        <div className="bought-item-actions">
                          {hasBeenRated ? (
                            <span className="rated-tag">
                              <IonIcon icon={checkmarkCircleOutline} /> Calificado
                            </span>
                          ) : (
                            <IonButton
                              fill="outline"
                              size="small"
                              className="rate-btn"
                              onClick={() => handleOpenReviewModal(prod)}
                            >
                              Calificar Vendedor
                            </IonButton>
                          )}
                        </div>
                      </div>
                    </IonCol>
                  );
                })}
              </IonRow>
            </IonGrid>
          ) : (
            <div className="no-results" style={{ marginTop: '50px' }}>
              <div className="no-results-icon">🛍️</div>
              <h3>No has comprado artículos todavía</h3>
              <p>Cuando completes una compra verás tus artículos adquiridos aquí.</p>
            </div>
          )
        ) : activeSegment === 'favorites' ? (
          products.length > 0 ? (
            <IonGrid className="products-grid ion-no-padding">
              <IonRow>
                {products.map((prod) => (
                  <IonCol size="6" key={prod.id} className="ion-no-padding grid-col">
                    <ProductCard product={prod} />
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          ) : (
            <div className="no-results" style={{ marginTop: '50px' }}>
              <div className="no-results-icon">❤️</div>
              <h3>No tienes favoritos todavía</h3>
              <p>Guarda las prendas que más te gusten presionando el corazón.</p>
            </div>
          )
        ) : products.length > 0 ? (
          <IonGrid className="products-grid ion-no-padding">
            <IonRow>
              {products.map((prod) => (
                <IonCol size="6" key={prod.id} className="ion-no-padding grid-col">
                  <ProductCard product={prod} />
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        ) : (
          <div className="no-results" style={{ marginTop: '50px' }}>
            <div className="no-results-icon">📦</div>
            <h3>No hay artículos aquí</h3>
            <p>
              {activeSegment === 'active'
                ? 'No tienes prendas activas en venta. ¡Haz clic en el botón + del muro principal para publicar!'
                : 'Todavía no has concretado ninguna venta en tu cuenta.'}
            </p>
          </div>
        )}
        {/* Modal de Calificación */}
        <IonModal
          isOpen={showReviewModal}
          onDidDismiss={() => setShowReviewModal(false)}
          backdropDismiss={false}
          style={{ '--height': 'auto', '--border-radius': '16px' }}
        >
          <IonHeader className="ion-no-border">
            <IonToolbar className="glass-header">
              <IonButtons slot="start">
                <IonButton onClick={() => setShowReviewModal(false)}>Cerrar</IonButton>
              </IonButtons>
              <h3 style={{ margin: '0 auto', textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', flex: 1 }}>Calificar Vendedor</h3>
              <div style={{ width: 64 }}></div>
            </IonToolbar>
          </IonHeader>

          <div style={{ padding: '20px', background: 'var(--ion-item-background, #ffffff)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
            {selectedProductForReview && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.92rem', color: 'var(--ion-color-medium)' }}>
                  ¿Cómo calificarías tu experiencia de compra con <strong>{selectedProductForReview.sellerName || 'el vendedor'}</strong>?
                </p>

                {/* Estrellas */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '16px 0 24px 0' }}>
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      type="button"
                      key={starVal}
                      onClick={() => setRatingToSubmit(starVal)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '2.6rem',
                        lineHeight: 1,
                        padding: '4px 6px',
                        color: starVal <= ratingToSubmit ? '#fbbf24' : '#cbd5e1',
                        transition: 'transform 0.15s ease, color 0.15s ease',
                        transform: starVal <= ratingToSubmit ? 'scale(1.1)' : 'scale(1)',
                        outline: 'none'
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {/* Comentario */}
                <IonItem className="custom-item" lines="none" style={{ border: '1px solid var(--ion-border-color)', borderRadius: '12px' }}>
                  <IonInput
                    type="text"
                    placeholder="Escribe tu opinión (ej. ¡Excelente producto y trato!)"
                    value={commentToSubmit}
                    onIonInput={(e) => setCommentToSubmit(e.detail.value || '')}
                  />
                </IonItem>

                <IonButton
                  expand="block"
                  shape="round"
                  onClick={handleSubmitReview}
                  disabled={!commentToSubmit.trim()}
                  style={{ marginTop: 24, marginBottom: 16 }}
                >
                  Enviar Reseña
                </IonButton>
              </div>
            )}
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
