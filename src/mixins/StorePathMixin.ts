import { defineComponent } from 'vue';
import StoreValueMethodMixins from './StoreValueMethodMixin';
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

export default defineComponent({
  name: 'StorePathMixin',
  mixins: [StoreValueMethodMixins],
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
    const viewStateFn = () => this.currentViewState;

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
    isRootDataBinder() {
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
        // readonly プロパティ
        readonly: this.currentStoreViewState?.readonly ?? this.parentStoreViewState?.readonly,
      };
    },
    rootViewStatePath() {
      return (
        (this.currentModule ?? '') +
        (!!this.currentModule && !!this.currentViewStateKey ? '.' : '') +
        (this.currentViewStateKey ?? '')
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
      // TODO any化？
      return this.getStoreValue((this.$store as any).state, this.currentViewStatePath.split('.'));
    },
    parentStoreViewState(): ItemViewState {
      if (this.isRootDataBinder) {
        // 自身がrootの場合は store から直接取得する。
        // TODO any化？
        const parentStore = this.getStoreValue(
          (this.$store as any).state,
          this.rootViewStatePath.split('.'),
        ) as ItemViewState;
        return { disabled: parentStore?.disabled, readonly: parentStore?.readonly };
      }
      return {
        disabled: this.parentInfo.viewState?.disabled,
        readonly: this.parentInfo.viewState?.readonly,
      };
    },
  },
});
