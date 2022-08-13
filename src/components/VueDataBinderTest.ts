import { defineComponent } from 'vue';
import StoreValueMethodMixins from './StoreValueMethodMixins';
import { ItemViewState } from '../store/index';

/**
 * データバインド情報
 */
export interface DataBinderInfo {
  readonly path?: string;
  readonly module?: string;
  readonly viewStateKey?: string;
  readonly dataKey?: string;
  readonly viewState: ItemViewState;
}

// FIXME viewStateKey | dataKey はplugin利用時に決定する方が良い。

export default defineComponent({
  name: 'VueDataBinderTest',
  mixins: [StoreValueMethodMixins],
  inject: {
    dataBindInfo: {
      from: 'parentDataBindInfo',
      default: () => ({}),
    },
  },
  provide() {
    const path = () => this.currentPath;
    const module = () => this.currentModule;
    const viewStateKey = () => this.currentViewStateKey;
    const dataKey = () => this.dataKey;
    const viewState = () => this.currentViewState;

    const parentDataBindInfo: DataBinderInfo = {
      get path() {
        return path();
      },
      get module() {
        return module();
      },
      get viewStateKey() {
        return viewStateKey();
      },
      get dataKey() {
        return dataKey();
      },
      get viewState() {
        return viewState();
      },
    };

    return {
      parentDataBindInfo,
    };
  },
  props: {
    path: {
      type: String,
      required: false,
      default: undefined,
    },
    module: {
      type: String,
      required: false,
      default: undefined,
    },
    viewStateKey: {
      type: String,
      required: false,
      default: undefined,
    },
    dataKey: {
      type: String,
      required: false,
      default: undefined,
    },
    inherit: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    parentInfo() {
      return this.dataBindInfo as DataBinderInfo;
    },
    currentPath() {
      return (this.parentInfo.path ? `${this.parentInfo.path}.` : '') + this.path;
    },
    currentModule() {
      return this.module ?? this.parentInfo.module;
    },
    currentViewStateKey() {
      return this.viewStateKey ?? this.parentInfo.viewStateKey;
    },
    currentDataKey() {
      return this.dataKey ?? this.parentInfo.dataKey;
    },
    currentViewState(): ItemViewState {
      return {
        // 設定優先順位： 自ViewState > 親ViewState
        // disabled プロパティ
        disabled: this.currentStoreViewState?.disabled ?? this.parentStoreViewState?.disabled,
        // TODO 他の状態があればここを修正する
      };
    },
    parentViewStatePath() {
      return (
        (this.currentModule ? `${this.currentModule}.` : '') +
        (this.currentViewStateKey ? `${this.currentViewStateKey}` : '') +
        (this.parentInfo.path ? `.${this.parentInfo.path}` : '')
      );
    },
    currentViewStatePath() {
      return (
        (this.currentModule ? `${this.currentModule}.` : '') +
        (this.currentViewStateKey ? `${this.currentViewStateKey}.` : '') +
        this.currentPath
      );
    },
    currentStoreViewState() {
      return this.getStoreValue(this.$store.state, this.currentViewStatePath.split('.'));
    },
    parentStoreViewState() {
      // 自身がrootの場合に親のViewStateが存在しないケースがあるので、存在していない場合は使用する。
      const parentStore = this.getStoreValue(this.$store.state, this.parentViewStatePath.split('.')) as ItemViewState;

      return {
        disabled: this.parentInfo.viewState?.disabled ?? parentStore?.disabled,
        // TODO 他の状態があればここを修正する
      };
    },
  },
});
