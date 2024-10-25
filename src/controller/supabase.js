import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://upwcnfvlhbygdjyktetk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwd2NuZnZsaGJ5Z2RqeWt0ZXRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjY1NzU1MiwiZXhwIjoyMDQyMjMzNTUyfQ.3SlJ2i7oRXKs2P3oySe5CWZygtouSHqLriMBPjaB1_I';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
