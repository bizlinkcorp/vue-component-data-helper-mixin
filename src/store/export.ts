import Vue from 'vue';

export interface ItemViewState {
  disabled?: boolean;
}

export type ViewStateTree = { [itemIdOrLayer: string]: ItemViewState | ViewStateTree } | ItemViewState;

export interface StateSetPayload<T> {
  key: string;
  value: T;
}

export const setStoreState = <T>(state: unknown, payload: StateSetPayload<T>): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const innerStateSetFn = (value: T, parentState: any, keys: string[], idx = 0): void => {
    if (keys.length - 1 === idx) {
      // https://v2.vuejs.org/v2/guide/reactivity.html#For-Objects
      Vue.set(parentState, keys[idx], value);
    } else {
      if (!parentState[keys[idx]]) {
        // undefined の場合にオブジェクト設定
        // https://v2.vuejs.org/v2/guide/reactivity.html#For-Objects
        Vue.set(parentState, keys[idx], {});
      }

      // 再帰call
      innerStateSetFn(value, parentState[keys[idx]], keys, idx + 1);
    }
  };

  const keyArr = payload.key.split('.');
  innerStateSetFn(payload.value, state, keyArr);
};
