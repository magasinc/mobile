import React, { useState, useEffect, useCallback } from 'react';
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
  useIonViewWillEnter
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

  const loadData = useCallback(async (catSlug = selectedCategory, query = searchQuery) => {
    setLoading(true);
    try {
      const fetchedProducts = await productService.getProducts({
        categorySlug: catSlug,
        query: query,
        status: 'active'
      });
      setProducts(fetchedProducts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

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
  }, []);

  useIonViewWillEnter(() => {
    loadData();
  });

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    loadData(slug, searchQuery);
  };

  const handleSearch = (e: any) => {
    const val = e.detail.value || '';
    setSearchQuery(val);
    loadData(selectedCategory, val);
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadData(selectedCategory, searchQuery);
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="glass-header">
          <div className="feed-header-content">
            <span className="logo-text">Thread<span className="logo-accent">Blue</span></span>
          </div>
        </IonToolbar>
        <IonToolbar className="search-toolbar">
          <IonSearchbar
            value={searchQuery}
            onIonInput={handleSearch}
            placeholder="Buscar marcas, talles, prendas..."
            debounce={300}
            className="custom-searchbar"
          />
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
                <IonCol size="6" key={prod.id} className="ion-no-padding grid-col">
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
