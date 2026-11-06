// Vanta.js type declarations
declare module 'vanta/dist/vanta.net.min.js' {
  interface VantaEffect {
    destroy: () => void;
    resize: () => void;
  }
  interface VantaNetOptions {
    el: HTMLElement | null;
    THREE?: unknown;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number;
    backgroundColor?: number;
    points?: number;
    maxDistance?: number;
    spacing?: number;
    showDots?: boolean;
  }
  const NET: (options: VantaNetOptions) => VantaEffect;
  export default NET;
}
