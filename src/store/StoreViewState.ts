/**
 * 項目ViewState
 *
 * @remarks
 * 項目の状態オブジェクト
 *
 * - disabled
 *   - 有効無効の状態を管理
 *   - 未設定の場合は false となる
 * - readonly
 *   - 読み取り専用の状態を管理
 *   - 未設定の場合は false となる
 */
export interface ItemViewState {
  /** 有効無効の状態 */
  disabled?: boolean;
  /** 読み取り専用の状態 */
  readonly?: boolean;
}

/**
 * ViewStateのtree
 *
 * @remarks
 * FIXME 使用方法を記載する
 * @example
 * FIXME 設定例を実装する
 */
export type ViewStateTree = { [itemIdOrLayer: string]: ItemViewState | ViewStateTree } | ItemViewState;
