import { Edit3, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { money } from "../lib/utils";
import { supabase } from "../lib/supabase";
import { getProducts } from "../services/catalog";
import type { Product } from "../types";
export function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]),
    [q, setQ] = useState(""),
    [error, setError] = useState("");
  const load = () =>
    getProducts(false)
      .then(setItems)
      .catch(() => setError("Não foi possível carregar os produtos."));
  useEffect(() => {
    void load();
  }, []);
  async function toggle(
    p: Product,
    key: "published" | "available" | "featured",
  ) {
    if (!supabase)
      return setError("Configure o Supabase para alterar produtos.");
    const { error } = await supabase
      .from("products")
      .update({ [key]: !p[key] })
      .eq("id", p.id);
    if (error) setError("Não foi possível salvar a alteração.");
    else load();
  }
  async function remove(p: Product) {
    if (
      !confirm(`Excluir “${p.name}”? Esta ação não pode ser desfeita.`) ||
      !supabase
    )
      return;
    const paths =
      p.images
        ?.map((i) => i.storage_path)
        .filter((x) => !x.startsWith("http")) || [];
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (!error && paths.length)
      await supabase.storage.from("product-images").remove(paths);
    if (error) setError("Não foi possível excluir o produto.");
    else load();
  }
  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div>
          <small>Catálogo</small>
          <h1>Gerenciar produtos</h1>
        </div>
        <Link className="button" to="/admin/produtos/novo">
          + Novo mimo
        </Link>
      </div>
      {error && <div className="form-error">{error}</div>}
      <label className="admin-search">
        <Search />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar produto…"
        />
      </label>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Preço</th>
              <th>Publicado</th>
              <th>Disponível</th>
              <th>Destaque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items
              .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
              .map((p) => (
                <tr key={p.id}>
                  <td>
                    <b>{p.name}</b>
                    <small>{p.category?.name}</small>
                  </td>
                  <td>{p.price === null ? "Sob consulta" : money(p.price)}</td>
                  <td>
                    <button
                      className="toggle"
                      data-on={p.published}
                      onClick={() => toggle(p, "published")}
                    >
                      {p.published ? "Sim" : "Não"}
                    </button>
                  </td>
                  <td>
                    <button
                      className="toggle"
                      data-on={p.available}
                      onClick={() => toggle(p, "available")}
                    >
                      {p.available ? "Sim" : "Não"}
                    </button>
                  </td>
                  <td>
                    <button
                      className="toggle"
                      data-on={p.featured}
                      onClick={() => toggle(p, "featured")}
                    >
                      {p.featured ? "Sim" : "Não"}
                    </button>
                  </td>
                  <td className="actions">
                    <Link to={`/admin/produtos/${p.id}/editar`}>
                      <Edit3 />
                    </Link>
                    <button onClick={() => remove(p)}>
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
