export interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  priceTokens: number;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface Wallet {
  id: string;
  balance: number;
}
