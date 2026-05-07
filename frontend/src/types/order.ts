export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  product: string;
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

export type Order = {
  _id: string;

  orderNumber: string;

  items: OrderItem[];

  itemsTotal: number;
  shippingCharge: number;
  codFee: number;

  totalAmount: number;

  status: OrderStatus;
  paymentMethod: string;
  paymentDetails?: Record<string, unknown>;

  expiresAt?: string;

  isPaid: boolean;
  paidAt?: string;

  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;

  cancelledBy?: "user" | "admin" | "system";
  cancelledAt?: string;
};
