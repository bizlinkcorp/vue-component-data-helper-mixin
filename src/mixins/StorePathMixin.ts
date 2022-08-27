import { defineComponent } from 'vue';
import { getStoreValue, resolvePath, EMPTY_OBJECT } from './helper';
import { ItemViewState } from '../store/StoreViewState';

/** provide情報キー */
export const PROVIDE_DATA_BIND_INFO_NAME = 'parentDataBindInfo';

/**
 * データバインド情報
 */
export interface DataBinderInfo {
  /** データパス */
  readonly dataPath?: string;
  /** 画面状態パス */
  readonly viewStatePath?: string;
  // TODO これはなくす方向になるかも
  /** 親画面状態 */
  readonly viewState: ItemViewState;
}

/** 空のデータバインド情報 */
const EMPTY_DATA_BIND_INFO = EMPTY_OBJECT;

// TODO コメントを書く
// ViewState 拡張ポイント
export type ProvideViewStateMethod = <T = any>() => T;

// /**
//  * export default しているコンポーネントの computed メソッドの定義
//  * 外部化したメソッドで、コンポーネントインスタンスの computed を参照するために定義。
//  */
// interface StorePathMixinComputed {
//   readonly parentInfo: DataBinderInfo;
//   readonly currentDataPath: string;
//   readonly currentViewStatePath: string;
//   readonly $store: { state: any };
// }

// /**
//  * viewState の root パスを取得する
//  * root パスは `${inst.currentModule}.${inst.currentViewStateKey}` とする
//  *
//  * @param inst StorePathMixin
//  * @returns viewState root パス文字列
//  */
// const rootViewStatePath = (inst: StorePathMixinComputed): string => {
//   return resolvePath(inst.currentModule, inst.currentViewStateKey);
// };

// /**
//  * 現在パスの viewState の値を取得する
//  * @see {@link currentViewStatePath}
//  * @see {@link ItemViewState}
//  * @param inst StorePathMixin
//  * @returns 現在パスの viewState 値
//  */
// const currentStoreViewState = (inst: StorePathMixinComputed): ItemViewState => {
//   return getStoreValue<ItemViewState>(inst.$store.state, currentViewStatePath(inst));
// };

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
 *   - dataPath
 *     - データパスを定義する
 *     - モジュール指定は ':' で先頭に記載可能。指定しない場合は root store を参照
 *     - inherit を指定しないパスで使用すること
 *   - viewStatePath
 *     - 画面状態のパスを定義する
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
 *     data-path="dataKey.dataTo.path.to"
 *     view-state-path="viewStateKey.viewStateTo.path.to"
 *   >
 *     <!-- store参照パス
 *       data = Store.state.dataKey.dataTo.path.to
 *       viewState = Store.state.viewStateKey.viewStateTo.path.to
 *     -->
 *     <some-path-component data-path="subPath" view-state-pasu="subPath" inherit>
 *       <!-- store参照パス (inherit を指定したため、上位のパスを引き継ぐ)
 *         data = Store.state.dataKey.dataTo.path.to.subPath
 *         viewState = Store.state.viewStateKey.viewStateTo.path.to.subPath
 *       -->
 *       ..... StoreBindMixin を実装したコンポーネントを定義する .....
 *     </some-path-component>
 *     <some-path-component
 *       data-path="moduleName:moduleDataKey.path.to"
 *       view-state-path="moduleName:moduelViewStateKey.path.to"
 *     >
 *       <!-- store参照パス (inherit を指定しない為、上位の情報を引き継がない)
 *         data = Store.state.moduleName.moduleDataKey.path.to
 *         viewState = Store.state.moduleName.moduelViewStateKey.path.to
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
    const dataPathFn = (): string => this.currentDataPath;
    const viewStatePathFn = (): string => this.currentViewStatePath;
    const viewStateFn = <T = ItemViewState>(): T => this.currentViewState;
    return {
      [PROVIDE_DATA_BIND_INFO_NAME]: {
        get dataPath() {
          return dataPathFn();
        },
        get viewStatePath() {
          return viewStatePathFn();
        },
        get viewState() {
          return viewStateFn();
        },
      } as DataBinderInfo,
    };
  },
  props: {
    dataPath: {
      type: String,
      required: false,
      default: undefined,
    },
    viewStatePath: {
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
      // 継承設定がない場合は、空の親オブジェクトを返却する
      return (this.inherit ? this.dataBindInfo : EMPTY_DATA_BIND_INFO) as DataBinderInfo;
    },
    /**
     * 上位の viewState を取得する。
     * 上位の情報は inject で設定された情報を使用する。
     * 自身が root の StorePathMixin の場合は、inject 設定が無いため、root パスの viewState を取得する。
     *
     * @see {@link rootViewStatePath}
     * @param inst StorePathMixin
     * @returns 親 viewState 値
     */
    parentStoreViewState(): ItemViewState {
      return this.parentInfo.viewState || EMPTY_OBJECT;
    },
    currentDataPath() {
      return resolvePath(this.parentInfo.dataPath, this.dataPath);
    },
    currentViewStatePath() {
      return resolvePath(this.parentInfo.viewStatePath, this.viewStatePath);
    },
    /**
     * 現在パスの viewState の値を取得する
     * @see {@link currentViewStatePath}
     * @see {@link ItemViewState}
     * @param inst StorePathMixin
     * @returns 現在パスの viewState 値
     */
    currentStoreViewState(): ItemViewState {
      return getStoreValue<ItemViewState>((this.$store as any).state, this.currentViewStatePath);
    },
    currentViewState(): any {
      const current = this.currentStoreViewState;
      const parent = this.parentStoreViewState;

      console.log({
        currentDataPath: this.currentDataPath,
        currentViewStatePath: this.currentViewStatePath,
        current,
        parent,
      });
      // FIXME ここの部分の実装は別途切り出して、拡張できるようにしておくべき。（拡張しようとすると修正が大変）
      // vue メソッドを用意しておいてもらい、あればそれを呼び出す形にする。無ければデフォルト動作をする。
      if (this.provideViewState) {
        console.log('exist provideViewState');
        return (this.provideViewState as ProvideViewStateMethod)();
      }

      return undefined;
      // return {
      //   // 設定優先順位： 自ViewState > 親ViewState
      //   // disabled プロパティ
      //   disabled: current?.disabled ?? parent?.disabled,
      //   // readonly プロパティ
      //   readonly: current?.readonly ?? parent?.readonly,
      // } as T;
    },
  },
});
