export type Product = {
  _id: string;

  name: string;
  brand?: string;
  category: string;

  price: number;
  discount?: number;

  description?: string;

  images?: string[];

  countInStock: number;

  rating?: number;
  numReviews?: number;

  featured?: boolean;
  isAvailable?: boolean;

  sku?: string;
  specs?: Record<string, unknown>;

  createdAt?: string;
  updatedAt?: string;
};