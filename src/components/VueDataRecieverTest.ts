import { defineComponent } from 'vue';
import StoreValueMethodMixins from './StoreValueMethodMixins';
import { ItemViewState } from '../store/index';
import { DataBinderInfo } from './VueDataBinderTest';
import { EMPTY_OBJECT } from './share';

const EMPTY_DATA_BIND_INFO = EMPTY_OBJECT;

export default defineComponent({
  name: 'VueDataRecieverTest',
  mixins: [StoreValueMethodMixins],
  inject: {
    dataBindInfo: {
      from: 'parentDataBindInfo',
      default: () => EMPTY_DATA_BIND_INFO,
    },
  },
  props: {
    itemId: {
      type: String,
      required: true,
    },
  },
  computed: {
    parentInfo() {
      return this.dataBindInfo as DataBinderInfo;
    },
    dataId() {
      return (
        (this.parentInfo.dataKey ? `${this.parentInfo.dataKey}.` : '') +
        (this.parentInfo.path ? `${this.parentInfo.path}.` : '') +
        this.itemId
      );
    },
    moduledDataId() {
      return (this.parentInfo.module ? `${this.parentInfo.module}.` : '') + this.dataId;
    },
    viewStateId() {
      return (
        (this.parentInfo.viewStateKey ? `${this.parentInfo.viewStateKey}.` : '') +
        (this.parentInfo.path ? `${this.parentInfo.path}.` : '') +
        this.itemId
      );
    },
    moduledViewStateId() {
      return (this.parentInfo.module ? `${this.parentInfo.module}.` : '') + this.viewStateId;
    },
    storeData: {
      get() {
        return this.getStoreValue(this.$store.state, this.moduledDataId.split('.'));
      },
      set(newVal: any) {
        // FIXME store mutation メソッド名がリテラル
        const commitTargetName = (this.parentInfo.module ? `${this.parentInfo.module}/` : '') + 'setStoreState';
        this.$store.commit(commitTargetName, {
          key: this.dataId,
          value: newVal,
        });
      },
    },
    storeViewState(): ItemViewState {
      // 設定優先順位： 自ViewState > 親ViewState > デフォルト
      const itemViewState = this.getStoreValue(this.$store.state, this.moduledViewStateId.split('.')) as ItemViewState;
      return {
        disabled: itemViewState?.disabled ?? this.parentInfo.viewState?.disabled ?? false,
      };
    },
  },
});
