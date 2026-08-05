import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  useIonToast
} from '@ionic/react';
import { imageOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { productService } from '../services/productService';
import { ProductCondition } from '../models/product';
import './AddProduct.css';

const AddProduct: React.FC = () => {
  const history = useHistory();
  const [presentToast] = useIonToast();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [originalPrice, setOriginalPrice] = useState<number | null>(null);
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [categorySlug, setCategorySlug] = useState('shoes');
  const [condition, setCondition] = useState<ProductCondition>('good');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mapeo inteligente de fotos mock de alta calidad según categoría
  const getAutoImage = (slug: string) => {
    switch (slug) {
      case 'shoes':
        return 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&auto=format&fit=crop';
      case 'jackets':
        return 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&auto=format&fit=crop';
      case 'pants':
        return 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop';
      case 'dresses':
        return 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop';
      case 'accessories':
        return 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop';
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !price || !brand || !size || !description) {
      presentToast({
        message: 'Por favor, completa todos los campos requeridos.',
        duration: 2000,
        color: 'warning'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedImage = imageUrl.trim() || getAutoImage(categorySlug);
      
      await productService.createProduct({
        title,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        brand,
        size,
        categorySlug,
        condition,
        imageUrls: [selectedImage],
        description
      });

      presentToast({
        message: '🎉 ¡Prenda publicada con éxito!',
        duration: 2000,
        color: 'success'
      });

      history.replace('/feed');
    } catch (error) {
      presentToast({
        message: 'Hubo un error al publicar la prenda.',
        duration: 2000,
        color: 'danger'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="glass-header">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/feed" text="Volver" />
          </IonButtons>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, textAlign: 'center', flexGrow: 1, paddingRight: '48px' }}>
            Publicar Prenda
          </h2>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <form onSubmit={handlePublish} className="add-form">
          
          {/* Vista previa de imagen */}
          <div className="image-preview-box">
            {imageUrl ? (
              <img src={imageUrl} alt="Preview" className="image-preview-img" />
            ) : (
              <div className="image-placeholder-content">
                <IonIcon icon={imageOutline} className="image-placeholder-icon" />
                <span className="image-placeholder-text">Subir foto de la prenda</span>
                <span style={{ fontSize: '0.72rem' }}>(Se asignará una auto-foto de demostración)</span>
              </div>
            )}
          </div>

          {/* Campo de imagen externa */}
          <IonItem className="custom-item" lines="none">
            <IonLabel position="stacked">Enlace de imagen (Opcional)</IonLabel>
            <IonInput
              placeholder="https://ejemplo.com/prenda.jpg"
              value={imageUrl}
              onIonInput={(e) => setImageUrl(e.detail.value || '')}
            />
          </IonItem>

          {/* Título de la prenda */}
          <IonItem className="custom-item" lines="none">
            <IonLabel position="stacked">Título *</IonLabel>
            <IonInput
              placeholder="Ej. Buzo Nike Vintage Oversized"
              value={title}
              onIonInput={(e) => setTitle(e.detail.value || '')}
              required
            />
          </IonItem>

          {/* Marca y Talle */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <IonItem className="custom-item" lines="none" style={{ flex: 1 }}>
              <IonLabel position="stacked">Marca *</IonLabel>
              <IonInput
                placeholder="Ej. Nike"
                value={brand}
                onIonInput={(e) => setBrand(e.detail.value || '')}
                required
              />
            </IonItem>
            <IonItem className="custom-item" lines="none" style={{ flex: 1 }}>
              <IonLabel position="stacked">Talle *</IonLabel>
              <IonInput
                placeholder="Ej. L / 41 AR"
                value={size}
                onIonInput={(e) => setSize(e.detail.value || '')}
                required
              />
            </IonItem>
          </div>

          {/* Categoría y Condición */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <IonItem className="custom-item" lines="none" style={{ flex: 1 }}>
              <IonLabel position="stacked">Categoría *</IonLabel>
              <IonSelect
                value={categorySlug}
                interface="popover"
                onIonChange={(e) => setCategorySlug(e.detail.value)}
              >
                <IonSelectOption value="shoes">Zapatillas</IonSelectOption>
                <IonSelectOption value="jackets">Camperas</IonSelectOption>
                <IonSelectOption value="pants">Pantalones</IonSelectOption>
                <IonSelectOption value="dresses">Vestidos</IonSelectOption>
                <IonSelectOption value="accessories">Accesorios</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem className="custom-item" lines="none" style={{ flex: 1 }}>
              <IonLabel position="stacked">Estado *</IonLabel>
              <IonSelect
                value={condition}
                interface="popover"
                onIonChange={(e) => setCondition(e.detail.value)}
              >
                <IonSelectOption value="new">Nuevo</IonSelectOption>
                <IonSelectOption value="like_new">Como nuevo</IonSelectOption>
                <IonSelectOption value="good">Buen estado</IonSelectOption>
                <IonSelectOption value="fair">Aceptable</IonSelectOption>
              </IonSelect>
            </IonItem>
          </div>

          {/* Precios */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <IonItem className="custom-item" lines="none" style={{ flex: 1 }}>
              <IonLabel position="stacked">Precio ($ ARS) *</IonLabel>
              <IonInput
                type="number"
                placeholder="0"
                value={price ?? ''}
                onIonInput={(e) => setPrice(e.detail.value ? Number(e.detail.value) : null)}
                required
              />
            </IonItem>
            <IonItem className="custom-item" lines="none" style={{ flex: 1 }}>
              <IonLabel position="stacked">Precio Original (Opcional)</IonLabel>
              <IonInput
                type="number"
                placeholder="0"
                value={originalPrice ?? ''}
                onIonInput={(e) => setOriginalPrice(e.detail.value ? Number(e.detail.value) : null)}
              />
            </IonItem>
          </div>

          {/* Descripción */}
          <IonItem className="custom-item" lines="none">
            <IonLabel position="stacked">Descripción detallada *</IonLabel>
            <IonTextarea
              placeholder="Describí los detalles, si tiene marcas de uso, lavado, etc."
              rows={4}
              value={description}
              onIonInput={(e) => setDescription(e.detail.value || '')}
              required
            />
          </IonItem>

          {/* Botón de envío */}
          <IonButton
            expand="block"
            type="submit"
            className="btn-publish"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publicando...' : 'Publicar Artículo'}
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default AddProduct;
