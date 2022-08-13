import { defineComponent } from 'vue';
import StoreValueMethodMixins from './StoreValueMethodMixins';
import { ItemViewState } from '../store/index';
import { DataBinderInfo } from './VueDataBinderTest';

export default defineComponent({
  name: 'VueDataRecieverTest',
  mixins: [StoreValueMethodMixins],
  inject: {
    dataBindInfo: {
      from: 'parentDataBindInfo',
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
      const info = this.dataBindInfo as DataBinderInfo;
      return (info.dataKey ? `${info.dataKey}.` : '') + (info.path ? `${info.path}.` : '') + this.itemId;
    },
    moduledDataId() {
      const info = this.dataBindInfo as DataBinderInfo;
      console.log(this.dataId);
      return (info.module ? `${info.module}.` : '') + this.dataId;
    },
    viewStateId() {
      const info = this.dataBindInfo as DataBinderInfo;
      return (info.viewStateKey ? `${info.viewStateKey}.` : '') + (info.path ? `${info.path}.` : '') + this.itemId;
    },
    moduledViewStateId() {
      const info = this.dataBindInfo as DataBinderInfo;
      return (info.module ? `${info.module}.` : '') + this.viewStateId;
    },
    storeData: {
      get() {
        return this.getStoreValue(this.$store.state, this.moduledDataId.split('.'));
      },
      set(newVal: any) {
        const info = this.dataBindInfo as DataBinderInfo;
        const commitTargetName = (info.module ? `${info.module}/` : '') + 'setStoreState';
        this.$store.commit(commitTargetName, {
          key: this.dataId,
          value: newVal,
        });
      },
    },
    storeViewState(): ItemViewState {
      // プロパティ優先順位： 自プロパティ > 親プロパティ > デフォルト
      const itemViewState = this.getStoreValue(this.$store.state, this.moduledViewStateId.split('.')) as ItemViewState;
      const info = this.dataBindInfo as DataBinderInfo;
      return {
        disabled: itemViewState?.disabled ?? info.viewState?.disabled ?? false,
      };
    },
  },
});
