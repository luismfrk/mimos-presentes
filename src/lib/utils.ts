import type { CartItem, Product } from "../types";

export const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );

export const priceLabel = (value: number | null) =>
  value === null ? "Preço sob consulta" : money(value);

export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function whatsappLink(message: string, whatsappNumber: string) {
  const numero = whatsappNumber.replace(/\D/g, "");
  if (!/^55\d{10,11}$/.test(numero))
    throw new Error("O WhatsApp deve conter código do país 55, DDD e número.");
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}

export const productMessage = (product: Product) =>
  `Oiii! Estava dando uma olhadinha no catálogo da Mimo Presentes e me interessei pelo item *${product.name}*. Gostaria de saber mais informações sobre ele!`;

export const orderMessage = (items: CartItem[]) => {
  const hasPriceOnRequest = items.some((item) => item.product.price === null);
  const total = items.reduce(
    (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
    0,
  );
  const products = items
    .map((item) => {
      const personalization = item.personalization
        ? `\nPersonalização: ${item.personalization}`
        : "";
      const subtotal =
        item.product.price === null
          ? "Sob consulta"
          : money(item.product.price * item.quantity);
      return ` ${item.product.name}\nQuantidade: ${item.quantity}${personalization}\nSubtotal: ${subtotal}`;
    })
    .join("\n\n");

  return `Olá! Gostaria de pedir estes mimos:\n\n${products}\n\n Total: ${hasPriceOnRequest ? "A combinar" : money(total)}`;
};
