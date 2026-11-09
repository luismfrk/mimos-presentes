import { Eye, EyeOff, Gift, LogIn } from "lucide-react";
import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export function Login() {
  const { signIn, session, isAdmin } = useAuth(),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [show, setShow] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  if (session && isAdmin) return <Navigate to="/admin" replace />;
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signIn(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível entrar.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="login">
      <form onSubmit={submit}>
        <div className="login-logo">
          <Gift />
          <h1>Bem-vinda à Mimo</h1>
          <p>Entre para cuidar dos seus mimos.</p>
        </div>
        <label className="field">
          E-mail
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
        <label className="field">
          Senha
          <div className="password">
            <input
              required
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button type="button" onClick={() => setShow(!show)}>
              {show ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </label>
        {error && <div className="form-error">{error}</div>}
        <button className="button" disabled={busy}>
          <LogIn />
          {busy ? "Entrando…" : "Entrar no painel"}
        </button>
        <small>O acesso é exclusivo para administradores autorizados.</small>
      </form>
    </section>
  );
}
