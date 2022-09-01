/**
 * ViewState データ型
 *
 * @remarks
 *
 * - DataPathMixin, DataBindMixin で利用する Store に定義する viewState プロパティのデータ構造
 *
 * @example
 *
 * ```ts
 * import { ViewStateTree } from 'vue-data-binder';
 *
 * // アプリケーションで定義する画面状態を定義する
 *
 * export interface AppViewState {
 *   // 無効
 *   disabled?: boolean;
 *   // 読み取り専用
 *   readonly?: boolean;
 * }
 *
 * // アプリケーションで利用する ViewStateTree を定義する
 * export type AppViewStateTree = ViewStateTree<AppViewState>;
 *
 * export default new Vuex.Store({
 *   // 本項以降の説明で利用する state の値を設定する。
 *   state: () => ({
 *     // ...
 *     // viewState の定義
 *     viewState: {
 *       // viewState 全体 disabled
 *       disabled: true,
 *       case1: {
 *         // 個別項目
 *         detail: { disabled: false },
 *       },
 *       case2: {
 *         // case2 全体 disabled
 *         disabled: false,
 *       },
 *       case3: {
 *         // case3 全体 disabled
 *         disabled: false,
 *         // case3 全体 readonly
 *         readonly: true,
 *         // 個別項目
 *         amount: { readonly: false },
 *       },
 *     } as AppViewStateTree,
 *   }),
 *   // ...
 * });
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- 状態はどのような値でも指定可能なため any を許容する
export type ViewStateTree<S = any> = { [layerOrItemId: string]: S | ViewStateTree } | S;
