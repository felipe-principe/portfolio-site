// Case em destaque: os visuais do dashboard flutuam em camadas 3D e se encaixam com o scroll.
// Fase 1: a inclinação começa enquanto a seção sobe na tela.
// Fase 2: a seção fica fixa enquanto as peças se encaixam e as três legendas passam.
import { gsap, ScrollTrigger, reduced, stacked } from './motion';

const SHRINK = 0.78;  // escala do dashboard quando a legenda entra ao lado
const GAP = 56;       // respiro entre dashboard e legenda
// Até aqui a timeline roda enquanto a seção sobe na tela (só o começo da inclinação);
// o resto da montagem e as legendas acontecem com a seção fixa, para dar tempo de ver as peças se encaixando.
const PRE_PIN = 0.4;
const PIN_LENGTH = '+=240%';

export function initExplode(section: HTMLElement) {
  const $$ = <T extends Element>(sel: string) => [...section.querySelectorAll<T>(sel)];
  const stage = section.querySelector<HTMLElement>('[data-stage]')!;
  const plane = section.querySelector<HTMLElement>('[data-plane]')!;
  const shade = section.querySelector<HTMLElement>('[data-shade]')!;
  const caption = section.querySelector<HTMLElement>('[data-caption]')!;
  const side = section.querySelector<HTMLElement>('[data-side]')!;
  const sideCtas = section.querySelector<HTMLElement>('[data-side-ctas]')!;
  const layers = $$<HTMLElement>('[data-layer]');
  const edges = $$<HTMLElement>('[data-edge]');
  const spots = $$<HTMLElement>('[data-spot]');
  const caps = $$<HTMLElement>('[data-cap]');
  const progs = $$<HTMLElement>('[data-prog]');

  let capLeft = 0;
  function size() {
    const byW = stage.clientWidth;
    const byH = stacked() ? Infinity : (window.innerHeight - 380) * (1360 / 720);
    const pw = Math.max(280, Math.min(1120, byW, byH));
    plane.style.setProperty('--pw', pw + 'px');
    // dashboard encolhido + respiro + legenda, centralizados juntos no palco
    const cw = Math.min(420, byW - pw * SHRINK - GAP);
    capLeft = Math.max(0, (byW - (pw * SHRINK + GAP + cw)) / 2);
    side.style.setProperty('--cw', cw + 'px');
    side.style.right = capLeft + 'px';
  }
  size();
  const zScale = () => plane.offsetWidth / 1100;
  const shiftX = () => capLeft + (plane.offsetWidth * SHRINK) / 2 - stage.clientWidth / 2;

  if (reduced) {
    gsap.set(spots, { opacity: stacked() ? 1 : 0 });
    if (!stacked()) {
      gsap.set(plane, { scale: SHRINK, x: shiftX() });
      gsap.set([caption, sideCtas], { autoAlpha: 1 });
      gsap.set(caps.slice(1), { opacity: 0 });
      gsap.set(spots[0], { opacity: 1 });
      gsap.set(progs[0], { scaleX: 1 });
    }
    return;
  }

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
  tl.fromTo(plane, { rotateX: 54, rotateZ: -34, scale: 0.64, yPercent: 8 }, { rotateX: 0, rotateZ: 0, scale: 1, yPercent: 0, duration: 1 }, 0)
    .fromTo(layers, { z: (_: number, el: HTMLElement) => +el.dataset.z! * zScale() * 1.25 }, { z: 0, duration: 0.85, stagger: 0.015 }, 0.1)
    .fromTo(shade, { opacity: 0.72 }, { opacity: 0, duration: 0.6 }, 0.45)
    .fromTo(edges, { opacity: 1 }, { opacity: 0, duration: 0.25 }, 0.85);

  if (stacked()) {
    // Celular: sem prender a seção; a montagem roda sozinha quando o dashboard aparece.
    spots.forEach((sp, n) => tl.fromTo(sp, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' }, 1.1 + n * 0.15));
    ScrollTrigger.create({ trigger: plane, start: 'top 75%', once: true, onEnter: () => { tl.duration(2.4).play(); } });
    return;
  }

  // Desktop: dashboard encolhe para a esquerda e a legenda conta a história, um passo por vez.
  tl.to(plane, { scale: SHRINK, x: shiftX, duration: 0.45 }, 1.3)
    .fromTo(caption, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 1.55)
    .fromTo(sideCtas, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 1.6);
  caps.forEach((cap, n) => {
    const at = 1.6 + n * 0.7;
    tl.fromTo(cap, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, at)
      .fromTo(spots[n], { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' }, at)
      .fromTo(progs[n], { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'none' }, at);
    if (n > 0) {
      tl.fromTo(caps[n - 1], { opacity: 1, y: 0 }, { opacity: 0, y: -16, duration: 0.2, ease: 'power2.out', immediateRender: false }, at - 0.1)
        .fromTo(spots[n - 1], { opacity: 1 }, { opacity: 0, duration: 0.2, immediateRender: false }, at);
    }
  });
  tl.to({}, { duration: 0.25 }); // respiro com tudo montado antes de soltar a seção

  const enter = tl.tweenFromTo(0, PRE_PIN, { paused: true, ease: 'none' });
  const pinned = tl.tweenFromTo(PRE_PIN, tl.duration(), { paused: true, ease: 'none' });
  ScrollTrigger.create({ animation: enter, trigger: section, start: 'top 70%', end: 'top top', scrub: 0.6, invalidateOnRefresh: true });
  ScrollTrigger.create({ animation: pinned, trigger: section, start: 'top top', end: PIN_LENGTH, pin: true, scrub: 0.6, invalidateOnRefresh: true });

  let rt = 0;
  addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(() => { size(); tl.invalidate(); ScrollTrigger.refresh(); }, 150); });
}
