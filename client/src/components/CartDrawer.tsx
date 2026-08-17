import type { Cart } from "../types";

interface Props {
  open: boolean;
  cart: Cart;
  balance: number;
  onClose: () => void;
  onSetQty: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  open,
  cart,
  balance,
  onClose,
  onSetQty,
  onRemove,
  onCheckout,
}: Props) {
  const { items, total } = cart;
  const empty = items.length === 0;
  const canAfford = total <= balance;

  return (
    <>
      <div className={`scrim ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`drawer ${open ? "open" : ""}`} aria-hidden={!open} aria-label="Cart">
        <div className="drawer-head">
          <h3>🎟️ Your Ticket</h3>
          <button className="close-x" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>

        <div className="cart-items">
          {empty ? (
            <div className="empty">
              <div className="big">🎟️</div>
              <div>Your ticket's empty.</div>
              <div className="hint">Add a prize from the counter to get started.</div>
            </div>
          ) : (
            items.map((i) => (
              <div className="line" key={i.id}>
                <span className="li-icon">{i.product.icon}</span>
                <div className="li-body">
                  <div className="li-name">{i.product.name}</div>
                  <div className="li-price">🪙 {i.product.priceTokens} each</div>
                </div>
                <div className="qty">
                  <button
                    onClick={() => onSetQty(i.productId, i.quantity - 1)}
                    aria-label={`Remove one ${i.product.name}`}
                  >
                    −
                  </button>
                  <span className="n">{i.quantity}</span>
                  <button
                    onClick={() => onSetQty(i.productId, i.quantity + 1)}
                    aria-label={`Add one ${i.product.name}`}
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove"
                  onClick={() => onRemove(i.productId)}
                  aria-label={`Remove ${i.product.name}`}
                >
                  clear
                </button>
              </div>
            ))
          )}
        </div>

        <div className="drawer-foot">
          <div className="total-row">
            <span className="lbl">Total</span>
            <span className="val">🪙 {total}</span>
          </div>
          <p className={`balance-note ${!empty && !canAfford ? "short" : ""}`}>
            {empty
              ? ""
              : canAfford
              ? `You'll have ${balance - total} tokens left after redeeming.`
              : `Short by ${total - balance} tokens — insert a coin or remove something.`}
          </p>
          <button className="btn btn-checkout" disabled={empty || !canAfford} onClick={onCheckout}>
            Redeem prizes
          </button>
        </div>
      </aside>
    </>
  );
}
