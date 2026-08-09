import { describe, expect, it } from 'vitest';
import { validatePublishProduct } from './productValidation';

describe('validatePublishProduct', () => {
  it('detecta título con signos y precio inválido', () => {
    const errors = validatePublishProduct({
      title: 'Buzo @Nike',
      price: NaN,
      originalPrice: null,
      brand: 'Nike',
      size: 'M',
      description: 'Prenda en buen estado',
      imageUrl: ''
    });

    expect(errors.title).toContain('sin signos');
    expect(errors.price).toContain('precio');
  });

  it('acepta un título y precio válidos', () => {
    const errors = validatePublishProduct({
      title: 'Buzo Nike Oversized',
      price: 15000,
      originalPrice: 25000,
      brand: 'Nike',
      size: 'M',
      description: 'Buzo recto con buena terminación y tejido premium.',
      imageUrl: 'https://example.com/product.jpg'
    });

    expect(errors.title).toBeUndefined();
    expect(errors.price).toBeUndefined();
    expect(errors.description).toBeUndefined();
  });
});
