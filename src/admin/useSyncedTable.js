import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient.js";

/**
 * Drží React state synchronizovaný s jednou tabulkou v Supabase.
 *
 * - Při prvním načtení stáhne všechny řádky. Pokud je tabulka prázdná a je
 *   dodaná `seedRows`, jednorázově ji naplní ukázkovými daty (aby appka
 *   nezačínala prázdná).
 * - Přihlásí se k realtime změnám (INSERT/UPDATE/DELETE) — když cokoliv
 *   změní Erik nebo Adam na svém zařízení, obě appky se po chvíli samy
 *   překreslí s aktuálními daty. Kvůli jednoduchosti a spolehlivosti se při
 *   jakékoli změně tabulka celá znovu načte, místo ručního slučování
 *   jednotlivých řádků — pro pár desítek klientů/úkolů/kódů je to
 *   v pohodě rychlé.
 * - Vrací i `insert`/`update`/`remove` — zapisují přímo do Supabase; local
 *   state se pak sám doplní přes realtime odběr výše.
 */
export function useSyncedTable(table, seedRows) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const seededRef = useRef(false);

  const refetch = useCallback(async () => {
    const { data, error } = await supabase.from(table).select("*").order("id", { ascending: true });
    if (error) {
      setError(error.message);
      return;
    }
    setError(null);
    setRows(data ?? []);
  }, [table]);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from(table).select("*").order("id", { ascending: true });
      if (!active) return;

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if ((data?.length ?? 0) === 0 && seedRows?.length && !seededRef.current) {
        seededRef.current = true;
        const { error: seedError } = await supabase.from(table).insert(seedRows);
        if (!seedError) {
          const { data: seeded } = await supabase.from(table).select("*").order("id", { ascending: true });
          if (active) setRows(seeded ?? []);
        } else if (active) {
          setError(seedError.message);
        }
      } else if (active) {
        setRows(data ?? []);
      }

      if (active) setLoading(false);
    })();

    const channel = supabase
      .channel(`public:${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const insert = useCallback(
    async (row) => {
      const { data, error } = await supabase.from(table).insert(row).select().single();
      if (error) throw error;
      return data;
    },
    [table]
  );

  const update = useCallback(
    async (id, patch) => {
      const { error } = await supabase.from(table).update(patch).eq("id", id);
      if (error) throw error;
    },
    [table]
  );

  const remove = useCallback(
    async (id) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    [table]
  );

  return { rows, loading, error, insert, update, remove, refetch };
}
