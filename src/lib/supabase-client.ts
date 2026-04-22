import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  'https://zvlqrgdqftzqtlrhzaha.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2bHFyZ2RxZnR6cXRscmh6YWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODcxOTUsImV4cCI6MjA5MjM2MzE5NX0.wrtysZ_fb2oy_WUhKyCBg4GkEUL0_vnZLhDn91fV2zw'
);
