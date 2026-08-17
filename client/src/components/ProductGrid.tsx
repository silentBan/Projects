import type { Product } from "../types";

interface Props {
  products: Product[];
  onAdd: (p: Product) => void;
}

export default function ProductGrid({ products, onAdd }: Props) {
  if (products.length === 0) return <p className="hint">Loading prizes…</p>;

  return (
    <div className="grid">
      {products.map((p) => (
        <article className="prize" key={p.id}>
          <div className="icon">{p.icon}</div>
          <div className="name">{p.name}</div>
          <div className="desc">{p.description}</div>
          <div className="foot">
            <span className="price">🪙 {p.priceTokens}</span>
            <button className="btn btn-add" onClick={() => onAdd(p)}>
              Add
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
