import { ProductCondition } from '../models/product';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatCondition = (condition: ProductCondition): string => {
  const mapping: Record<ProductCondition, string> = {
    new: 'Nuevo',
    like_new: 'Como nuevo',
    good: 'Buen estado',
    fair: 'Aceptable',
  };
  return mapping[condition] || condition;
};

export const getConditionColor = (condition: ProductCondition): string => {
  const mapping: Record<ProductCondition, string> = {
    new: 'success',
    like_new: 'primary',
    good: 'warning',
    fair: 'medium',
  };
  return mapping[condition] || 'medium';
};

export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    // Reset hours to compare calendar days
    const dateZero = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = nowZero.getTime() - dateZero.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays <= 7) {
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      return days[date.getDay()];
    } else {
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    }
  } catch (e) {
    return '';
  }
};
