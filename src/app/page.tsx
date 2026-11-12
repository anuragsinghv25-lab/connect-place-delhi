import Link from "next/link";
import CPSceneLazy from "@/components/world/CPSceneLazy";
import { copy } from "@/lib/copy";

const t = copy.landing;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero: the 3D CP fills the screen, copy floats on top */}
      <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CPSceneLazy />
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-night/85 via-night/10 to-night" />

        <div className="relative z-20 mx-auto flex h-full max-w-5xl flex-col justify-between px-4 pb-8 pt-6 sm:px-6">
          <header className="flex items-center justify-between">
            <span className="font-display text-lg font-extrabold tracking-tight">
              connect<span className="text-pink">place</span>.dilli
            </span>
            <Link href="/login" className="pointer-events-auto text-sm font-semibold text-muted hover:text-ink">
              Log in
            </Link>
          </header>

          <div className="pointer-events-none max-w-xl">
            <span className="sticker text-xs sm:text-sm">{t.kicker}</span>
            <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
              {t.title}
            </h1>
            <p className="mt-4 max-w-md text-base text-ink/85 sm:text-lg">{t.sub}</p>
            <div className="pointer-events-auto mt-6 flex flex-wrap gap-3">
              <Link href="/login" className="btn-primary">
                {t.cta} →
              </Link>
              <a href="#how" className="btn-ghost">
                {t.secondary}
              </a>
            </div>
            <div className="mt-5 flex gap-4 text-xs text-muted">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-incp shadow-[0_0_10px_var(--in-cp)]" />
                {t.legend.inCp}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-visiting shadow-[0_0_10px_var(--visiting)]" />
                {t.legend.visiting}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Kaise kaam karta hai</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {t.how.map((item, i) => (
            <div key={item.title} className="card p-6">
              <span className="font-display text-sm font-extrabold text-chai">0{i + 1}</span>
              <h3 className="mt-2 font-display text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto w-full max-w-5xl px-4 pb-10 text-xs text-muted sm:px-6">{t.footer}</footer>
    </main>
  );
}
