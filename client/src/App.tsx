import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import type { Cart, Product, Wallet } from "./types";
import ProductGrid from "./components/ProductGrid";
import CartDrawer from "./components/CartDrawer";
import WalletBadge from "./components/WalletBadge";
import Toast from "./components/Toast";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; em: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const notify = useCallback((msg: string, em = "🎉") => {
    setToast({ msg, em });
    setTimeout(() => setToast(null), 1900);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const [p, w, c] = await Promise.all([api.getProducts(), api.getWallet(), api.getCart()]);
      setProducts(p);
      setWallet(w);
      setCart(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = async (product: Product) => {
    setCart(await api.addToCart(product.id));
    notify(`${product.icon} ${product.name} added`);
  };

  const setQty = async (productId: string, quantity: number) => {
    setCart(await api.setQuantity(productId, quantity));
  };

  const remove = async (productId: string) => {
    setCart(await api.removeFromCart(productId));
  };

  const topUp = async () => {
    setWallet(await api.topUp(50));
    notify("+50 tokens dropped in", "🪙");
  };

  const checkout = async () => {
    const count = cart.items.reduce((s, i) => s + i.quantity, 0);
    try {
      const { balance } = await api.checkout();
      setWallet((w) => (w ? { ...w, balance } : w));
      setCart(await api.getCart());
      setDrawerOpen(false);
      notify(`Redeemed ${count} prize${count > 1 ? "s" : ""}! Enjoy`, "🎊");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Checkout failed", "⚠️");
    }
  };

  const count = cart.items.reduce((s, i) => s + i.quantity, 0);

  if (error) {
    return (
      <div className="boot-error">
        <h1>Can't reach the counter</h1>
        <p>{error}</p>
        <p className="hint">Make sure the API server is running, then reload.</p>
      </div>
    );
  }

  return (
    <>
      <header className="site-header">
        <div className="logo">
          TOKEN<span>·</span>TOWN
        </div>
        <div className="spacer" />
        <WalletBadge balance={wallet?.balance ?? 0} />
        <button className="btn btn-coin" onClick={topUp}>
          🎰 <span className="txt">Insert coin</span>
        </button>
        <button className="btn btn-cart" onClick={() => setDrawerOpen(true)}>
          🛒 Cart
          {count > 0 && <span className="cart-count">{count}</span>}
        </button>
      </header>

      <section className="hero">
        <p className="eyebrow">// redeem your winnings</p>
        <h1>
          The <span className="a">Prize</span> <span className="b">Counter</span>
        </h1>
        <p>
          Slide your tokens across the counter and walk away with the goods. Add prizes, adjust the
          haul, then redeem it all at once. Short on tokens? Hit Insert coin.
        </p>
      </section>

      <main>
        <div className="grid-head">
          <h2>Prizes</h2>
          <span className="hint">Tap add. Nothing's spent until you redeem.</span>
        </div>
        <ProductGrid products={products} onAdd={add} />
      </main>

      <footer>
        Built with React · Node/Express · PostgreSQL + Prisma · virtual tokens only
      </footer>

      <CartDrawer
        open={drawerOpen}
        cart={cart}
        balance={wallet?.balance ?? 0}
        onClose={() => setDrawerOpen(false)}
        onSetQty={setQty}
        onRemove={remove}
        onCheckout={checkout}
      />

      {toast && <Toast msg={toast.msg} em={toast.em} />}
    </>
  );
}
