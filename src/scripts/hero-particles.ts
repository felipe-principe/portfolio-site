// Abertura da home: milhares de pontos flutuam soltos e se organizam no gráfico real de volume mensal.
// Canvas 2D (sem biblioteca 3D): ~7 mil pontos no desktop, ~2,6 mil no celular.
import { gsap, ScrollTrigger, SplitText, reduced, stacked } from './motion';

interface Payload {
  vol: number[]; sla: number[]; slaYear: number; months: string[]; loc: string;
  t: { calls: string; vsAvg: string };
}

const FLIGHT = 1.7; // s: voo de cada ponto até a coluna

export function initHero(hero: HTMLElement) {
  const d = JSON.parse(hero.dataset.hero!) as Payload;
  const VOL = d.vol;
  const TOTAL = VOL.reduce((a, b) => a + b, 0);
  const PEAK = VOL.indexOf(Math.max(...VOL));
  const AVG = TOTAL / 12;
  const fmt = (n: number) => Math.round(n).toLocaleString(d.loc);
  const pct = (n: number) => n.toLocaleString(d.loc, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const $ = <T extends Element>(sel: string) => hero.querySelector<T>(sel)!;
  const cv = $<HTMLCanvasElement>('canvas');
  const ctx = cv.getContext('2d')!;
  const plot = $<HTMLElement>('[data-plot]');
  const avgEl = $<HTMLElement>('[data-avg]');
  const noteEl = $<HTMLElement>('[data-note]');
  const tipEl = $<HTMLElement>('[data-tip]');
  const tipBody = $<HTMLElement>('[data-tip-body]');
  const countEl = $<HTMLElement>('[data-count]');
  const unitEl = $<HTMLElement>('[data-unit]');
  const monthSpans = [...$<HTMLElement>('[data-months]').children] as HTMLElement[];
  const title = $<HTMLElement>('.title');
  gsap.set(noteEl, { xPercent: -50 });

  let gatherAt = Infinity; // s no relógio da animação
  let W = 0, H = 0, N = 0;
  let geo: { step: number; dot: number; cell: number; colH: number[] } | null = null;
  let tx: Float32Array, ty: Float32Array, sx: Float32Array, sy: Float32Array;
  let seed: Float32Array, delay: Float32Array, curve: Float32Array, col: Uint8Array;
  let clock = 0, last = 0, running = false, visible = true;

  // Foco de coluna no hover: cada coluna tem um valor 0..1 que persegue o alvo.
  const focus = new Float32Array(12);
  let hoverCol = -1, hoverAmt = 0;

  const sprite = (() => {
    const s = document.createElement('canvas'); s.width = s.height = 64;
    const g = s.getContext('2d')!, r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, 'rgba(76,201,240,.9)'); r.addColorStop(.25, 'rgba(76,201,240,.35)'); r.addColorStop(1, 'rgba(76,201,240,0)');
    g.fillStyle = r; g.fillRect(0, 0, 64, 64); return s;
  })();

  function build() {
    const hr = hero.getBoundingClientRect(), pr = plot.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hr.width; H = hr.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const px = pr.left - hr.left, py = pr.top - hr.top, pw = pr.width, ph = pr.height;
    const target = W < 760 ? 2600 : 7000;
    const cell = pw / 12, colW = cell * 0.66, max = VOL[PEAK];

    // Menor passo de grade que mantém o total de pontos dentro do orçamento.
    let step = 2.5, k = 1, rows = 1, unit = 1;
    for (; step < 16; step += 0.25) {
      k = Math.max(1, Math.floor(colW / step));
      rows = Math.max(1, Math.floor((ph * 0.78) / step));
      unit = max / (k * rows);
      if (TOTAL / unit <= target) break;
    }
    const counts = VOL.map(v => Math.round(v / unit));
    N = counts.reduce((a, b) => a + b, 0);

    tx = new Float32Array(N); ty = new Float32Array(N); sx = new Float32Array(N); sy = new Float32Array(N);
    seed = new Float32Array(N); delay = new Float32Array(N); curve = new Float32Array(N); col = new Uint8Array(N);

    let i = 0;
    counts.forEach((n, c) => {
      const x0 = px + cell * (c + 0.5) - (k * step) / 2;
      for (let j = 0; j < n; j++, i++) {
        tx[i] = x0 + ((j % k) + 0.5) * step;
        ty[i] = py + ph - (Math.floor(j / k) + 0.5) * step;
        col[i] = c;
        sx[i] = Math.random() * W;
        sy[i] = Math.random() * H;
        seed[i] = Math.random() * 1000;
        delay[i] = c * 0.045 + Math.random() * 0.38;
        curve[i] = (Math.random() - 0.5) * 160;
      }
    });

    geo = { step, dot: Math.max(1.15, step * 0.52), cell, colH: counts.map(n => Math.ceil(n / k) * step) };
    unitEl.textContent = fmt(unit);
    avgEl.style.bottom = (AVG / (unit * k)) * step + 'px';
    const cx = cell * (PEAK + 0.5);
    noteEl.style.left = cx + 'px';
    noteEl.style.bottom = geo.colH[PEAK] + 10 + 'px';
    const half = noteEl.offsetWidth / 2;
    if (cx - half < 0) noteEl.style.left = half + 'px';
  }

  const easeInOut = (p: number) => (p < .5 ? 16 * p ** 5 : 1 - (-2 * p + 2) ** 5 / 2);
  const colPaths: Path2D[] = new Array(24);

  function draw(t: number, dt: number) {
    if (!geo) return;
    ctx.clearRect(0, 0, W, H);
    const dot = geo.dot;
    const fade = Math.min(1, t / 0.8);

    // Foco das colunas: aproximação exponencial (~150 ms para assentar).
    const kf = 1 - Math.exp(-(dt || 0.016) * 18);
    for (let c = 0; c < 12; c++) focus[c] += ((c === hoverCol ? 1 : 0) - focus[c]) * kf;
    hoverAmt += ((hoverCol >= 0 ? 1 : 0) - hoverAmt) * kf;

    // Brilho que varre as colunas de tempos em tempos (pausa durante o hover).
    const sweepT = (t - (gatherAt + 2.6)) % 7;
    const sweepX = hoverCol < 0 && sweepT >= 0 && sweepT < 1.4 ? (sweepT / 1.4) * (W + 200) - 100 : -9999;

    const amb = [new Path2D(), new Path2D(), new Path2D()];
    for (let c = 0; c < 24; c++) colPaths[c] = new Path2D();
    const shine = new Path2D();
    const glowPts: number[] = [];

    for (let i = 0; i < N; i++) {
      const s = seed[i];
      const ax = sx[i] + Math.sin(t * 0.33 + s) * 30 + Math.sin(t * 0.12 + s * 1.7) * 44;
      const ay = sy[i] + Math.cos(t * 0.28 + s * 1.3) * 26 + Math.sin(t * 0.09 + s) * 30;
      let p = (t - gatherAt - delay[i]) / FLIGHT;
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      const e = easeInOut(p);
      let x = ax + (tx[i] - ax) * e + Math.sin(p * Math.PI) * curve[i];
      let y = ay + (ty[i] - ay) * e;
      if (e === 1) { x += Math.sin(t * 1.1 + s) * 0.3; y += Math.cos(t * 0.9 + s) * 0.3; }

      if (e < 0.55) {
        const tw = Math.sin(t * 1.6 + s * 3);
        amb[tw > 0.5 ? 2 : tw > -0.3 ? 1 : 0].rect(x, y, dot, dot);
      } else if (Math.abs(x - sweepX) < 26) {
        shine.rect(x, y, dot, dot);
      } else {
        colPaths[col[i] * 2 + (Math.sin(s) > 0 ? 1 : 0)].rect(x, y, dot, dot);
        if (col[i] === PEAK && (i & 3) === 0) glowPts.push(x, y);
      }
    }

    ctx.globalAlpha = 0.28 * fade; ctx.fillStyle = '#9FB6D6'; ctx.fill(amb[0]);
    ctx.globalAlpha = 0.5 * fade; ctx.fill(amb[1]);
    ctx.globalAlpha = 0.85 * fade; ctx.fillStyle = '#CFE3F5'; ctx.fill(amb[2]);

    for (let c = 0; c < 12; c++) {
      const isPeak = c === PEAK;
      const dim = 1 - 0.7 * hoverAmt * (1 - focus[c]);
      ctx.fillStyle = isPeak ? '#4CC9F0' : '#2A9AC9';
      ctx.globalAlpha = (isPeak ? 0.85 : 0.55) * dim; ctx.fill(colPaths[c * 2]);
      ctx.globalAlpha = (isPeak ? 1 : 0.8) * dim; ctx.fill(colPaths[c * 2 + 1]);
      if (focus[c] > 0.01) {
        ctx.fillStyle = '#A8EBFF';
        ctx.globalAlpha = focus[c] * 0.9;
        ctx.fill(colPaths[c * 2]); ctx.fill(colPaths[c * 2 + 1]);
      }
    }
    ctx.globalAlpha = 1; ctx.fillStyle = '#EAF8FF'; ctx.fill(shine);

    if (glowPts.length) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = (0.16 + Math.sin(t * 1.8) * 0.05) * (1 - 0.8 * hoverAmt * (1 - focus[PEAK]));
      const g = geo.step * 7;
      for (let j = 0; j < glowPts.length; j += 2) ctx.drawImage(sprite, glowPts[j] - g / 2, glowPts[j + 1] - g / 2, g, g);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  function loop(now: number) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now; clock += dt;
    draw(clock, dt);
    requestAnimationFrame(loop);
  }
  function start() {
    if (running || reduced || !visible || document.hidden) return;
    running = true; last = performance.now(); requestAnimationFrame(loop);
  }
  const stop = () => { running = false; };

  // ---------- Hover de coluna (só com mouse, e só depois do gráfico montado) ----------
  function setHover(c: number) {
    if (c === hoverCol || !geo) return;
    hoverCol = c;
    monthSpans.forEach((s, i) => s.classList.toggle('is-on', i === c));
    noteEl.classList.toggle('is-hidden', c === PEAK);
    noteEl.classList.toggle('is-muted', c >= 0 && c !== PEAK);
    if (c < 0) {
      tipEl.classList.remove('is-on');
      if (reduced) { focus.fill(0); hoverAmt = 0; draw(clock, 1); }
      return;
    }
    const diff = (VOL[c] / AVG - 1) * 100;
    const slaCls = d.sla[c] < d.slaYear - 2 ? 'down' : '';
    tipBody.innerHTML =
      `<span class="tm">${d.months[c]}/25</span> · <b>${fmt(VOL[c])}</b> ${d.t.calls}<br>` +
      `<span class="tk">${diff >= 0 ? '+' : ''}${pct(diff)}% ${d.t.vsAvg} · SLA </span><span class="${slaCls}">${pct(d.sla[c])}%</span>`;
    const w = tipEl.offsetWidth, pw = plot.clientWidth;
    const x = Math.max(0, Math.min(pw - w, geo.cell * (c + 0.5) - w / 2));
    tipEl.style.transform = `translate(${x}px, ${-(geo.colH[c] + 12)}px)`;
    tipEl.classList.add('is-on');
    if (reduced) { focus.fill(0); focus[c] = 1; hoverAmt = 1; draw(clock, 1); }
  }
  hero.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || !geo || clock < gatherAt + 2.4) return;
    const r = plot.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top - 20 && e.clientY <= r.bottom + 36;
    setHover(inside ? Math.min(11, Math.floor((e.clientX - r.left) / geo.cell)) : -1);
  });
  hero.addEventListener('pointerleave', () => setHover(-1));

  // ---------- Texto e sobreposições ----------
  const counter = { v: 0 };
  function playChart(wait: number) {
    gatherAt = clock + wait;
    gsap.timeline({ delay: wait })
      .fromTo(counter, { v: 0 }, { v: TOTAL, duration: 2.6, ease: 'power1.inOut', onUpdate: () => { countEl.textContent = fmt(counter.v); } }, 0)
      .fromTo(avgEl, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.9, ease: 'expo.out' }, 2.3)
      .fromTo(noteEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 2.55)
      .fromTo(noteEl.querySelector('.stem'), { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'expo.out' }, 2.6);
  }

  build();

  SplitText.create(title, {
    type: 'lines', mask: 'lines', autoSplit: true,
    onSplit(self) {
      gsap.set(title, { visibility: 'visible' });
      if (reduced) return;
      return gsap.from(self.lines, { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.09, delay: 0.1 });
    },
  });

  if (reduced) {
    gatherAt = -99; clock = 99; draw(clock, 1);
  } else {
    countEl.textContent = '0';
    gsap.set([avgEl, noteEl], { opacity: 0 });
    // Desktop: o gráfico se monta na abertura. Celular: quando entra na tela.
    if (stacked()) ScrollTrigger.create({ trigger: plot, start: 'top 70%', once: true, onEnter: () => playChart(0.1) });
    else playChart(0.9);
    start();

    // Saída do hero ao rolar. Só opacidade no gráfico: mover canvas e rótulos separadamente desalinharia as barras.
    gsap.to(hero.querySelector('[data-copy]'), { y: -80, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to([cv, hero.querySelector('.chart')], { opacity: 0.35, ease: 'none', scrollTrigger: { trigger: hero, start: 'center top', end: 'bottom top', scrub: true } });
  }

  let rt = 0;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = window.setTimeout(() => { build(); if (reduced || !running) draw(clock, 1); }, 150);
  });
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? start() : stop(); }).observe(hero);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
}
