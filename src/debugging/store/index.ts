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
      card2: {
        no: '2',
        detail: '説明2',
        amount: 20000,
      },
    },
    viewState: {
      disabled: true,
      card1: {
        detail: {
          disabled: false,
        },
      },
      card2: {
        disabled: false,
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
          card11: {
            no: '100',
            detail: 'モジュール説明',
            amount: 5000,
          },
        },
        modViewState: {
          readonly: true,
          card11: {
            amount: { readonly: false },
          },
        } as ViewStateTree,
      }),
    },
  },
});
