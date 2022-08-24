import vue from '@vitejs/plugin-vue2';
import tsconfigPaths from 'vite-tsconfig-paths';

import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue(), tsconfigPaths()],
  publicDir: false,
  // css: {
  //   devSourcemap: false,
  // },
  build: {
    lib: {
      entry: './src/vue-data-binder.ts',
      formats: ['es', 'cjs', 'umd' /*, 'iife' */],
      name: '@bizlink/vue-data-binder',
    },
    rollupOptions: {
      // ライブラリにバンドルされるべきではない依存関係を
      // 外部化するようにします
      external: ['vue'],
      output: {
        // 外部化された依存関係のために UMD のビルドで使用する
        // グローバル変数を提供します
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
