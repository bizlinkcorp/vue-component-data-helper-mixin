import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  // FIXME 実装確認用の確認ステート設定。後で削除する。
  state: {
    aaaa: {
      bbbb: {
        cccc: {
          id1: 'value1',
          id2: 'value2',
        },
      },
    },
    viewState: {
      aaaa: {
        bbbb: {
          cccc: {
            id1: {
              disabled: true,
            },
          },
        },
      },
    },
  },
  getters: {},
  mutations: {},
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
      },
    },
  },
});
