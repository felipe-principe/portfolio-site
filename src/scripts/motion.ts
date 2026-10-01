// Núcleo de movimento compartilhado por todas as páginas.
// Um único GSAP, um único Lenis; cada componente importa daqui.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);
// Sem arredondar valores em px: os traços que "se desenham" usam pathLength=1 e precisam de frações (0,37…).
gsap.defaults({ autoRound: false });

export { gsap, ScrollTrigger, SplitText };

export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
/** Layout empilhado (celular/tablet em pé): sem pin, animações rodam uma vez ao entrar. */
export const stacked = () => matchMedia('(max-width: 900px)').matches;

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (reduced || lenis) return lenis;
  lenis = new Lenis({ lerp: 0.1, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

/**
 * Padrão de entrada do site inteiro: sobe 24px e aparece, 0,7s, expo.out, 70ms entre itens, uma vez só.
 * Itens irmãos com data-reveal que entram juntos são escalonados.
 */
export function initReveals(root: ParentNode = document) {
  const items = [...root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal="manual"])')];
  if (reduced) { gsap.set(items, { opacity: 1 }); return; }
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: batch => gsap.fromTo(batch, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.07, overwrite: true }),
  });
}
