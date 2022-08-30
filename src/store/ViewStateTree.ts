/**
 * ViewState データ型
 *
 * @remarks
 *
 * - Store state の ViewState プロパティのデータ構造
 * - 利用例は [README.md](../../README.md) の `Store 設定` を参照
 *
 * @example
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- 状態はどのような値でも指定可能なため any を許容する
export type ViewStateTree<S = any> = { [layerOrItemId: string]: S | ViewStateTree } | S;
