import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import AutoImport from 'unplugin-auto-import/vite';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [
      AutoImport({
        imports: ['vitest'],
        dts: true,
      }),
    ],
    test: {
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      environment: 'jsdom',
    },
  }),
);
