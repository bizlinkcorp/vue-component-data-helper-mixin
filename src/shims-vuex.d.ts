// vuex-shim.d.ts
// https://vuex.vuejs.org/ja/guide/migrating-to-4-0-from-3-x.html#typescript-%E3%82%B5%E3%83%9D%E3%83%BC%E3%83%88

import { Store } from 'vuex';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Storeの値は未定
    $store: Store<any>;
  }
}
