export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
};

export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  pincode: string;
  mobileNumber: string;
};

export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id: string;
  date: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod?: string;
  shippingAddress?: ShippingAddress;
  cancelledBy?: "user" | "admin";
  cancelledAt?: string;
};
