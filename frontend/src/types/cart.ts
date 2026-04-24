export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  countInStock?: number;
  image?: string;
  category?: string;
};