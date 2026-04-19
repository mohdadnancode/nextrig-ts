export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  stock?: number;
  image?: string;
  category?: string;
};