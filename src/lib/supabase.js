import { createClient }
from '@supabase/supabase-js'

const supabaseUrl =
  'https://gitmguffqshjfifldkew.supabase.co'

const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdG1ndWZmcXNoamZpZmxka2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MDk1MTcsImV4cCI6MjA5NDM4NTUxN30.CtAtrRAkvgf5dScvL-FVgC0T--U6bw0UudTZekxjv0Y'

export const supabase =
  createClient(
    supabaseUrl,
    supabaseKey
  )