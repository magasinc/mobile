export interface Review {
  id: string;
  productId: string;
  sellerId: string;
  buyerId: string;
  rating: number; // 1 a 5
  comment: string;
  createdAt: string;
}

const STORAGE_KEY = 'thread-blue-reviews';

const readReviews = (): Review[] => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error al leer reseñas de localStorage', e);
    return [];
  }
};

const saveReviews = (reviews: Review[]) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
};

export const reviewService = {
  createReview: async (reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
    // Simular pequeño lag de red
    await new Promise(resolve => setTimeout(resolve, 150));

    const newReview: Review = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const current = readReviews();
    current.push(newReview);
    saveReviews(current);

    return newReview;
  },

  getReviewsBySeller: async (sellerId: string): Promise<Review[]> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return readReviews().filter((r) => r.sellerId === sellerId);
  },

  getReviewForProduct: async (productId: string): Promise<Review | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return readReviews().find((r) => r.productId === productId);
  }
};
