import Link from "next/link";
import { Suspense } from "react";
import { copy } from "@/lib/copy";
import LoginForm from "./LoginForm";

const t = copy.login;

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm text-muted hover:text-ink">
          {t.back}
        </Link>
        <div className="mt-6">
          <span className="sticker text-xs">entry pass 🎟️</span>
        </div>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">{t.title}</h1>
        <p className="mt-2 text-sm text-muted">{t.sub}</p>
        <div className="card mt-8 p-6">
          <Suspense fallback={<p className="text-sm text-muted">...</p>}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-4 text-xs text-muted">{t.fine}</p>
      </div>
    </main>
  );
}
