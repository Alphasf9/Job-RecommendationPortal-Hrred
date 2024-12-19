import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = 'https://zyigcvpxwgsmvqvxsdww.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5aWdjdnB4d2dzbXZxdnhzZHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTIzODEsImV4cCI6MjA0OTk4ODM4MX0.nD-m8ilHdhFT4S_io-JuwB0cFwpgXWrdmKQ3K3RSXso';

const supabaseClient = async (supabaseAccessToken) => {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
  });
  return supabase;
};

export default supabaseClient;
