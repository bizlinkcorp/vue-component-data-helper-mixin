import Vue from 'vue';
import Vuex from 'vuex';
import type { ViewStateTree } from './StoreViewState';
import { setStoreState } from './StoreControl';

Vue.use(Vuex);

export default new Vuex.Store({
  // FIXME 実装確認用の確認ステート設定。後で削除する。
  state: {
    viewStateName: 'viewState',
    aaaa: {
      bbbb: {
        cccc: {
          id1: 'value1',
          id2: 'value2',
        },
      },
    },
    viewState: {
      disabled: true,
      aaaa: {
        bbbb: {
          cccc: {
            id1: {
              disabled: false,
            },
          },
        },
      },
    },
    viewState2: {
      disabled: false,
    },
  },
  getters: {},
  mutations: {
    setStoreState,
  },
  actions: {},
  modules: {
    moduleTest: {
      namespaced: true,
      state: {
        aaaa: {
          xxxx: {
            yyyy: {
              ida: 'value-a',
            },
          },
        },
        viewState: {} as ViewStateTree,
      },
      mutations: {
        // setStoreState,
      },
    },
  },
});
