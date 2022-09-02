import Vue from 'vue';

/**
 * ストア設定ペイロード
 * @see {@link setStoreState}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- stateの値はなんでも設定ができるため any を許容する
export interface StateSetPayload<T = any> {
  /** Store state パス */
  path: string;
  /** Store state パスに設定する値 */
  value: T;
}

/**
 * パス情報を配列に変換する
 *
 * @remarks
 *
 * - StorePathMixin で設定される dataPath, viewStatePath のパス文字列を配列に変換する。
 * - 最初に見つかった `:` までの位置をモジュールとして扱う。複数存在した場合そのまま使用する
 *
 * @example
 * 実行結果例
 *
 * ```ts
 * pathToArrayInner('path.to') = ['path', 'to'];
 * pathToArrayInner('moduleName:path.to') = ['moduleName', 'path', 'to'];
 * pathToArrayInner('moduleName:path:hoge.to') = ['moduleName', 'path:hoge', 'to'];
 * ```
 *
 * @param path dataPath, viewStatePath で指定されたパス要素
 * @returns パス要素を `.` , `:` で分割した配列
 */
const pathToArrayInner = (path: string): string[] => {
  // モジュール位置確認
  const moduleCharIdx = path.indexOf(':');
  if (moduleCharIdx >= 0) {
    // パス指定パターン（コロン有り） ⇒ module1:path.to
    // モジュールが見つかった場合
    const module = path.substring(0, moduleCharIdx);
    // module を配列の先頭に付与
    return [module, ...path.substring(moduleCharIdx + 1).split('.')];
  }
  // パス指定パターン（コロン無し） ⇒ path.to
  // モジュールがない場合
  return path.split('.');
};

/**
 * store state 値取得（内部用）
 *
 * @param parentState 親のストア値
 * @param paths 取得パスを '.' で split した値
 * @param idx ストア参照インデックス
 * @returns パスの値
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Stateの値は指定不可能なので any を許容する
const getStoreStateInner = (parentState: any, paths: string[], idx = 0): any => {
  const pathValue = parentState[paths[idx]];
  const pathValueIsUndefined = !pathValue;

  if (idx === paths.length - 1 || pathValueIsUndefined) {
    // 最下層 もしくは、undefined
    return pathValue;
  }
  // インデックスをずらして再帰呼び出し
  return getStoreStateInner(pathValue, paths, idx + 1);
};

/**
 * ストア値取得
 *
 * @example
 * ```ts
 * // store状態
 * store.state = {
 *   path: {
 *     to: {
 *       value: 'hoge',
 *     },
 *   },
 * };
 *
 * // 実行結果
 * getStoreValue(store, 'path') = { to: { value: 'hoge' }}
 * getStoreValue(store, 'path.to') = { value: 'hoge' }
 * getStoreValue(store, 'path.to.value') = 'hoge'
 * ```
 *
 * @param storeState ストア state そのもの
 * @param path state の取得パス (パス例： module:path.to)
 * @returns ストア state 値
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Stateの値は指定不可能なので any を許容する
export const getStoreState = <T = any>(storeState: any, path: string): T => {
  return getStoreStateInner(storeState, pathToArrayInner(path)) as T;
};

/**
 * Store state 値設定（内部利用）
 * @param value storeに設定する値
 * @param parentState paths idx に一致する store state 値
 * @param paths store state 参照パス配列
 * @param idx 現在参照している paths 位置
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setStoreStateInner = <T>(value: T, parentState: any, paths: string[], idx = 0): void => {
  if (paths.length - 1 === idx) {
    // https://v2.vuejs.org/v2/guide/reactivity.html#For-Objects
    Vue.set(parentState, paths[idx], value);
  } else {
    if (!parentState[paths[idx]]) {
      // undefined の場合にオブジェクト設定
      // https://v2.vuejs.org/v2/guide/reactivity.html#For-Objects
      Vue.set(parentState, paths[idx], {});
    }

    // 再帰call
    setStoreStateInner(value, parentState[paths[idx]], paths, idx + 1);
  }
};

/**
 * store state 値設定
 *
 * @remarks
 *
 * - Store mutation にメソッドを設定することを想定したメソッド。
 * - mutaion は、StoreBindMixin の storeData setter 計算プロパティから実行される。
 *
 * @example
 *
 * ```ts
 * import { setStoreState } from 'vue-state-binder';
 *
 * Vue.use(Vuex);
 *
 * export default new Vuex.Store({
 *   state: () => ({
 *     // ...
 *   }),
 *   mutations: {
 *     setStoreState, // mutation に設定する
 *   },
 * });
 *
 * ```
 *
 * @param state 設定対象のstateオブジェクト
 * @param payload パラメータ
 */
export const setStoreState = <T>(state: unknown, payload: StateSetPayload<T>): void => {
  setStoreStateInner(payload.value, state, pathToArrayInner(payload.path));
};
