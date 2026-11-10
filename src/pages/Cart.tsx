import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { config } from "../config";
import { useShop } from "../context/ShopContext";
import { money, orderMessage, priceLabel, whatsappLink } from "../lib/utils";
export function Cart() {
  const { cart, removeFromCart, setQuantity } = useShop();
  const total = cart.reduce(
      (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
      0,
    ),
    hasUnavailable = cart.some((item) => !item.product.available),
    hasPriceOnRequest = cart.some((item) => item.product.price === null),
    totalLabel = hasPriceOnRequest ? "A combinar" : money(total);
  return (
    <section className="page cart-page">
      <div className="page-title">
        <ShoppingBag />
        <h1>Sacola de mimos</h1>
        <p>Revise seu pedido antes de conversar com a gente.</p>
      </div>
      {!cart.length ? (
        <div className="empty">
          <ShoppingBag />
          <h2>Sua sacola está vazia</h2>
          <Link className="button" to="/catalogo">
            Escolher mimos
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {cart.map((i) => (
              <article
                className="cart-item"
                key={`${i.product.id}-${i.personalization}`}
              >
                <img
                  src={
                    i.product.images?.[0]?.url ||
                    i.product.images?.[0]?.storage_path
                  }
                />
                <div>
                  <h3>{i.product.name}</h3>
                  <p>{i.personalization || "Sem personalização"}</p>
                  <strong>{priceLabel(i.product.price)}</strong>
                </div>
                <div className="quantity">
                  <button
                    onClick={() => setQuantity(i.product.id, i.quantity - 1)}
                  >
                    <Minus />
                  </button>
                  <b>{i.quantity}</b>
                  <button
                    onClick={() => setQuantity(i.product.id, i.quantity + 1)}
                  >
                    <Plus />
                  </button>
                </div>
                <button
                  className="icon-danger"
                  onClick={() => removeFromCart(i.product.id)}
                >
                  <Trash2 />
                </button>
              </article>
            ))}
          </div>
          <aside className="summary">
            <h2>Resumo do pedido</h2>
            <p>
              Subtotal <strong>{totalLabel}</strong>
            </p>
            <p>
              Total <strong>{totalLabel}</strong>
            </p>
            {hasUnavailable && (
              <div className="warning">
                Remova os produtos esgotados antes de finalizar.
              </div>
            )}
            <a
              className="button"
              aria-disabled={hasUnavailable}
              href={
                !hasUnavailable
                  ? whatsappLink(orderMessage(cart), config.whatsappNumber)
                  : undefined
              }
              target="_blank"
              rel="noreferrer"
            >
              Finalizar pelo WhatsApp
            </a>
          </aside>
        </div>
      )}
    </section>
  );
}
