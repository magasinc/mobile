import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSpinner,
  useIonViewWillEnter,
  useIonToast,
  IonButton,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButtons
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import * as icons from 'ionicons/icons';
import { productService } from '../services/productService';
import { Product, Category } from '../models/product';
import ProductCard from '../components/common/ProductCard';
import './Feed.css';

const Feed: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Estados de filtros
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [minPriceFilter, setMinPriceFilter] = useState<number | null>(null);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [suggestionText, setSuggestionText] = useState<string>('');
  const [presentToast] = useIonToast();

  // Ref to hold current filter state for useIonViewWillEnter (avoids stale closures)
  const filtersRef = useRef({ selectedCategory, searchQuery, sizeFilter, conditionFilter, minPriceFilter, maxPriceFilter });
  filtersRef.current = { selectedCategory, searchQuery, sizeFilter, conditionFilter, minPriceFilter, maxPriceFilter };

  const loadData = async (
    catSlug: string,
    query: string,
    size: string,
    cond: string,
    minP: number | null,
    maxP: number | null
  ) => {
    setLoading(true);
    try {
      const fetchedProducts = await productService.getProducts({
        categorySlug: catSlug,
        query: query,
        status: 'active',
        size: size,
        condition: cond,
        minPrice: minP === null ? undefined : minP,
        maxPrice: maxP === null ? undefined : maxP
      });
      setProducts(fetchedProducts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentData = () => {
    const f = filtersRef.current;
    loadData(f.selectedCategory, f.searchQuery, f.sizeFilter, f.conditionFilter, f.minPriceFilter, f.maxPriceFilter);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const cats = await productService.getCategories();
        setCategories(cats);
      } catch (e) {
        console.error('Error fetching categories:', e);
      }
    };
    init();
    loadCurrentData();
  }, []);

  useIonViewWillEnter(() => {
    loadCurrentData();
  });

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    loadData(slug, searchQuery, sizeFilter, conditionFilter, minPriceFilter, maxPriceFilter);
  };

  const handleSearch = (e: any) => {
    const val = e.detail.value || '';
    setSearchQuery(val);
    loadData(selectedCategory, val, sizeFilter, conditionFilter, minPriceFilter, maxPriceFilter);
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadData(selectedCategory, searchQuery, sizeFilter, conditionFilter, minPriceFilter, maxPriceFilter);
    event.detail.complete();
  };

  const handleApplyFilters = () => {
    setShowFilterModal(false);
    loadData(selectedCategory, searchQuery, sizeFilter, conditionFilter, minPriceFilter, maxPriceFilter);
  };

  const handleResetFilters = () => {
    setSizeFilter('all');
    setConditionFilter('all');
    setMinPriceFilter(null);
    setMaxPriceFilter(null);
    loadData(selectedCategory, searchQuery, 'all', 'all', null, null);
    setShowFilterModal(false);
  };

  const handleSendSuggestion = async () => {
    // Simular envío: aquí podrías integrar un endpoint real
    try {
      // placeholder: enviar a API o guardarlo
      console.log('Sugerencia enviada:', suggestionText);
      presentToast({ message: 'Sugerencia enviada. ¡Gracias!', duration: 2000, color: 'success' });
      setSuggestionText('');
      setShowSupportModal(false);
    } catch (e) {
      console.error(e);
      presentToast({ message: 'No se pudo enviar la sugerencia.', duration: 2000, color: 'danger' });
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="glass-header">
          <div className="feed-header-content">
            <span className="logo-text">Thread<span className="logo-accent">Blue</span></span>
          </div>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={() => setShowSupportModal(true)} aria-label="Soporte">
              <IonIcon icon={(icons as any).helpCircleOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar className="search-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0 8px' }}>
            <IonSearchbar
              value={searchQuery}
              onIonInput={handleSearch}
              placeholder="Buscar marcas, tallas..."
              debounce={300}
              className="custom-searchbar"
              style={{ flex: 1, padding: 0 }}
            />
            <IonButton
              fill="clear"
              className="filter-btn"
              onClick={() => setShowFilterModal(true)}
              style={{ margin: '0 0 0 8px', '--padding-start': '8px', '--padding-end': '8px' }}
            >
              <IonIcon icon={icons.funnelOutline} slot="icon-only" color="primary" />
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent pullingText="Tira para actualizar..." refreshingSpinner="crescent" />
        </IonRefresher>

        {/* Categorías con Scroll Horizontal */}
        <div className="categories-scroller">
          {categories.map((cat) => {
            // Obtener el objeto de icono de Ionicons a partir del string kebab-case
            const camelCaseIcon = cat.icon.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            const iconObj = (icons as any)[camelCaseIcon] || icons.shirtOutline;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`category-chip ${isSelected ? 'active' : ''}`}
              >
                <IonIcon icon={iconObj} className="cat-icon" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Grid de Productos */}
        {loading ? (
          <div className="loading-container">
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : products.length > 0 ? (
          <IonGrid className="products-grid ion-no-padding">
            <IonRow>
              {products.map((prod) => (
                <IonCol
                  key={prod.id}
                  className="ion-no-padding grid-col"
                  size="12"
                  sizeSm="6"
                  sizeMd="6"
                  sizeLg="4"
                  sizeXl="3"
                >
                  <ProductCard product={prod} />
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">👚</div>
            <h3>No encontramos publicaciones</h3>
            <p>Intenta con otros filtros o términos de búsqueda.</p>
          </div>
        )}

        {/* Modal de Filtros */}
        <IonModal isOpen={showFilterModal} onDidDismiss={() => setShowFilterModal(false)}>
          <IonHeader className="ion-no-border">
            <IonToolbar className="glass-header">
              <IonButtons slot="start">
                <IonButton onClick={() => setShowFilterModal(false)}>Cancelar</IonButton>
              </IonButtons>
              <h3 style={{ margin: '0 auto', textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', flex: 1 }}>Filtros</h3>
              <IonButtons slot="end">
                <IonButton onClick={handleResetFilters}>Limpiar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: 12 }}>Talla</h4>
            <IonItem className="custom-item" lines="none">
              <IonSelect
                value={sizeFilter}
                placeholder="Cualquiera"
                interface="popover"
                onIonChange={(e) => setSizeFilter(e.detail.value)}
                style={{ width: '100%' }}
              >
                <IonSelectOption value="all">Todas las tallas</IonSelectOption>
                <IonSelectOption value="XS">XS</IonSelectOption>
                <IonSelectOption value="S">S</IonSelectOption>
                <IonSelectOption value="M">M</IonSelectOption>
                <IonSelectOption value="L">L</IonSelectOption>
                <IonSelectOption value="XL">XL</IonSelectOption>
                <IonSelectOption value="38">38</IonSelectOption>
                <IonSelectOption value="40">40</IonSelectOption>
                <IonSelectOption value="42">42</IonSelectOption>
              </IonSelect>
            </IonItem>

            <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: 20 }}>Condición</h4>
            <IonItem className="custom-item" lines="none">
              <IonSelect
                value={conditionFilter}
                placeholder="Cualquiera"
                interface="popover"
                onIonChange={(e) => setConditionFilter(e.detail.value)}
                style={{ width: '100%' }}
              >
                <IonSelectOption value="all">Todas las condiciones</IonSelectOption>
                <IonSelectOption value="new">Nuevo con etiqueta</IonSelectOption>
                <IonSelectOption value="like_new">Como nuevo</IonSelectOption>
                <IonSelectOption value="good">Buen estado</IonSelectOption>
                <IonSelectOption value="fair">Usado / Aceptable</IonSelectOption>
              </IonSelect>
            </IonItem>

            <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: 20 }}>Rango de Precio ($)</h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              <IonItem className="custom-item" lines="none" style={{ flex: 1 }}>
                <IonInput
                  type="number"
                  placeholder="Mínimo"
                  value={minPriceFilter === null ? '' : minPriceFilter}
                  onIonInput={(e) => {
                    const val = e.detail.value;
                    setMinPriceFilter(!val ? null : parseFloat(val));
                  }}
                />
              </IonItem>
              <IonItem className="custom-item" lines="none" style={{ flex: 1 }}>
                <IonInput
                  type="number"
                  placeholder="Máximo"
                  value={maxPriceFilter === null ? '' : maxPriceFilter}
                  onIonInput={(e) => {
                    const val = e.detail.value;
                    setMaxPriceFilter(!val ? null : parseFloat(val));
                  }}
                />
              </IonItem>
            </div>

            <IonButton expand="block" shape="round" onClick={handleApplyFilters} style={{ marginTop: 40 }}>
              Aplicar Filtros
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal de Soporte */}
        <IonModal isOpen={showSupportModal} onDidDismiss={() => setShowSupportModal(false)}>
          <IonHeader className="ion-no-border">
            <IonToolbar className="glass-header">
              <IonButtons slot="start">
                <IonButton onClick={() => setShowSupportModal(false)}>Cancelar</IonButton>
              </IonButtons>
              <h3 style={{ margin: '0 auto', textAlign: 'center', fontWeight: 700, fontSize: '1.05rem', flex: 1 }}>Soporte</h3>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: 8 }}>Tienes alguna sugerencia?</h4>
            <IonItem lines="none" style={{ marginTop: 12 }}>
              <IonLabel position="stacked">Escribe tu sugerencia</IonLabel>
              <IonTextarea
                value={suggestionText}
                placeholder="Qué mejorarías, problema encontrado, idea..."
                onIonInput={(e: any) => setSuggestionText(e.detail.value)}
                rows={4}
                autoGrow={true}
              />
            </IonItem>

            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <IonButton expand="block" fill="clear" onClick={() => setShowSupportModal(false)}>Cancelar</IonButton>
              <IonButton expand="block" onClick={handleSendSuggestion} disabled={!suggestionText || suggestionText.trim().length === 0}>Enviar</IonButton>
            </div>
          </IonContent>
        </IonModal>

        {/* Botón flotante para publicar */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed" className="fab-add">
          <IonFabButton routerLink="/add-product" color="primary">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Feed;
