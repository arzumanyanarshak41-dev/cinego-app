export const supabaseUrl = "https://xfkrnkyslblmlfxdyrsv.supabase.co";
export const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhma3Jua3lzbGJsbWxmeGR5cnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDE1NTIsImV4cCI6MjA4OTE3NzU1Mn0.6qPi_24OX6faittvZSgjoSs3wFMyDSRFTf-Rr6W3a2g";
export const supabaseHeaders = {
    "apikey": supabaseAnonKey,
    "Authorization": `Bearer ${supabaseAnonKey}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
};
