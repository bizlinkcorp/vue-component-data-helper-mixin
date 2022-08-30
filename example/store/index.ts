import Vue from 'vue';
import Vuex from 'vuex';
import { setStoreState } from '@/store/StoreControl';
import { AppViewStateTree } from './ViewState';

Vue.use(Vuex);

export default new Vuex.Store({
  state: () => ({
    data: {
      card1: {
        no: '1',
        detail: '説明',
        amount: 10000,
      },
      card2: {
        no: '2',
        detail: '説明2',
        amount: 20000,
      },
    },
    viewState: {
      // viewState 全体 disabled
      disabled: true,
      card1: {
        // 個別項目
        detail: { disabled: false },
      },
      card2: {
        // card11 全体 disabled
        disabled: false,
      },
      card11: {
        // card11 全体 disabled
        disabled: false,
        // card11 全体 readonly
        readonly: true,
        // 個別項目
        amount: { readonly: false },
      },
    } as AppViewStateTree,
  }),
  mutations: {
    setStoreState,
  },
  modules: {
    module1: {
      state: () => ({
        modData: {
          card11: {
            no: '100',
            detail: 'モジュール説明',
            amount: 5000,
          },
        },
      }),
    },
  },
});
