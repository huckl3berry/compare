// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fdifnayejiccdibqxwkj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkaWZuYXllamljY2RpYnF4d2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzODE1MzIsImV4cCI6MjA1Njk1NzUzMn0.-j4vKSzaoTozk9_WtuvkxKicef4Tx62dlhZTCRo6Ju0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);