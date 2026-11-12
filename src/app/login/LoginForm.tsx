"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { copy } from "@/lib/copy";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";

const t = copy.login;

type Status = "idle" | "sending" | "sent" | "error";

export default function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState(
    params.get("error") === "link-expired" ? t.errorExpired : "",
  );

  const redirectTo = () => `${window.location.origin}/auth/callback?next=/adda`;

  async function signInWithGoogle() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo() },
    });
    if (error) {
      setStatus("error");
      setMessage(t.errorGeneric);
    }
  }

  async function sendMagicLink(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo() },
    });
    if (error) {
      setStatus("error");
      setMessage(t.errorGeneric);
    } else {
      setStatus("sent");
      setMessage(t.sent);
    }
  }

  if (!hasSupabaseEnv) {
    return <p className="text-sm text-chai">{t.noEnv}</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      <button type="button" onClick={signInWithGoogle} className="btn-primary w-full">
        <GoogleIcon /> {t.google}
      </button>

      <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted">
        <span className="h-px flex-1 bg-white/15" />
        {t.or}
        <span className="h-px flex-1 bg-white/15" />
      </div>

      <form onSubmit={sendMagicLink} className="flex flex-col gap-3">
        <label htmlFor="email" className="text-sm font-semibold">
          {t.emailLabel}
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
          className="rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-ink placeholder:text-muted/70 focus:border-pink focus:outline-none"
        />
        <button type="submit" disabled={status === "sending"} className="btn-ghost w-full">
          {status === "sending" ? t.sending : t.magic}
        </button>
      </form>

      {message && (
        <p
          role="status"
          className={`text-sm ${status === "sent" ? "text-incp" : "text-chai"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  );
}
