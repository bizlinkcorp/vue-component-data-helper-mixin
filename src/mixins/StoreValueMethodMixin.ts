export default {
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getStoreValue(parent: any, paths: string[], idx = 0): any {
      const pathValue = parent[paths[idx]];
      const pathValueIsUndefined = !pathValue;

      if (idx === paths.length - 1 || pathValueIsUndefined) {
        // 最下層 もしくは、undefined
        return pathValue;
      }
      // インデックスをずらして再帰呼び出し
      return this.getStoreValue(pathValue, paths, idx + 1);
    },
  },
};
