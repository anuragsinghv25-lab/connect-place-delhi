import { redirect } from "next/navigation";
import { Suspense } from "react";
import CPSceneLazy from "@/components/world/CPSceneLazy";
import { copy } from "@/lib/copy";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const t = copy.adda;

// "Adda" = the hangout. Members-only; the proxy also guards it.
export default function AddaPage() {
  return (
    <main className="relative flex min-h-[100svh] flex-1 flex-col">
      <div className="absolute inset-0 z-0">
        <CPSceneLazy interactive />
      </div>
      <div className="pointer-events-none relative z-20 mx-auto w-full max-w-5xl px-4 pt-6 sm:px-6">
        <Suspense fallback={<p className="text-sm text-muted">{t.loading}</p>}>
          <Welcome />
        </Suspense>
      </div>
    </main>
  );
}

async function Welcome() {
  if (!hasSupabaseEnv) redirect("/login");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "bhai";

  return (
    <div className="card pointer-events-auto inline-flex max-w-md flex-col gap-2 p-5">
      <h1 className="font-display text-3xl font-extrabold">{t.hi(name)}</h1>
      <p className="text-sm text-muted">{t.sub}</p>
      <p className="text-xs text-incp">{t.status}</p>
      <form action="/auth/signout" method="post" className="mt-2">
        <button type="submit" className="btn-ghost px-4 py-2 text-sm">
          {t.signOut}
        </button>
      </form>
    </div>
  );
}
