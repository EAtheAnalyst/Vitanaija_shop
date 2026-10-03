import type { Product, Review } from "@/content/types";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type OrderItem = { slug: string; name: string; unitPrice: number; quantity: number };

export type NewOrder = {
  number: string;
  customerId: string | null;
  email: string;
  name: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  notes: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  items: OrderItem[];
};

export type Order = NewOrder & {
  id: string;
  status: OrderStatus;
  paymentMethod: "pay_on_delivery";
  emailSentAt: string | null;
  createdAt: string;
};

export type CustomerInput = { email: string; name: string | null; image: string | null; googleId: string | null };

/** A signed-in customer's cart, shared between web and mobile. Only slugs + quantities are stored. */
export type CartItem = { slug: string; qty: number };
export type SavedCart = { items: CartItem[]; updatedAt: string | null };

export interface Store {
  listProducts(): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | null>;
  createOrder(order: NewOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | null>;
  listOrdersByEmail(email: string): Promise<Order[]>;
  markOrderEmailed(id: string): Promise<void>;
  upsertCustomer(c: CustomerInput): Promise<string>;
  findCustomerId(email: string): Promise<string | null>;
  addSubscriber(email: string, source: string): Promise<"created" | "exists">;
  addMessage(m: { name: string; email: string; message: string }): Promise<void>;
  listApprovedReviews(): Promise<Review[]>;
  getCart(email: string): Promise<SavedCart>;
  saveCart(email: string, items: CartItem[]): Promise<SavedCart>;
}
