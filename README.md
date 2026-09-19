# Project Flight Update 9 Checklist

This version adds Supabase email/password authentication, account creation, email confirmation, password reset, guest access, logout, and the existing checklist.

## Setup

1. Open `config.js`.
2. Paste your Supabase Publishable Key into `supabasePublishableKey`.
3. Never put a Supabase secret or service-role key in this file.
4. In Supabase Authentication settings, set the Vercel site URL as the Site URL and allowed redirect URL.
5. Upload all five files to GitHub.

The checklist itself is saved in browser storage. Authentication is handled by Supabase.
