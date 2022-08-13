import { defineComponent } from 'vue';
import StoreValueMethodMixins from './StoreValueMethodMixins';
import { ItemViewState } from '../store/index';

// FIXME オブジェクトに変更する
export interface DataBinderInfo {
  readonly path?: string;
  readonly module?: string;
  readonly viewStateKey: string;
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

    console.log(parentDataBindInfo);
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
  },
  computed: {
    currentPath() {
      const info = this.dataBindInfo as DataBinderInfo;
      console.log((info.path ? `${info.path}.` : '') + this.path);
      return (info.path ? `${info.path}.` : '') + this.path;
    },
    currentModule() {
      const info = this.dataBindInfo as DataBinderInfo;
      return this.module ?? info.module;
    },
    currentViewStateKey() {
      const info = this.dataBindInfo as DataBinderInfo;
      return this.viewStateKey ?? info.viewStateKey;
    },
    currentDataKey() {
      const info = this.dataBindInfo as DataBinderInfo;
      return this.dataKey ?? info.dataKey;
    },
    currentViewState(): ItemViewState {
      const info = this.dataBindInfo as DataBinderInfo;
      const currentViewState = this.storeViewState as ItemViewState;
      return {
        // プロパティ優先順位： 自プロパティ > 親プロパティ > デフォルト
        // disabled プロパティ
        disabled:
          currentViewState?.disabled ?? info.viewState?.disabled ?? false,
        // TODO 他の状態があればここを修正する
      };
    },
    viewStatePath() {
      return (
        (this.currentViewStateKey ? `${this.currentViewStateKey}.` : '') +
        this.currentPath
      );
    },
    moduledViewStatePath() {
      return (
        (this.currentModule ? `${this.currentModule}.` : '') +
        this.viewStatePath
      );
    },
    storeViewState() {
      console.log(this.moduledViewStatePath);
      return this.getStoreValue(
        this.$store.state,
        this.moduledViewStatePath.split('.')
      );
    },
  },
});
