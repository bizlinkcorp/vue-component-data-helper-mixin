import { defineComponent } from 'vue';
import { getStoreValue, resolvePath } from './helper';
import { EMPTY_OBJECT } from '../const/share';
import { ItemViewState } from '../store/export';

/** provide情報キー */
export const PROVIDE_DATA_BIND_INFO_NAME = 'parentDataBindInfo';

/**
 * データバインド情報
 */
export interface DataBinderInfo {
  /** パス */
  readonly path: string;
  /** モジュール */
  readonly module?: string;
  /** ViewStateキー情報 */
  readonly viewStateKey?: string;
  /** データキー情報 */
  readonly dataKey?: string;
  /** 上位ViewState設定値 */
  readonly viewState: ItemViewState;
}

/** 空のデータバインド情報 */
const EMPTY_DATA_BIND_INFO = EMPTY_OBJECT;

interface StorePathMixinComputed {
  readonly isRootStorePath: boolean;
  readonly parentInfo: DataBinderInfo;
  readonly currentPath: string;
  readonly currentModule: string;
  readonly currentViewStateKey: string;
  readonly $store: { state: any };
}

const rootViewStatePath = (inst: StorePathMixinComputed) => {
  return resolvePath(inst.currentModule, inst.currentViewStateKey);
};
const currentViewStatePath = (inst: StorePathMixinComputed) => {
  return resolvePath(inst.currentModule, inst.currentViewStateKey, inst.currentPath);
};
const currentStoreViewState = (inst: StorePathMixinComputed): ItemViewState => {
  // TODO any化？
  return getStoreValue<ItemViewState>(inst.$store.state, currentViewStatePath(inst));
};
const parentStoreViewState = (inst: StorePathMixinComputed): ItemViewState => {
  if (inst.isRootStorePath) {
    // 自身がrootの場合は store から直接取得する。
    // TODO any化？
    const parentStore = getStoreValue<ItemViewState>(inst.$store.state, rootViewStatePath(inst));
    return { disabled: parentStore?.disabled, readonly: parentStore?.readonly };
  }
  return {
    disabled: inst.parentInfo.viewState?.disabled,
    readonly: inst.parentInfo.viewState?.readonly,
  };
};

/**
 * store path mixin
 *
 * @remarks
 * FIXME 説明を記載する
 * - 使用方法
 * - 副作用
 * - プロパティの変遷
 *
 * @example
 * FIXME 使用方法を記載する
 */
export default defineComponent({
  name: 'StorePathMixin',
  inject: {
    dataBindInfo: {
      from: PROVIDE_DATA_BIND_INFO_NAME,
      default: () => EMPTY_DATA_BIND_INFO,
    },
  },
  provide() {
    const pathFn = (): string => this.currentPath;
    const moduleFn = (): string | undefined => this.currentModule;
    const viewStateKeyFn = (): string => this.currentViewStateKey;
    const dataKeyFn = (): string => this.currentDataKey;
    const viewStateFn = (): ItemViewState => this.currentViewState;

    return {
      [PROVIDE_DATA_BIND_INFO_NAME]: {
        get path() {
          return pathFn();
        },
        get module() {
          return moduleFn();
        },
        get viewStateKey() {
          return viewStateKeyFn();
        },
        get dataKey() {
          return dataKeyFn();
        },
        get viewState() {
          return viewStateFn();
        },
      } as DataBinderInfo,
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
    isRootStorePath() {
      return this.inherit === undefined || !this.inherit;
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
        if (!this.isRootStorePath) {
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
      return resolvePath(this.parentInfo.path, this.propPath);
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
      const current = currentStoreViewState(this as unknown as StorePathMixinComputed);
      const parent = parentStoreViewState(this as unknown as StorePathMixinComputed);

      return {
        // 設定優先順位： 自ViewState > 親ViewState
        // disabled プロパティ
        disabled: current?.disabled ?? parent?.disabled,
        // readonly プロパティ
        readonly: current?.readonly ?? parent?.readonly,
      };
    },
  },
});
