import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";
import { useAuth } from "./useAuth.js";

const COLUMNS = "id, created_at, inputs, results";

// Turns a database row into the shape the History tab expects.
function toEntry(row) {
  return { id: row.id, createdAt: Date.parse(row.created_at), inputs: row.inputs, results: row.results };
}

// Loads and saves one tool's history in Supabase.
// We never send a user id. The database fills it in from the login token,
// and Row Level Security makes sure each person only ever sees their own rows.
export default function useHistory(toolSlug) {
  const { user } = useAuth();
  const userId = user?.id;
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    supabase
      .from("generations")
      .select(COLUMNS)
      .eq("tool", toolSlug)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!cancelled && !error) setHistory(data.map(toEntry));
      });

    return () => {
      cancelled = true;
    };
  }, [userId, toolSlug]);

  async function addEntry({ inputs, results }) {
    const { data, error } = await supabase
      .from("generations")
      .insert({ tool: toolSlug, inputs, results })
      .select(COLUMNS)
      .single();
    if (!error && data) setHistory((h) => [toEntry(data), ...h].slice(0, 50));
  }

  async function removeEntry(id) {
    setHistory((h) => h.filter((e) => e.id !== id));
    await supabase.from("generations").delete().eq("id", id);
  }

  async function clearAll() {
    setHistory([]);
    await supabase.from("generations").delete().eq("tool", toolSlug);
  }

  return { history, addEntry, removeEntry, clearAll };
}