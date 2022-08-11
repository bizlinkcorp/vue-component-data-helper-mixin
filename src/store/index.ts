import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export interface ItemViewState {
  disabled?: boolean;
}

export type ViewStateTree =
  | { [itemIdOrLayer: string]: ItemViewState | ViewStateTree }
  | ItemViewState;

export interface StateSetPayload<T> {
  key: string;
  value: T;
}

// TODO このメソッドを export する。
const setStoreState = <T>(state: any, payload: StateSetPayload<T>): void => {
  const innerStateSetFn = (
    value: T,
    parentState: any,
    keys: string[],
    idx = 0
  ): void => {
    if (keys.length - 1 === idx) {
      // https://v2.vuejs.org/v2/guide/reactivity.html#For-Objects
      Vue.set(parentState, keys[idx], value);
    } else {
      if (!parentState[keys[idx]]) {
        // https://v2.vuejs.org/v2/guide/reactivity.html#For-Objects
        // undefined の場合にオブジェクト設定
        Vue.set(parentState, keys[idx], {});
      }

      innerStateSetFn(value, parentState[keys[idx]], keys, idx + 1);
    }
  };

  const keyArr = payload.key.split('.');
  innerStateSetFn(payload.value, state, keyArr);
};

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
        disabled: true,
        bbbb: {
          cccc: {
            id1: {
              disabled: false,
            },
          },
        },
      },
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
      },
      mutations: {
        setStoreState,
      },
    },
  },
});
