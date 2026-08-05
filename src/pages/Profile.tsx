import React, { useState, useCallback } from 'react';
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
  useIonViewWillEnter
} from '@ionic/react';
import { pinOutline, star, calendarOutline } from 'ionicons/icons';
import { productService } from '../services/productService';
import { MOCK_USERS } from '../data/mockData';
import { Product } from '../models/product';
import ProductCard from '../components/common/ProductCard';
import './Profile.css';

const Profile: React.FC = () => {
  const currentUser = MOCK_USERS[0]; // Perfil simulado: user_me
  const [activeSegment, setActiveSegment] = useState<'active' | 'sold' | 'bought'>('active');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Contador de estados para el perfil
  const [counts, setCounts] = useState({ active: 0, sold: 0, bought: 0 });

  const loadProfileData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Obtener todas las publicaciones del usuario
      const allUserProducts = await productService.getProducts({ sellerId: 'user_me' });
      
      const activeListings = allUserProducts.filter(p => p.status === 'active');
      const soldListings = allUserProducts.filter(p => p.status === 'sold');
      
      // Simular algunas compras hechas por el usuario
      const boughtCount = 1; 

      setCounts({
        active: activeListings.length,
        sold: soldListings.length,
        bought: boughtCount
      });

      // 2. Cargar según el segmento activo
      if (activeSegment === 'active') {
        setProducts(activeListings);
      } else if (activeSegment === 'sold') {
        setProducts(soldListings);
      } else {
        // Mock de compras
        setProducts([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeSegment]);

  useIonViewWillEnter(() => {
    loadProfileData();
  });

  const handleSegmentChange = (e: CustomEvent) => {
    const val = e.detail.value as 'active' | 'sold' | 'bought';
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
          <h2 className="profile-name">Federico Rossi</h2>
          
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
        </IonSegment>

        {/* Listado en Grilla */}
        {loading ? (
          <div className="loading-container">
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : activeSegment === 'bought' ? (
          /* Muestra de Mis Compras */
          <IonGrid className="products-grid ion-no-padding">
            <IonRow>
              <IonCol size="6" className="ion-no-padding grid-col">
                {/* Prenda comprada simulada */}
                <div className="product-card" style={{ opacity: 0.95 }}>
                  <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden' }}>
                    <img
                      src="https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500"
                      alt="Gorro comprada"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span className="badge-condition condition-new" style={{ position: 'absolute', bottom: '8px', left: '8px', background: '#ffffff', fontSize: '0.65rem', padding: '3px 6px', borderRadius: '6px', fontWeight: 700 }}>
                      COMPRADO
                    </span>
                  </div>
                  <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--ion-color-medium)', fontWeight: 600 }}>CARHARTT</span>
                    <h3 className="title" style={{ height: 'auto', marginBottom: '4px' }}>Gorro Beanie Carhartt WIP</h3>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ion-color-success)' }}>$24.000</span>
                  </div>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
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
      </IonContent>
    </IonPage>
  );
};

export default Profile;
