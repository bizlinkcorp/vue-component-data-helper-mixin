import { defineConfig } from 'vitest/config';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vitest'],
      dts: true,
    }),
  ],
  test: {
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // TODO tsconfig.json から持ってくる方法ないか？
    alias: [{ find: '@', replacement: './src' }],
    environment: 'jsdom',
  },
});
