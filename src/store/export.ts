import Vue from 'vue';
import { Store } from 'vuex';
export interface ItemViewState {
  disabled?: boolean;
}

export type ViewStateTree = { [itemIdOrLayer: string]: ItemViewState | ViewStateTree } | ItemViewState;

export interface StateSetPayload<T> {
  key: string;
  value: T;
}

// TODO このメソッドを export する。
export const setStoreState = <T>(state: any, payload: StateSetPayload<T>): void => {
  const innerStateSetFn = (value: T, parentState: any, keys: string[], idx = 0): void => {
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

export const plugin = (store: any) => {
  console.log(store);
  Vue.set(store._mutations, 'setStoreState', setStoreState);
  console.log(store);
};