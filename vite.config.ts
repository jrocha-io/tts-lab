import { defineConfig } from 'vite';

// COOP/COEP give the page cross-origin isolation (crossOriginIsolated → SharedArrayBuffer), which the
// sherpa-onnx-wasm MULTI-THREAD build needs. This lives ONLY in the lab: the dev server sets the headers
// here; the production deploy sets them via public/_headers (Cloudflare Pages). The game never gets them.
export default defineConfig({
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: true,
  },
});
