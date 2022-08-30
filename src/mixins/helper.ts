/** 空オブジェクト */
export const EMPTY_OBJECT = Object.freeze(Object.create(null));

/**
 * ViewState取得メソッド型
 *
 * @remarks
 * ViewStateを取得するメソッドの形式
 *
 * @typeParam S ViewStateデータ型
 * @retirms ViewStateインスタンス
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ViewStateデータは任意でどのような値でも指定可能な為、any を許容する
export type GetViewStateMethod = <S = any>() => S;

/**
 * データバインド情報
 */
export interface DataBinderInfo {
  /** データパス */
  dataPath: () => string | undefined;
  /** 画面状態パス */
  viewStatePath: () => string | undefined;
  // TODO type は any もしくは generics
  /** 親画面状態 */
  viewState: GetViewStateMethod;
}

/**
 * 空のデータバインド情報
 *
 * @remarks
 * - injectで利用する際のデフォルト値等で利用する
 * - 返却値
 *   - `dataPath, viewStatePath = undefined`
 *   - `viewState = ${{@link EMPTY_OBJECT}}
 *
 */
export const EMPTY_DATA_BIND_INFO: DataBinderInfo = Object.freeze({
  dataPath: () => undefined,
  viewStatePath: () => undefined,
  viewState: () => EMPTY_OBJECT,
});

/**
 * パス値決定（内部メソッド）
 *
 * @remarks
 * パス要素の値によって返却値を変える。
 *
 * - !== undefined： `${path} + '.'`
 * - === undefined: `''`
 *
 * @param path パス要素
 * @param isLast 最終要素であるか否か
 * @returns パス要素を解決した値
 */
const pathValueInner = (path: string | undefined): string => {
  return path ? `${path}.` : '';
};

/**
 * パス解決
 *
 * @remarks
 * {@link paths} 全てを `'.'` で連結した値を作成する。
 * {@link paths} の `undefined` は無視する。
 *
 * @example
 * 実行結果は以下の通り。
 *
 * ```ts
 * resolvePath('module', 'key', 'resolve.path', 'to') = 'module.key.resolve.path.to';
 * resolvePath('module', undefined, 'resolve.path', 'to') = 'module.resolve.path.to';
 * resolvePath(undefined, 'key', 'resolve.path', 'to') = 'key.resolve.path.to';
 * resolvePath(undefined, undefined, 'resolve.path', 'to') = 'resolve.path.to';
 * resolvePath(undefined, undefined, undefined, undefined) = '';
 * ```
 *
 * @param paths パス要素配列
 * @returns パス
 */
export const resolvePath = (...paths: (string | undefined)[]): string => {
  const resolved = paths.reduce((prev, path) => `${prev}${pathValueInner(path)}`, '') as string;
  // パスが設定されていた場合、最後の '.' を除去する
  return resolved.length > 0 ? resolved.substring(0, resolved.length - 1) : resolved;
};
