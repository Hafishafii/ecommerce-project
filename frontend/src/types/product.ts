export interface ProductType {
    _id: string;
    name: string;
    brand: string;
    price: number;
    images: string[];
    averageRating: number;
    discount?: {
      percentage: number;
    };
  }
  