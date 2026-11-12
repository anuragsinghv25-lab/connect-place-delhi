"use client";

import dynamic from "next/dynamic";

// WebGL only exists in the browser, so the 3D scene never renders on the server.
const CPScene = dynamic(() => import("./CPScene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center text-sm text-white/60">
      CP load ho raha hai...
    </div>
  ),
});

export default function CPSceneLazy({ interactive = false }: { interactive?: boolean }) {
  return <CPScene interactive={interactive} />;
}
