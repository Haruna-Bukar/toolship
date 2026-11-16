import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
console.log("Supabase URL in use:", url);

if (!url || !key) {
  throw new Error(
    "Missing Supabase settings. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env file, then restart the dev server."
  );
}

// The publishable key is meant to be public. Real protection comes from Supabase Auth and database rules.
// Never put a secret key or service_role key in this project's frontend code.
export const supabase = createClient(url, key);

// Development only: lets you test security rules from the browser console. Removed from production builds.
if (import.meta.env.DEV) window.supabase = supabase;