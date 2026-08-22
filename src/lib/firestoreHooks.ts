import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';

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
}

export function useFirestoreProducts() {
  const [products, setProducts] = useState<FSProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'products'), where('published', '==', true)))
      .then(snap => {
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as FSProduct)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { products, loading };
}
