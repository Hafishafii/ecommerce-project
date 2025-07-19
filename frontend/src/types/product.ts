export interface VariantType {
  name?: string;
  size?: string;
  sku?: string;
  price?: number;
  stock?: number;
}

export interface ProductType {
  _id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  sku?: string;
  category: any;
  images: string[];
  tags: string[];
  averageRating: number;
  totalReviews: number;
  discount?: {
    percentage: number;
  };
  dimensions?: {
    weight?: number;
    height?: number;
    width?: number;
    depth?: number;
  };
  variants: VariantType[];
  createdAt: string;
}
