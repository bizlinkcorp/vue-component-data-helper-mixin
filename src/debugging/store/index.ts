import Vue from 'vue';
import Vuex from 'vuex';
import type { ViewStateTree } from '../../store/StoreViewState';
import { setStoreState } from '../../store/StoreControl';

Vue.use(Vuex);

export default new Vuex.Store({
  state: () => ({
    data: {
      card1: {
        no: '1',
        detail: '説明',
        amount: 10000,
      },
    },
    viewState: {
      disabled: true,
      card1: {
        detail: {
          disabled: false,
        },
      },
    } as ViewStateTree,
  }),
  mutations: {
    setStoreState,
  },
  modules: {
    module1: {
      state: () => ({
        modData: {
          card2: {
            no: '100',
            detail: 'モジュール説明',
            amount: 5000,
          },
        },
        modViewState: {
          readonly: true,
          card2: {
            amount: { readonly: false },
          },
        } as ViewStateTree,
      }),
    },
  },
});
