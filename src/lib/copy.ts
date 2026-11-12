// All user-facing copy lives here so the GenZ-Delhi voice stays consistent.
// Rule of thumb: slang for vibes, plain words for anything about safety,
// privacy or money. Never make someone guess what a button does.

export const copy = {
  brand: "Connect Place Delhi",
  tagline: "CP, but make it multiplayer.",

  landing: {
    kicker: "Rajiv Chowk pe milte hain",
    title: "Scene kya hai, CP?",
    sub: "A walkable 3D Connaught Place where every avatar is a real human. Pull up, vibe check the blocks, say hi. No cap.",
    cta: "Chal, enter CP",
    ctaSignedIn: "Back to the adda",
    secondary: "Kaise kaam karta hai?",
    how: [
      {
        title: "Spawn in Central Park",
        body: "Walk the Inner Circle, Middle Circle, Outer Circle. A to N blocks, sab hai.",
      },
      {
        title: "Green = in CP, Blue = vibing from ghar",
        body: "We only check if you're inside CP. Yes or no. Your exact spot? Never stored, never shown.",
      },
      {
        title: "Say hi, swap handles",
        body: "Insta or LinkedIn, only when you both say yes. Zero PII drama.",
      },
      {
        title: "Jamming? Café offer?",
        body: "Drop a pin. Buskers and cafés get seen by everyone in CP rn.",
      },
    ],
    legend: { inCp: "In CP rn", visiting: "Vibing from ghar" },
    footer: "Made in Dilli with too much chai. Beta, so bugs are free.",
  },

  login: {
    title: "Entry pass lo",
    sub: "Sign in to drop into CP. Takes 10 seconds, promise.",
    google: "Continue with Google",
    or: "ya phir",
    emailLabel: "Email",
    emailPlaceholder: "tu@gmail.com",
    magic: "Send me a magic link",
    sending: "Bhej rahe hain...",
    sent: "Link bhej diya! Check your inbox (and spam, just in case).",
    errorGeneric: "Kuch toh gadbad hai. Try again?",
    errorExpired: "That link expired. Mangwa lo naya wala.",
    noEnv: "Supabase isn't connected yet. Add the env vars from .env.example and restart.",
    back: "← wapas",
    fine: "By signing in you confirm you're 18+ and agree to keep it respectful.",
  },

  adda: {
    hi: (name: string) => `Aagaye ${name}! 🫡`,
    sub: "You're in. The full 3D CP drops in Release 1. Abhi ke liye, yeh dekh lo.",
    status: "Account: verified. Vibe: immaculate.",
    signOut: "Sign out",
    loading: "Loading your vibe...",
  },
} as const;
