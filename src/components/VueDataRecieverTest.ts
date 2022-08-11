import { defineComponent } from 'vue';
import StoreValueMethodMixins from './StoreValueMethodMixins';
import { ItemViewState } from '../store/index';

export default defineComponent({
  name: 'VueDataRecieverTest',
  mixins: [StoreValueMethodMixins],
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
    parentViewState: {
      from: 'parentViewState',
      default: () => ({}),
    },
  },
  props: {
    itemId: {
      type: String,
      required: true,
    },
  },
  computed: {
    dataId() {
      return (
        (this.dataKey ? `${this.dataKey}.` : '') +
        (this.path ? `${this.path}.` : '') +
        this.itemId
      );
    },
    moduledDataId() {
      return (this.module ? `${this.module}.` : '') + this.dataId;
    },
    viewStateId() {
      return (
        (this.viewStateKey ? `${this.viewStateKey}.` : '') +
        (this.path ? `${this.path}.` : '') +
        this.itemId
      );
    },
    moduledViewStateId() {
      return (this.module ? `${this.module}.` : '') + this.viewStateId;
    },
    storeData: {
      get() {
        return this.getStoreValue(
          this.$store.state,
          this.moduledDataId.split('.')
        );
      },
      set(newVal: any) {
        const commitTargetName =
          (this.module ? `${this.module}/` : '') + 'setStoreState';
        this.$store.commit(commitTargetName, {
          key: this.dataId,
          value: newVal,
        });
      },
    },
    storeViewState(): ItemViewState {
      // プロパティ優先順位： 自プロパティ > 親プロパティ > デフォルト
      const itemViewState = this.getStoreValue(
        this.$store.state,
        this.moduledViewStateId.split('.')
      ) as ItemViewState;
      const parentViewState = this.parentViewState as ItemViewState;
      return {
        disabled: itemViewState?.disabled ?? parentViewState?.disabled ?? false,
      };
    },
  },
});
