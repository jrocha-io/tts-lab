// Composition root — instantiate the concrete adapters and inject them into the section controllers.
// Stage 3a: Section 1 (fallback) wired with the WebSpeechEngine. eSpeak, sherpa and WebGPU land next.

import { WebSpeechEngine, platformSpeechApi, type Lang } from '@jrocha-io/tts';
import { DomLogger, type Logger } from '@jrocha-io/logging';
import { createTaskTable } from './ui/task-table.js';
import './style.css';

const LANGS: readonly Lang[] = ['pt', 'en', 'es'];

function el<K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> = {}): HTMLElementTagNameMap[K] {
  return Object.assign(document.createElement(tag), props);
}

function boot(root: HTMLElement): void {
  root.textContent = '';

  const h1 = el('h1');
  h1.innerHTML = 'TTS Lab <span class="mut">— fallback · sherpa · WebGPU</span>';
  const sub = el('p', { className: 'sub', textContent: 'Bancada de comparação de TTS. Rodada 3a: Seção 1 (fallback) ligada por injeção de dependência sobre @jrocha-io/*.' });

  // Shared speed slider (all sections read it).
  const rate = el('input', { type: 'range', min: '0.5', max: '1.3', step: '0.05', value: '0.9' });
  const rateVal = el('span', { className: 'mut', textContent: '0.90×' });
  rate.addEventListener('input', () => (rateVal.textContent = `${Number(rate.value).toFixed(2)}×`));
  const getRate = (): number => Number(rate.value);

  // On-page log.
  const logEl = el('pre', { id: 'log' });
  const logger: Logger = new DomLogger(logEl);

  const section = buildFallbackSection(logger, getRate);

  const rateBar = el('div', { className: 'bar' });
  rateBar.append(el('label', { textContent: 'Velocidade ' }), rate, rateVal);

  root.append(h1, sub, section, rateBar, el('h2', { textContent: 'Log' }), logEl);
}

function buildFallbackSection(logger: Logger, getRate: () => number): HTMLElement {
  const section = el('section', { className: 'lab' });
  const h2 = el('h2', { className: 'sec' });
  h2.innerHTML = '1 · Web Speech <span class="mut">— fallback nativo do SO (eSpeak NG chega na próxima rodada)</span>';
  section.appendChild(h2);

  let engine: WebSpeechEngine | null = null;
  try {
    engine = new WebSpeechEngine(platformSpeechApi());
  } catch (err) {
    const warn = el('p', { className: 'warn', textContent: `Web Speech indisponível: ${(err as Error).message}` });
    section.appendChild(warn);
    return section;
  }

  const langSel = el('select');
  for (const l of LANGS) langSel.appendChild(el('option', { value: l, textContent: l }));
  const voiceSel = el('select');
  const getLang = (): Lang => langSel.value as Lang;
  const getVoiceId = (): string | undefined => voiceSel.value || undefined;

  const refreshVoices = (): void => {
    const voices = engine!.listVoices(getLang());
    voiceSel.textContent = '';
    voiceSel.appendChild(el('option', { value: '', textContent: '(padrão do SO)' }));
    for (const v of voices) voiceSel.appendChild(el('option', { value: v.id, textContent: v.label }));
  };

  const table = createTaskTable({ engine, logger, getLang, getVoiceId, getRate });
  langSel.addEventListener('change', () => {
    table.setLang(getLang());
    refreshVoices();
  });
  // Web Speech voices can arrive asynchronously.
  if (globalThis.speechSynthesis) globalThis.speechSynthesis.onvoiceschanged = refreshVoices;
  refreshVoices();

  const bar = el('div', { className: 'bar' });
  bar.append(el('label', { textContent: 'Idioma ' }), langSel, el('label', { textContent: 'Voz ' }), voiceSel);
  section.append(bar, table.el);
  logger.log('[boot] Seção 1 (Web Speech) pronta.');
  return section;
}

const app = document.querySelector<HTMLDivElement>('#app');
if (app) boot(app);
