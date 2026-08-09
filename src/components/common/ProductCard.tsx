import React from 'react';
import { IonCard, IonCardContent, IonIcon, IonButton } from '@ionic/react';
import { pinOutline, heart, heartOutline } from 'ionicons/icons';
import { Product } from '../../models/product';
import { formatCurrency, formatCondition } from '../../utils/format';
import { useFavorites } from '../../contexts/FavoritesContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(product.id);

  return (
    <IonCard routerLink={`/product/${product.id}`} className="product-card">
      <div className="image-container">
        <img src={product.imageUrls[0]} alt={product.title} className="product-image" />
        <span className={`badge-condition condition-${product.condition}`}>
          {formatCondition(product.condition)}
        </span>
        <IonButton
          fill="clear"
          className="fav-btn"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleFavorite(product.id);
          }}
        >
          <IonIcon
            icon={fav ? heart : heartOutline}
            style={{ color: fav ? '#ef4444' : '#64748b' }}
            slot="icon-only"
          />
        </IonButton>
      </div>
      <IonCardContent className="card-content">
        <div className="brand-size">
          <span className="brand">{product.brand}</span>
          <span className="dot">•</span>
          <span className="size">Talla {product.size}</span>
        </div>
        <h3 className="title">{product.title}</h3>
        <div className="price-location">
          <span className="price">{formatCurrency(product.price)}</span>
          {product.location && (
            <span className="location">
              <IonIcon icon={pinOutline} /> {product.location.split(',')[0]}
            </span>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default ProductCard;
