// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStoreValueInner = (parent: any, paths: string[], idx = 0): any => {
  const pathValue = parent[paths[idx]];
  const pathValueIsUndefined = !pathValue;

  if (idx === paths.length - 1 || pathValueIsUndefined) {
    // 最下層 もしくは、undefined
    return pathValue;
  }
  // インデックスをずらして再帰呼び出し
  return getStoreValueInner(pathValue, paths, idx + 1);
};

const getStoreValue = <T = any>(parent: any, path: string): T => {
  return getStoreValueInner(parent, path.split('.'));
};

/**
 * パス解決
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
const resolvePath = (...paths: (string | undefined)[]): string => {
  /**
   * パス値決定
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
  const pathValue = (path: string | undefined): string => {
    return path ? `${path}.` : '';
  };

  const resolved = paths.reduce((prev, path) => `${prev}${pathValue(path)}`, '') as string;
  // パスが設定されていた場合、最後の '.' を除去する
  return resolved.length > 0 ? resolved.substring(0, resolved.length - 1) : resolved;
};

export { getStoreValue, resolvePath };
