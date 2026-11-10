import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  getCategories,
  getProducts,
  isSupabaseConfigured,
} from "../services/catalog";
import type { Category, Product } from "../types";
import { ProductCard } from "../components/ProductCard";
function ChristmasDecoration() {
  return (
    <div className="christmas-decoration" aria-hidden="true">
      <svg viewBox="0 0 1000 135" preserveAspectRatio="none">
        <path className="christmas-wire" d="M-10 13 Q250 74 500 35 T1010 19" />
        <g className="christmas-lights">
          {[
            [70, 27, "red"],
            [170, 43, "gold"],
            [270, 48, "green"],
            [370, 43, "red"],
            [470, 36, "gold"],
            [570, 31, "green"],
            [670, 27, "red"],
            [770, 29, "gold"],
            [870, 32, "green"],
            [950, 25, "red"],
          ].map(([x, y, color], index) => (
            <g
              className={`christmas-light christmas-light--${color}`}
              style={{ "--light-delay": `${index * 0.09}s` } as CSSProperties}
              key={x}
            >
              <path d={`M${Number(x) - 4} ${Number(y) - 5}h8v7h-8z`} />
              <circle cx={x} cy={Number(y) + 7} r="7" />
            </g>
          ))}
        </g>
        <g className="christmas-bauble christmas-bauble--red">
          <path d="M245 47v29" />
          <rect x="238" y="72" width="14" height="8" rx="2" />
          <circle cx="245" cy="96" r="18" />
          <path className="bauble-shine" d="M236 87q-5 6-2 13" />
        </g>
        <g className="christmas-bauble christmas-bauble--gold">
          <path d="M505 35v51" />
          <rect x="498" y="82" width="14" height="8" rx="2" />
          <circle cx="505" cy="107" r="19" />
          <path className="bauble-shine" d="M496 98q-5 6-2 13" />
        </g>
        <g className="christmas-bauble christmas-bauble--green">
          <path d="M755 28v38" />
          <rect x="748" y="62" width="14" height="8" rx="2" />
          <circle cx="755" cy="86" r="18" />
          <path className="bauble-shine" d="M746 77q-5 6-2 13" />
        </g>
      </svg>
    </div>
  );
}
export function Catalog() {
  const [products, setProducts] = useState<Product[]>([]),
    [categories, setCategories] = useState<Category[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [query, setQuery] = useState(""),
    [cat, setCat] = useState(""),
    [sort, setSort] = useState("new");
  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch(() =>
        setError("Não foi possível carregar os mimos. Tente novamente."),
      )
      .finally(() => setLoading(false));
  }, []);
  const christmasCategory = categories.find(
    (category) => category.slug === "natal",
  );
  const isChristmasSelected = cat === christmasCategory?.id;
  const filtered = useMemo(
    () =>
      products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) &&
            (!cat || p.category_id === cat),
        )
        .sort((a, b) =>
          sort === "asc"
            ? a.price - b.price
            : sort === "desc"
              ? b.price - a.price
              : new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
        ),
    [products, query, cat, sort],
  );
  return (
    <section className="page catalog-page">
      <div className="page-title">
        <span>Feitos para encantar</span>
        <h1>Catálogo de mimos</h1>
        <p>Presentes escolhidos com carinho para pessoas especiais.</p>
      </div>
      {isChristmasSelected && <ChristmasDecoration />}
      {!isSupabaseConfigured && (
        <div className="demo-note">
          Modo demonstração: configure o Supabase para exibir o catálogo real.
        </div>
      )}
      <div className="filters">
        <label>
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar um mimo…"
          />
        </label>
        <label>
          <SlidersHorizontal />
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">Novidades</option>
          <option value="asc">Menor preço</option>
          <option value="desc">Maior preço</option>
        </select>
      </div>
      {loading ? (
        <div className="status">Carregando mimos…</div>
      ) : error ? (
        <div className="status error">{error}</div>
      ) : filtered.length ? (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="status">Nenhum mimo encontrado.</div>
      )}
    </section>
  );
}
