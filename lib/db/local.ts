import "server-only";
import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { products } from "@/content/products";
import type { Order, SavedCart, Store } from "./types";

// Development fallback used when Supabase keys are not set.
// Stores data in .data/db.json so the full checkout flow can be tested locally.

type LocalData = {
  orders: Order[];
  customers: { id: string; email: string; name: string | null; image: string | null; googleId: string | null }[];
  subscribers: { email: string; source: string; createdAt: string }[];
  messages: { name: string; email: string; message: string; createdAt: string }[];
  carts?: Record<string, SavedCart>;
};

const file = path.join(process.cwd(), ".data", "db.json");

function load(): LocalData {
  if (!existsSync(file)) return { orders: [], customers: [], subscribers: [], messages: [] };
  return JSON.parse(readFileSync(file, "utf8")) as LocalData;
}

function save(data: LocalData) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(data, null, 2));
}

export const localStore: Store = {
  async listProducts() {
    return products;
  },
  async getProduct(slug) {
    return products.find((p) => p.slug === slug) ?? null;
  },
  async createOrder(o) {
    const data = load();
    const order: Order = {
      ...o,
      email: o.email.toLowerCase(),
      id: randomUUID(),
      status: "pending",
      paymentMethod: "pay_on_delivery",
      emailSentAt: null,
      createdAt: new Date().toISOString(),
    };
    data.orders.push(order);
    save(data);
    return order;
  },
  async getOrder(id) {
    return load().orders.find((o) => o.id === id) ?? null;
  },
  async listOrdersByEmail(email) {
    return load()
      .orders.filter((o) => o.email === email.toLowerCase())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async markOrderEmailed(id) {
    const data = load();
    const order = data.orders.find((o) => o.id === id);
    if (order) order.emailSentAt = new Date().toISOString();
    save(data);
  },
  async upsertCustomer(c) {
    const data = load();
    const email = c.email.toLowerCase();
    let customer = data.customers.find((x) => x.email === email);
    if (customer) Object.assign(customer, { name: c.name, image: c.image, googleId: c.googleId });
    else data.customers.push((customer = { id: randomUUID(), ...c, email }));
    save(data);
    return customer.id;
  },
  async findCustomerId(email) {
    return load().customers.find((x) => x.email === email.toLowerCase())?.id ?? null;
  },
  async addSubscriber(email, source) {
    const data = load();
    const e = email.toLowerCase();
    if (data.subscribers.some((s) => s.email === e)) return "exists";
    data.subscribers.push({ email: e, source, createdAt: new Date().toISOString() });
    save(data);
    return "created";
  },
  async addMessage(m) {
    const data = load();
    data.messages.push({ ...m, createdAt: new Date().toISOString() });
    save(data);
  },
  async listApprovedReviews() {
    return [];
  },
  async getCart(email) {
    return load().carts?.[email.toLowerCase()] ?? { items: [], updatedAt: null };
  },
  async saveCart(email, items) {
    const data = load();
    const cart: SavedCart = { items, updatedAt: new Date().toISOString() };
    data.carts = { ...(data.carts ?? {}), [email.toLowerCase()]: cart };
    save(data);
    return cart;
  },
};
