import { defineComponent } from 'vue';
import { getStoreValue, resolvePath, EMPTY_OBJECT } from './helper';
import { ItemViewState } from '../store/StoreViewState';

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

/**
 * export default しているコンポーネントの computed メソッドの定義
 * 外部化したメソッドで、コンポーネントインスタンスの computed を参照するために定義。
 */
interface StorePathMixinComputed {
  readonly isRootStorePath: boolean;
  readonly parentInfo: DataBinderInfo;
  readonly currentPath: string;
  readonly currentModule: string;
  readonly currentViewStateKey: string;
  readonly $store: { state: any };
}

/**
 * viewState の root パスを取得する
 * root パスは `${inst.currentModule}.${inst.currentViewStateKey}` とする
 *
 * @param inst StorePathMixin
 * @returns viewState root パス文字列
 */
const rootViewStatePath = (inst: StorePathMixinComputed): string => {
  return resolvePath(inst.currentModule, inst.currentViewStateKey);
};

/**
 * 上位の viewState を取得する。
 * 上位の情報は inject で設定された情報を使用する。
 * 自身が root の StorePathMixin の場合は、inject 設定が無いため、root パスの viewState を取得する。
 *
 * @see {@link rootViewStatePath}
 * @param inst StorePathMixin
 * @returns 親 viewState 値
 */
const parentStoreViewState = (inst: StorePathMixinComputed): ItemViewState => {
  if (inst.isRootStorePath) {
    // 自身がrootの場合は store から直接取得する。
    const parentStore = getStoreValue<ItemViewState>(inst.$store.state, rootViewStatePath(inst));
    return { disabled: parentStore?.disabled, readonly: parentStore?.readonly };
  }
  return {
    disabled: inst.parentInfo.viewState?.disabled,
    readonly: inst.parentInfo.viewState?.readonly,
  };
};

/**
 * viewState の 現在パスを取得する
 * 現在パスは `${inst.currentModule}.${inst.currentViewStateKey}.${inst.currentPath}` とする
 * @param inst StorePathMixin
 * @returns viewState 現在パス文字列
 */
const currentViewStatePath = (inst: StorePathMixinComputed): string => {
  return resolvePath(inst.currentModule, inst.currentViewStateKey, inst.currentPath);
};

/**
 * 現在パスの viewState の値を取得する
 * @see {@link currentViewStatePath}
 * @see {@link ItemViewState}
 * @param inst StorePathMixin
 * @returns 現在パスの viewState 値
 */
const currentStoreViewState = (inst: StorePathMixinComputed): ItemViewState => {
  return getStoreValue<ItemViewState>(inst.$store.state, currentViewStatePath(inst));
};

/**
 * store path mixin
 *
 * @remarks
 * ## 効果
 * - Storeの使用したいデータのパスをコントロールする
 * - path 情報は、vue 機能の provide/inject を利用し、下位コンポーネントへ伝達する
 *
 * ## 使用方法
 * - パスを指定したいコンポーネントの mixin に組み込む
 * - 組み込むことで以下のプロパティを指定することができる
 *   - path
 *     - データパスを定義する
 *     - モジュール指定は ':' で先頭に記載可能。指定しない場合は root store を参照
 *     - inherit を指定しないパスで使用すること
 *   - viewStateKey
 *     - 画面状態のキーを定義する
 *   - dataKey
 *     - データキーを定義する
 *   - inherit
 *     - 上位の指定を引き継ぎ判定を行うか否かを指定する。（trueの場合に引き継ぐ）
 *
 * @example
 * ## コンポーネントへの組み込み方法
 *
 * ```html
 * <template>
 *   <div>
 *     <!-- implements template -->
 *   </div>
 * </template>
 * <script lang="ts">
 * import { defineComponent } from 'vue';
 * import { StorePathMixin } from 'vue-data-binder';
 *
 * export default defineComponent({
 *   name: 'SomePathComponent',
 *   mixins: [StorePathMixin], // mixins で本コンポーネントを指定する
 *   ...
 * })
 * </script>
 * ```
 *
 * ## コンポーネントの使用方法
 * ```html
 * <template>
 *   <some-path-component
 *     path="path.to"
 *     view-state-key="viewStateKey.viewStateTo"
 *     data-key="dataKey.dataTo"
 *   >
 *     <!-- store参照パス
 *       viewState = Store.state.viewStateKey.viewStateTo.path.to
 *       data = Store.state.dataKey.dataTo.path.to
 *     -->
 *     <some-path-component path="subPath" inherit>
 *       <!-- store参照パス (inherit を指定したため、上位のパスを引き継ぐ)
 *         viewState = Store.state.viewStateKey.viewStateTo.path.to.subPath
 *         data = Store.state.dataKey.dataTo.path.to.subPath
 *       -->
 *       ..... StoreBindMixin を実装したコンポーネントを定義する .....
 *     </some-path-component>
 *     <some-path-component
 *       path="moduleName:path.to"
 *       view-state-key="moduelViewStateKey"
 *       data-key="moduleDataKey"
 *     >
 *       <!-- store参照パス (inherit を指定しない為、上位の情報を引き継がない)
 *         viewState = Store.state.moduleName.moduelViewStateKey.path.to
 *         data = Store.state.moduleName.moduleDataKey.path.to
 *       -->
 *       ..... StoreBindMixin を実装したコンポーネントを定義する .....
 *     </some-path-component>
 *   </some-path-component>
 * </template>
 * ```
 *
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
