import { Edit3, Plus, Save, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { slugify } from "../lib/utils";
import { supabase } from "../lib/supabase";
import { getCategories } from "../services/catalog";
import type { Category } from "../types";
export function AdminCategories() {
  const [items, setItems] = useState<Category[]>([]),
    [name, setName] = useState(""),
    [editing, setEditing] = useState<Category | null>(null),
    [error, setError] = useState("");
  const load = () => getCategories().then(setItems);
  useEffect(() => {
    void load();
  }, []);
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!supabase)
      return setError("Configure o Supabase para gerenciar categorias.");
    const payload = {
      name,
      slug: slugify(name),
      sort_order: editing?.sort_order ?? items.length + 1,
    };
    const { error } = editing
      ? await supabase.from("categories").update(payload).eq("id", editing.id)
      : await supabase.from("categories").insert(payload);
    if (error) setError("Não foi possível salvar. O nome pode já existir.");
    else {
      setName("");
      setEditing(null);
      load();
    }
  }
  async function toggle(c: Category) {
    if (!supabase) return;
    await supabase
      .from("categories")
      .update({ active: !c.active })
      .eq("id", c.id);
    load();
  }
  async function remove(c: Category) {
    if (!supabase || !confirm(`Excluir a categoria “${c.name}”?`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", c.id);
    if (error)
      setError("A categoria não pode ser excluída enquanto possuir produtos.");
    else load();
  }
  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div>
          <small>Organização</small>
          <h1>Categorias</h1>
        </div>
      </div>
      <div className="category-layout">
        <form className="form-panel" onSubmit={save}>
          <h2>{editing ? "Editar categoria" : "Nova categoria"}</h2>
          <label className="field">
            Nome
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button className="button">
            {editing ? <Save /> : <Plus />}
            {editing ? "Salvar" : "Adicionar"}
          </button>
          {editing && (
            <button
              className="text-button"
              type="button"
              onClick={() => {
                setEditing(null);
                setName("");
              }}
            >
              <X />
              Cancelar
            </button>
          )}
        </form>
        <div className="panel category-list">
          {items.map((c) => (
            <div key={c.id}>
              <span>
                <b>{c.name}</b>
                <small>{c.slug}</small>
              </span>
              <button
                className="toggle"
                data-on={c.active}
                onClick={() => toggle(c)}
              >
                {c.active ? "Ativa" : "Inativa"}
              </button>
              <button
                onClick={() => {
                  setEditing(c);
                  setName(c.name);
                }}
              >
                <Edit3 />
              </button>
              <button onClick={() => remove(c)}>
                <Trash2 />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
