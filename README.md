# TTS Lab

A first-class benchmark app (TypeScript · Vite) comparing text-to-speech engines for
[The Inclusionist](https://github.com/jrocha-io/the-inclusionist) — an accessibility-first educational game.
Three stacked sections: **fallback** (eSpeak NG + Web Speech), **sherpa** (Piper médio/high + Kokoro fp32),
and **WebGPU** (Kokoro fp32/fp16). Deploys to a `labs.` Cloudflare domain, separate from the game.

Engines come from the versioned `@jrocha-io/*` packages
([inclusionist-commons](https://github.com/jrocha-io/inclusionist-commons)); the UI depends only on the
`TtsEngine` port, so the winning engine graduates into the game unchanged. No runtime CDN — every dep is
bundled by Vite. Decisions: the-inclusionist ADR-0023 + ADR-0024. Plan:
the-inclusionist `docs/5-Refactoring/plano-tts-lab-modularizacao.md`.

## Develop

```bash
npm install
npm run dev        # COOP/COEP set by the dev server (cross-origin isolation for sherpa multi-thread)
npm run build      # tsc --noEmit && vite build → dist/
npm run preview
npm run test       # vitest
```

Production cross-origin isolation is set by `public/_headers` (Cloudflare Pages). On Windows + Avast, run
npm with `NODE_OPTIONS=--use-system-ca` and `UV_NATIVE_TLS=1`.

Status: **Stage 0 — scaffold** (mounts a placeholder; the three sections land in later rounds).

License: GPL-3.0-or-later.
