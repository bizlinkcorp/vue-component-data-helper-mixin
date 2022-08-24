import { defineComponent } from 'vue';
import StoreValueMethodMixins from './StoreValueMethodMixin';
import { DataBinderInfo, PROVIDE_DATA_BIND_INFO_NAME } from './StorePathMixin';
import { EMPTY_OBJECT } from '../const/share';
import { ItemViewState } from '../store/export';

const EMPTY_DATA_BIND_INFO = EMPTY_OBJECT;

export default defineComponent({
  name: 'StoreBindMixin',
  mixins: [StoreValueMethodMixins],
  inject: {
    dataBindInfo: {
      from: PROVIDE_DATA_BIND_INFO_NAME,
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
    pathItemId() {
      return (this.parentInfo.path ? `${this.parentInfo.path}.` : '') + this.itemId;
    },
    dataId() {
      return (this.parentInfo.dataKey ? `${this.parentInfo.dataKey}.` : '') + this.pathItemId;
    },
    moduledDataId() {
      return (this.parentInfo.module ? `${this.parentInfo.module}.` : '') + this.dataId;
    },
    viewStateId() {
      return (this.parentInfo.viewStateKey ? `${this.parentInfo.viewStateKey}.` : '') + this.pathItemId;
    },
    moduledViewStateId() {
      return (this.parentInfo.module ? `${this.parentInfo.module}.` : '') + this.viewStateId;
    },
    storeData: {
      get() {
        return this.getStoreValue(this.$store.state, this.moduledDataId.split('.'));
      },
      set(newVal: unknown) {
        // FIXME store mutation メソッド名がリテラル
        const commitTargetName = 'setStoreState';
        this.$store.commit(commitTargetName, {
          key: this.moduledDataId,
          value: newVal,
        });
      },
    },
    storeViewState(): ItemViewState {
      // 設定優先順位： 自ViewState > 親ViewState > デフォルト
      const itemViewState = this.getStoreValue(this.$store.state, this.moduledViewStateId.split('.')) as ItemViewState;
      return {
        disabled: itemViewState?.disabled ?? this.parentInfo.viewState?.disabled ?? false,
        readonly: itemViewState?.readonly ?? this.parentInfo.viewState?.readonly ?? false,
      };
    },
  },
});
