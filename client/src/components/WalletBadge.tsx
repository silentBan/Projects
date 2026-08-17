import { useEffect, useRef, useState } from "react";

// LED-style balance that eases from its old value to the new one when it changes.
export default function WalletBadge({ balance }: { balance: number }) {
  const [display, setDisplay] = useState(balance);
  const prev = useRef(balance);

  useEffect(() => {
    const start = prev.current;
    const delta = balance - start;
    prev.current = balance;

    if (delta === 0) {
      setDisplay(balance);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(balance);
      return;
    }

    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 380);
      const eased = 1 - Math.pow(1 - k, 3);
      setDisplay(Math.round(start + delta * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
      else setDisplay(balance);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [balance]);

  return (
    <div className="wallet" title="Your token balance">
      <span className="coin">🪙</span>
      <div>
        <div className="amount" aria-live="polite">
          {display}
        </div>
        <div className="label">tokens</div>
      </div>
    </div>
  );
}
