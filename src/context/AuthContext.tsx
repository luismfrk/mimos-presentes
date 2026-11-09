import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
type Auth = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};
const C = createContext<Auth | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null),
    [isAdmin, setAdmin] = useState(false),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!supabase) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    (async () => {
      if (!supabase || !session) {
        queueMicrotask(() => {
          setAdmin(false);
          setLoading(false);
        });
        return;
      }
      const { data, error } = await supabase.rpc("is_admin");
      setAdmin(!error && data === true);
      setLoading(false);
    })();
  }, [session]);
  return (
    <C.Provider
      value={{
        session,
        user: session?.user || null,
        isAdmin,
        loading,
      signIn: async (e, p) => {
          if (!supabase) throw new Error("Configure o Supabase para entrar.");
        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: e,
            password: p,
          });
          if (error) throw new Error("E-mail ou senha inválidos.");
        const { data: admin, error: adminError } =
          await supabase.rpc("is_admin");
        if (adminError) {
          await supabase.auth.signOut();
          throw new Error(
            "Login aceito, mas não foi possível verificar a permissão administrativa.",
          );
        }
        if (admin !== true) {
          await supabase.auth.signOut();
          throw new Error("Este usuário ainda não está autorizado como administrador.");
        }
        setAdmin(true);
        setSession(authData.session);
        },
        signOut: async () => {
          await supabase?.auth.signOut();
        },
      }}
    >
      {children}
    </C.Provider>
  );
}
export const useAuth = () => {
  const c = useContext(C);
  if (!c) throw new Error("AuthProvider ausente");
  return c;
};
