import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

const POLO_COLOR_MAP: Record<string, string> = {
  'Orange':       '#F47920',
  'Cosco Green':  '#7EC826',
  'Pink':         '#F4A7B9',
  'Royal Blue':   '#1B3F8B',
  'Lemon Yellow': '#F5E642',
  'White':        '#F5F5F5',
  'Red':          '#D0021B',
  'Dark Grey':    '#3A3A3A',
  'Firozi Blue':  '#00AEEF',
  'Maroon':       '#800020',
  'Bottle Green': '#1A4731',
  'Sky Blue':     '#87CEEB',
  'Navy Blue':    '#0A1045',
  'Light Grey':   '#C8C8C8',
};

export interface FSProduct {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  originalPrice: number;
  description: string;
  fabricGsm: string;
  composition: string;
  silhouette: string;
  sizes: string[];
  isNew: boolean;
  isBestseller: boolean;
  published: boolean;
  primaryImage: string;
  secondaryImage: string;
  detailImage: string;
  edition: string;
  productType?: string;
  poloColors?: string[];
  // Computed from poloColors for polo products
  computedColors?: { name: string; hex: string }[];
}

export function useFirestoreProducts() {
  const [products, setProducts] = useState<FSProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'products'), where('published', '==', true)))
      .then(snap => {
        const list = snap.docs.map(d => {
          const data = { id: d.id, ...d.data() } as FSProduct;
          // For polo products, build computedColors from poloColors array
          if (data.productType === 'polo' && data.poloColors && data.poloColors.length > 0) {
            data.computedColors = data.poloColors.map(colorName => ({
              name: colorName,
              hex: POLO_COLOR_MAP[colorName] || '#888888',
            }));
          }
          return data;
        });
        setProducts(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { products, loading };
}
