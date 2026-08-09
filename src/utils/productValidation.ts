export interface ProductValidationInput {
  title: string;
  price: number | null;
  originalPrice?: number | null;
  brand: string;
  size: string;
  description: string;
  imageUrl?: string;
}

export interface ProductValidationErrors {
  title?: string;
  price?: string;
  originalPrice?: string;
  brand?: string;
  size?: string;
  description?: string;
  imageUrl?: string;
}

export const validatePublishProduct = (
  data: ProductValidationInput
): ProductValidationErrors => {
  const errors: ProductValidationErrors = {};

  const cleanTitle = (data.title || '').trim();
  const cleanBrand = (data.brand || '').trim();
  const cleanSize = (data.size || '').trim();
  const cleanDescription = (data.description || '').trim();

  if (!cleanTitle) {
    errors.title = 'El título es obligatorio.';
  } else if (cleanTitle.length < 3) {
    errors.title = 'El título debe tener al menos 3 caracteres.';
  } else if (/[^a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ]/.test(cleanTitle)) {
    errors.title = 'El título no puede contener signos especiales (sin signos).';
  } else if (/\s{2,}/.test(cleanTitle)) {
    errors.title = 'El título no puede tener espacios dobles.';
  }

  if (data.price === null || data.price === undefined || Number.isNaN(data.price)) {
    errors.price = 'Debes ingresar un precio válido.';
  } else if (data.price <= 0) {
    errors.price = 'El precio debe ser mayor a 0.';
  } else if (!Number.isInteger(data.price)) {
    errors.price = 'El precio debe ser un número entero.';
  } else if (data.price > 99999999) {
    errors.price = 'El precio supera el máximo permitido.';
  }

  if (data.originalPrice !== null && data.originalPrice !== undefined && Number.isNaN(data.originalPrice)) {
    errors.originalPrice = 'El precio original debe ser un número válido.';
  } else if (data.originalPrice !== null && data.originalPrice !== undefined && data.originalPrice <= 0) {
    errors.originalPrice = 'El precio original debe ser mayor a 0.';
  } else if (data.originalPrice !== null && data.originalPrice !== undefined && data.originalPrice > 99999999) {
    errors.originalPrice = 'El precio original supera el máximo permitido.';
  }

  if (!cleanBrand) {
    errors.brand = 'La marca es obligatoria.';
  } else if (cleanBrand.length < 2) {
    errors.brand = 'La marca debe tener al menos 2 caracteres.';
  } else if (/[^a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ]/.test(cleanBrand)) {
    errors.brand = 'La marca no puede contener signos especiales.';
  }

  if (!cleanSize) {
    errors.size = 'La talla es obligatoria.';
  } else if (cleanSize.length < 1) {
    errors.size = 'La talla no es válida.';
  } else if (cleanSize.length > 30) {
    errors.size = 'La talla es demasiado larga.';
  }

  if (!cleanDescription) {
    errors.description = 'La descripción es obligatoria.';
  } else if (cleanDescription.length < 10) {
    errors.description = 'La descripción debe tener al menos 10 caracteres.';
  } else if (cleanDescription.length > 800) {
    errors.description = 'La descripción no puede superar 800 caracteres.';
  }

  const imageUrl = (data.imageUrl || '').trim();
  if (imageUrl && !/^https?:\/\/.+/.test(imageUrl) && !/^data:image\/.+/.test(imageUrl)) {
    errors.imageUrl = 'La URL de la imagen debe ser un enlace válido o un archivo de imagen cargado.';
  }

  return errors;
};
