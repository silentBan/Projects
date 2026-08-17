import type { Cart, Product, Wallet } from "./types";

// Empty in dev (Vite proxies /api). Set VITE_API_URL in production.
const BASE = import.meta.env.VITE_API_URL ?? "";

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getProducts: () => req<Product[]>("/products"),
  getWallet: () => req<Wallet>("/wallet"),
  topUp: (amount = 50) =>
    req<Wallet>("/wallet/topup", { method: "POST", body: JSON.stringify({ amount }) }),
  getCart: () => req<Cart>("/cart"),
  addToCart: (productId: string, quantity = 1) =>
    req<Cart>("/cart", { method: "POST", body: JSON.stringify({ productId, quantity }) }),
  setQuantity: (productId: string, quantity: number) =>
    req<Cart>(`/cart/${productId}`, { method: "PATCH", body: JSON.stringify({ quantity }) }),
  removeFromCart: (productId: string) =>
    req<Cart>(`/cart/${productId}`, { method: "DELETE" }),
  checkout: () =>
    req<{ order: unknown; balance: number }>("/checkout", { method: "POST" }),
};
