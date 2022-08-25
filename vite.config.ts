import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import tsconfigPaths from 'vite-tsconfig-paths';

// plugin説明
//   @vitejs/plugin-vue2 ⇒ vue2 vite 利用の為の plugin
//   vite-tsconfig-paths ⇒ ソースコードのalias解決(import hoge from '@/path/to/hoge' の "@" の解決）。vite.config.ts で resolve.alias を指定する方法もあるが、tsconfig.json の管理に統一する。

export default defineConfig({
  plugins: [vue(), tsconfigPaths()],
  // ライブラリモードなので、publicディレクトリは無効（設定されているとビルド時に dist へコピーされる）
  publicDir: false,
  // css: {
  //   devSourcemap: false,
  // },
  build: {
    // ライブラリモードでビルドする場合は、build.lib の設定を追加する
    lib: {
      // ライブラリエントリポイント
      entry: './src/vue-data-binder.ts',
      formats: ['es', 'cjs', 'umd' /*, 'iife' */],
      // ライブラリ名
      name: '@bizlink/vue-data-binder',
    },
    rollupOptions: {
      // ライブラリにバンドルされるべきではない依存関係を外部化する
      external: ['vue'],
      output: {
        // 外部化された依存関係のために UMD のビルドで使用するグローバル変数を提供します
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
