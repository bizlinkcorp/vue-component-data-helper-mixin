import { defineComponent } from 'vue';
import { getStoreValue, resolvePath } from './helper';
import { DataBinderInfo, PROVIDE_DATA_BIND_INFO_NAME } from './StorePathMixin';
import { EMPTY_OBJECT } from '../const/share';
import { ItemViewState } from '../store/export';

const EMPTY_DATA_BIND_INFO = EMPTY_OBJECT;

/**
 * store value bind mixin
 *
 * @remarks
 * FIXME 説明を記載する
 * - 使用方法
 * - プロパティ設定値
 *
 * @example
 * FIXME 使用方法を記載する
 */
export default defineComponent({
  name: 'StoreBindMixin',
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
    dataId() {
      return resolvePath(this.parentInfo.module, this.parentInfo.dataKey, this.parentInfo.path, this.itemId);
    },
    viewStateId() {
      return resolvePath(this.parentInfo.module, this.parentInfo.viewStateKey, this.parentInfo.path, this.itemId);
    },
    storeData: {
      get() {
        // TODO any化？
        return getStoreValue((this.$store as any).state, this.dataId);
      },
      set(newVal: unknown) {
        // FIXME store mutation メソッド名がリテラル
        const commitTargetName = 'setStoreState';
        // TODO any化？
        (this.$store as any).commit(commitTargetName, {
          key: this.dataId,
          value: newVal,
        });
      },
    },
    storeViewState(): ItemViewState {
      // 設定優先順位： 自ViewState > 親ViewState > デフォルト
      // TODO any化？
      const itemViewState = getStoreValue<ItemViewState>((this.$store as any).state, this.viewStateId);
      return {
        disabled: itemViewState?.disabled ?? this.parentInfo.viewState?.disabled ?? false,
        readonly: itemViewState?.readonly ?? this.parentInfo.viewState?.readonly ?? false,
      };
    },
  },
});
