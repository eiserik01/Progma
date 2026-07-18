import React, { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "./supabaseClient.js";
import { AuthContext } from "./AuthContext.js";

function MissingConfig() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 font-body antialiased">
      <div className="max-w-md text-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-violet-700 flex items-center justify-center mx-auto mb-5">
          <span className="font-display text-base font-bold text-white">P</span>
        </div>
        <h1 className="font-display text-lg font-semibold text-white mb-3">Systém není připraven</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Chybí připojení k databázi. Zkontrolujte proměnné prostředí{" "}
          <code className="text-violet-300 font-jb">VITE_SUPABASE_URL</code> a{" "}
          <code className="text-violet-300 font-jb">VITE_SUPABASE_ANON_KEY</code> — postup je v README.
        </p>
      </div>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-violet-700 flex items-center justify-center animate-pulse-glow">
        <span className="font-display text-base font-bold text-white">P</span>
      </div>
      <span className="text-xs font-jb uppercase tracking-widest text-zinc-600">Načítám</span>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) setError("Nesprávný e-mail nebo heslo.");
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 font-body antialiased">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-violet-700 flex items-center justify-center mb-5">
          <span className="font-display text-base font-bold text-white">P</span>
        </div>
        <h1 className="font-display text-lg font-semibold text-white mb-1">Progma OS</h1>
        <p className="text-sm text-zinc-500 mb-6">Přihlaste se svým firemním účtem.</p>

        <input
          type="email"
          autoFocus
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jmeno@progma.cz"
          className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors mb-3"
        />
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Heslo"
          className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors mb-3"
        />
        {error && <p className="text-xs text-rose-400 mb-3">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 px-5 py-3 text-sm font-semibold text-white transition-colors"
        >
          {submitting ? "Přihlašuji…" : "Přihlásit se"}
        </button>
      </form>
    </div>
  );
}

export default function AdminAuth({ children }) {
  const [session, setSession] = useState(undefined); // undefined = ještě nevíme, null = odhlášen

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) return <MissingConfig />;
  if (session === undefined) return <LoadingScreen />;
  if (!session) return <LoginForm />;

  return (
    <AuthContext.Provider value={{ session, signOut: () => supabase.auth.signOut() }}>
      {children}
    </AuthContext.Provider>
  );
}
