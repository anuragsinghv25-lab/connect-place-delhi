# Connect Place Delhi

**CP, but make it multiplayer.** A walkable 3D Connaught Place where every avatar is a real human. Pull up, vibe check the blocks, say hi.

- 🟢 Green ring = in CP right now (we only check yes/no, never your exact spot)
- 🔵 Blue ring = vibing from ghar
- Swap Insta/LinkedIn only when you both say yes

## Run it locally

```bash
npm install
cp .env.example .env.local   # then paste your Supabase URL + key
npm run dev                  # http://localhost:3000
```

## R0 setup checklist (one-time, ~30 min)

### 1. Supabase
1. Create a project at supabase.com (region: **Mumbai, ap-south-1**).
2. **Project Settings → API Keys**: copy the Project URL and the publishable key into `.env.local`.
3. **Authentication → URL Configuration**:
   - Site URL: your Vercel URL, e.g. `https://connect-place-delhi.vercel.app`
   - Redirect URLs: add `http://localhost:3000/**` and `https://*-anuragsinghv25-lab.vercel.app/**` (preview deploys) and your production URL with `/**`.
4. **Authentication → Sign In / Providers → Email**: keep enabled (magic link).

### 2. Google sign-in
1. Google Cloud Console → APIs & Services → Credentials → **Create OAuth client ID** (Web application).
2. Authorised redirect URI: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback` (Supabase shows the exact one on the Google provider page).
3. Paste the Client ID and Secret into **Supabase → Authentication → Providers → Google** and enable it.

### 3. Resend (login emails)
1. Add and verify a domain at resend.com (or use their test domain while building).
2. Create an API key.
3. **Supabase → Authentication → Emails → SMTP Settings**: enable custom SMTP
   - Host `smtp.resend.com`, port `465`, user `resend`, password = the API key
   - Sender: `no-reply@yourdomain`
4. Optional: make the magic-link email on-brand in **Authentication → Emails → Templates**.

### 4. Vercel
1. vercel.com → Add New Project → import `connect-place-delhi`.
2. Add the two env vars from `.env.example`.
3. Deploy. Every push to `main` ships; every PR gets a preview link.

**R0 is done when** you sign in with Google on the live Vercel URL from your phone and land in the adda.

## Stack

Next.js 16 · React Three Fiber · Supabase · Resend · Vercel · built with Claude Code. Rules for contributors (human or AI) are in [`CLAUDE.md`](./CLAUDE.md).
