import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VueDataRecieverTest',
  inject: {
    path: {
      from: 'parentPath',
      default: undefined,
    },
    module: {
      from: 'parentModule',
      default: undefined,
    },
    viewStateKey: {
      from: 'parentViewStateKey',
      default: undefined,
    },
    dataKey: {
      from: 'parentDataKey',
      default: undefined,
    },
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    dataId() {
      return (
        (this.module ? `${this.module}.` : '') +
        (this.dataKey ? `${this.dataKey}.` : '') +
        (this.path ? `${this.path}.` : '') +
        this.id
      );
    },
    viewStateId() {
      return (
        (this.module ? `${this.module}.` : '') +
        (this.viewStateKey ? `${this.viewStateKey}.` : '') +
        (this.path ? `${this.path}.` : '') +
        this.id
      );
    },
    storeData() {
      return this.getStoreValue(this.$store.state, this.dataId.split('.'));
    },
    storeViewState() {
      return this.getStoreValue(this.$store.state, this.viewStateId.split('.'));
    },
  },
  methods: {
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
});
