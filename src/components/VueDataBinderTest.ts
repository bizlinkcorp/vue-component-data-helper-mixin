import { defineComponent } from 'vue';
import StoreValueMethodMixins from './StoreValueMethodMixins';
import { ItemViewState } from '../store/index';

// FIXME オブジェクトに変更する
export interface DataBinderInfo {
  path?: string;
  module?: string;
  viewStateKey: string;
  dataKey?: string;
  viewState: ItemViewState;
}

// FIXME viewStateKey | dataKey はplugin利用時に決定する方が良い。
// FIXME module はルート状態のみ設定できるようにしたほうが良い。

export default defineComponent({
  name: 'VueDataBinderTest',
  mixins: [StoreValueMethodMixins],
  inject: {
    bindPath: {
      from: 'parentPath',
      default: undefined,
    },
    bindModule: {
      from: 'parentModule',
      default: undefined,
    },
    bindViewStateKey: {
      from: 'parentViewStateKey',
      default: undefined,
    },
    bindDataKey: {
      from: 'parentDataKey',
      default: undefined,
    },
    bindViewState: {
      from: 'parentViewState',
      default: () => ({}),
    },
  },
  provide() {
    // FIXME このままだとリアクティブに変更されないので、計算取得できるように変更すること。
    console.log(this.currentPath, this.currentModule, this.currentViewStateKey);
    return {
      parentPath: this.currentPath,
      parentModule: this.currentModule,
      parentViewStateKey: this.currentViewStateKey,
      parentDataKey: this.currentDataKey,
      parentViewState: this.currentViewState,
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
      return (this.bindPath ? `${this.bindPath}.` : '') + this.path;
    },
    currentModule() {
      return this.module ?? this.bindModule;
    },
    currentViewStateKey() {
      return this.viewStateKey ?? this.bindViewStateKey;
    },
    currentDataKey() {
      return this.dataKey ?? this.bindDataKey;
    },
    currentViewState(): ItemViewState {
      const currentViewState = this.storeViewState as ItemViewState;
      const bindViewState = this.bindViewState as ItemViewState;
      return {
        // プロパティ優先順位： 自プロパティ > 親プロパティ > デフォルト
        // disabled プロパティ
        disabled:
          currentViewState?.disabled ?? bindViewState?.disabled ?? false,
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
