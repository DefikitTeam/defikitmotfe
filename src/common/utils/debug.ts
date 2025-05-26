// import { isDev } from '../web3/constants/env';

export const initEruda = () => {
  if (typeof window !== 'undefined') {
    import('eruda').then((module) => {
      const eruda = module.default;
      eruda.init({
        tool: ['console', 'elements', 'network', 'resources', 'info'],
        useShadowDom: true,
        autoScale: true,
        defaults: {
          displaySize: 70,
          transparency: 0.9,
          theme: 'Dark'
        }
      });
    });
  }
};
