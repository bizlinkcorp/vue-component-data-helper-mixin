import { defineComponent } from 'vue';
import StoreValueMethodMixins from './StoreValueMethodMixins';
import { ItemViewState } from '../store/index';
import { EMPTY_OBJECT } from './share';

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

const EMPTY_DATA_BIND_INFO = EMPTY_OBJECT;

export default defineComponent({
  name: 'VueDataBinderTest',
  mixins: [StoreValueMethodMixins],
  inject: {
    dataBindInfo: {
      from: 'parentDataBindInfo',
      default: () => EMPTY_DATA_BIND_INFO,
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
    isRootDataBinder() {
      return !this.inherit;
    },
    propPath() {
      const propPath = this.path ?? '';
      if (propPath.indexOf(':') >= 0) {
        return this.path.split(':')[1];
      }
      return this.path;
    },
    propPathModule() {
      const propPath = this.path ?? '';
      if (propPath.indexOf(':') >= 0) {
        if (!this.isRootDataBinder) {
          throw new Error(`ルートパスではないが、モジュールが設定されている ( path="${this.path}" )`);
        }
        return this.path.split(':')[0];
      }
      return undefined;
    },
    parentInfo() {
      // 継承設定がない場合は、空の親オブジェクトを返却する
      return (this.inherit ? this.dataBindInfo : EMPTY_DATA_BIND_INFO) as DataBinderInfo;
    },
    currentPath() {
      return (this.parentInfo.path ? `${this.parentInfo.path}.` : '') + this.propPath;
    },
    currentModule() {
      return this.propPathModule ?? this.parentInfo.module;
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
      };
    },
    rootViewStatePath() {
      return (
        (this.currentModule ? `${this.currentModule}` : '') +
        (this.currentViewStateKey ? `.${this.currentViewStateKey}` : '')
      );
    },
    currentViewStatePath() {
      return (
        (this.currentModule ? `${this.currentModule}.` : '') +
        (this.currentViewStateKey ? `${this.currentViewStateKey}.` : '') +
        this.currentPath
      );
    },
    currentStoreViewState(): ItemViewState {
      return this.getStoreValue(this.$store.state, this.currentViewStatePath.split('.'));
    },
    parentStoreViewState(): ItemViewState {
      if (this.isRootDataBinder) {
        // 自身がrootの場合は store から直接取得する。
        const parentStore = this.getStoreValue(this.$store.state, this.rootViewStatePath.split('.')) as ItemViewState;
        return { disabled: parentStore?.disabled };
      }
      return { disabled: this.parentInfo.viewState?.disabled };
    },
  },
});
