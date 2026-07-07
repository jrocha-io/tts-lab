// Composition root. Stage 0: scaffold only — mounts a placeholder. Later stages wire the concrete adapters
// (from @jrocha-io/tts, /audio, /logging, /model-fetch) into the section controllers here via constructor
// injection. See the migration plan in the-inclusionist: docs/5-Refactoring/plano-tts-lab-modularizacao.md.

function mount(root: HTMLElement): void {
  const isolated = globalThis.crossOriginIsolated ? 'sim' : 'não';
  root.innerHTML = `
    <main style="font-family: system-ui, sans-serif; max-width: 60rem; margin: 3rem auto; padding: 0 1rem; color: #e8eaed; background: #14161a;">
      <h1 style="font-size: 1.4rem;">TTS Lab <span style="color:#9aa0aa; font-weight:400">— scaffold (Estágio 0)</span></h1>
      <p style="color:#9aa0aa">
        App de primeira classe (TS · Vite). As três seções — <b>fallback</b> (eSpeak NG + Web Speech),
        <b>sherpa</b> (Piper + Kokoro fp32) e <b>WebGPU</b> (Kokoro fp32/fp16) — chegam nas próximas rodadas,
        montadas por injeção de dependência sobre os pacotes <code>@jrocha-io/*</code>.
      </p>
      <p style="color:#9aa0aa">crossOriginIsolated (multi-thread do sherpa): <b>${isolated}</b></p>
    </main>`;
}

const root = document.querySelector<HTMLDivElement>('#app');
if (root) mount(root);
