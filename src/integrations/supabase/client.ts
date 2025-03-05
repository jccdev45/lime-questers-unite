import { Database } from "@/integrations/supabase/supabase-generated-types";
import { createClient } from "@supabase/supabase-js";

// These environment variables should be properly set in a .env file
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project-url.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

export const supabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);
