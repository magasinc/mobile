import { describe, expect, it } from 'vitest';
import { productService } from './productService';

describe('productService purchase flow', () => {
  it('marca una publicación como comprada y la deja visible para el usuario comprador', async () => {
    const products = await productService.getProducts({ status: 'active' });
    const firstAvailable = products.find(p => p.sellerId !== 'user_me');

    expect(firstAvailable).toBeTruthy();

    const purchased = await productService.purchaseProduct(firstAvailable!.id, 'user_me');

    expect(purchased.status).toBe('sold');
    expect(purchased.buyerId).toBe('user_me');

    const purchases = await productService.getProducts({ buyerId: 'user_me', status: 'sold' });
    expect(purchases.some(item => item.id === firstAvailable!.id)).toBe(true);
  });
});
