export type ProductCategory = 'track-pants' | 't-shirts' | 'shirts' | 'oversize-tshirts' | 'hoodies';

export interface ColorOption {
  name: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  colors: ColorOption[];
  sizes: ('S' | 'M' | 'L' | 'XL')[];
  description: string;
  details: string[];
  fabricGsm: string;
  composition: string;
  silhouette: string;
  images: {
    primary: string;
    secondary: string;
    detail?: string;
  };
  isNew?: boolean;
  isBestseller?: boolean;
  edition?: string;
  productType?: 'standard' | 'polo';
  poloColors?: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: ColorOption;
  selectedSize: 'S' | 'M' | 'L' | 'XL';
  quantity: number;
}

export interface LookbookItem {
  id: string;
  lookNumber: string;
  title: string;
  itemsFeatured: string[];
  image: string;
  season: string;
}
