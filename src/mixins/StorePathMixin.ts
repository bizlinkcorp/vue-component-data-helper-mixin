import { defineComponent } from 'vue';
import { getStoreState } from '../store/StoreControl';
import {
  EMPTY_OBJECT,
  EMPTY_DATA_BIND_INFO,
  DataBinderInfo,
  resolvePath,
  GetViewStateMethod,
  DataBindInfoInjectedInstance,
} from './helper';

/** provide情報キー */
export const PROVIDE_DATA_BIND_INFO_NAME = 'parentDataBindInfo';

/**
 * 利用者で実装する Vue メソッド
 */
interface VueUserImplements {
  /** provide として設定する情報を返却する */
  getProvideViewState?: GetViewStateMethod;
}

/**
 * store path mixin
 *
 * @remarks
 *
 * ##### 概要
 *
 * - Store state のデータのパスをコントロールする
 * - path 情報は、vue 機能の provide/inject を利用し、下位コンポーネントへ伝達する
 *
 * ##### 使用方法
 *
 * - パスを指定したいコンポーネントの mixin に組み込む
 * - dataPath, viewStatePath でモジュールを指定する場合は、先頭に `moduleName:` を指定する。
 *   - 参考： `moduleName:path.to`
 *
 * ##### mixin 詳細
 *
 * |  No | vue type | name                    | value type     | desc                                                                                                                 | remarks               |
 * | --: | -------- | ----------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------- |
 * |   1 | props    | dataPath                | string         | data を定義した state パス要素                                                                                       |                       |
 * |   2 | props    | viewStatePath           | string         | viewState を定義した state パス要素                                                                                  |                       |
 * |   3 | props    | notInheritDataPath      | boolean        | 上位の dataPath を継承するか。true の場合継承しない                                                                  | default value = false |
 * |   4 | props    | notInheritViewStatePath | boolean        | 上位の viewStatePath を継承するか。true の場合継承しない                                                             | default value = false |
 * |   5 | computed | parentInfo              | DataBinderInfo | 上位から引き継がれた `DataBinderInfo`。inject で指定された値。                                                       |                       |
 * |   6 | computed | provideDataPath         | DataBinderInfo | parentInfo.dataPath + '.' + dataPath の値                                                                            |                       |
 * |   7 | computed | provideViewStatePath    | DataBinderInfo | parentInfo.viewStatePath + '.' + viewStatePath の値                                                                  |                       |
 * |   8 | methods  | parentViewState         | any            | parentInfo.viewState() の値。notInheritViewStatePath が true の場合、空オブジェクトとなる                            | generics 利用可能     |
 * |   9 | methods  | currentViewState        | any            | provideViewStatePath に一致した store の viewState を取得                                                            | generics 利用可能     |
 * |  10 | methods  | provideViewState        | any            | 下位へ引き継ぐ viewState。getProvideViewState の返却値を設定する。getProvideViewState 未実装の場合は空オブジェクト。 | generics 利用可能     |
 * |  11 | methods  | getProvideViewState     | any            | 下位へ引き継ぐ viewState の値を返却する。mixin では未実装。拡張要素。                                                | 利用者にて実装する    |
 *
 * ##### 参考：パス要素継承イメージ
 *
 * ```html
 * <!--
 *   store-path： StorePathMixin を適用したコンポーネントとする。
 *   store-bind： StoreBindMixin を適用したコンポーネントとする。
 * -->
 * <store-path data-path="dataKey.data.path" view-state-path="viewStateKey.case.path">
 *   <!-- A -->
 *   <store-path data-path="to" >
 *     <!-- B -->
 *     <store-bind item-id="id1" />
 *       <!-- C -->
 *     </store-bind>
 *   </store-path>
 *   <store-path data-path="module1:hoge" view-state-path="module1:viewState.hoge" no-inherit-data-path no-inherit-view-state-path>
 *     <!-- D -->
 *     <store-bind item-id="huga">
 *       <!-- E -->
 *     </store-bind>
 *   </store-path>
 * </store-path>
 * ```
 *
 * 上記の設定状況の場合の、継承状況や項目設定状況
 *
 * |  No | type       | props dataPath    | props viewStatePath     | prop itemId | remarks                                                                                      | provideDataPath \| dataId | provideViewStatePath \| viewStateId |
 * | --: | ---------- | ----------------- | ----------------------- | ----------- | -------------------------------------------------------------------------------------------- | ------------------------- | ----------------------------------- |
 * |   A | store-path | dataKey.data.path | viewStateKey.case1.path | -           | 最上位パス定義                                                                               | dataKey.data.path         | viewStateKey.case.path              |
 * |   B | store-path | to                |                         | -           | dataPath, viewStatePath を上位から継承。自身の dataPath, viewStatePath は上位の値と連結      | dataKey.data.path.to      | viewStateKey.case.path              |
 * |   C | store-bind | -                 | -                       | id1         | dataPath, viewStatePath を上位から継承。自身の itemId を 上位の (data\|viewState)Path と連結 | dataKey.data.path.to.id1  | viewStateKey.case.path.id1          |
 * |   D | store-path | module1:hoge      | module1:viewState.hoge  | -           | no-inherit-data-path, no-inherit-view-state-path 指定の為、本要素で指定した値のみ有効        | module1:hoge              | module1:viewState.hoge              |
 * |   E | store-bind | -                 | -                       | huga        | dataPath, viewStatePath を上位から継承。自身の itemId を 上位の (data\|viewState)Path と連結 | module1:hoge.huga         | module1:viewState.hoge.huga         |
 *
 * @example
 *
 * ```vue
 * <template>
 *   <div class="card-template">
 *     <text-bind-comp item-id="no" />
 *     <text-bind-comp item-id="detail" />
 *     <text-bind-comp item-id="amount" />
 *   </div>
 * </template>
 * <script lang="ts">
 *   import { defineComponent } from 'vue';
 *   import { StorePathMixin } from 'vue-data-binder';
 *   import TextBindComp from './TextBindComp.vue'; // StoreBindMixin の example 参照
 *
 *   export default defineComponent({
 *     name: 'CardTemplate',
 *     mixins: [StorePathMixin], // mixins で StorePathMixin を指定する
 *     components: {
 *       TextBindComp,
 *     },
 *     // ...
 *     methods: {
 *       // 必要な場合は個別に実装する
 *       getProvideViewState() {
 *         const current = this.currentViewState<AppViewState>();
 *         const parent = this.parentViewState<AppViewState>();
 *
 *         // 上位の viewState を下位に伝搬する
 *         return {
 *           // 設定優先順位： 自ViewState > 親ViewState
 *           // disabled プロパティ
 *           disabled: current?.disabled ?? parent?.disabled,
 *           // readonly プロパティ
 *           readonly: current?.readonly ?? parent?.readonly,
 *         };
 *       },
 *     },
 *   });
 * </script>
 * ```
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
    const dataPathFn = (): string => this.provideDataPath;
    const viewStatePathFn = (): string => this.provideViewStatePath;
    const viewStateFn = <S>(): S => this.provideViewState<S>();
    return {
      [PROVIDE_DATA_BIND_INFO_NAME]: {
        dataPath() {
          return dataPathFn();
        },
        viewStatePath() {
          return viewStatePathFn();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ViewStateデータは任意でどのような値でも指定可能な為、any を許容する
        viewState<S = any>() {
          return viewStateFn<S>();
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
    notInheritDataPath: {
      type: Boolean,
      require: false,
      default: false,
    },
    notInheritViewStatePath: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  computed: {
    parentInfo() {
      return (this as unknown as DataBindInfoInjectedInstance).dataBindInfo;
    },
    provideDataPath() {
      if (this.notInheritDataPath) {
        return this.dataPath;
      }
      return resolvePath(this.parentInfo.dataPath(), this.dataPath);
    },
    provideViewStatePath() {
      if (this.notInheritViewStatePath) {
        return this.viewStatePath;
      }
      return resolvePath(this.parentInfo.viewStatePath(), this.viewStatePath);
    },
  },
  methods: {
    /**
     * 上位の viewState を取得する。
     * 上位の情報は inject で設定された情報を使用する。
     *
     * @returns 親 viewState 値
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ViewStateデータは任意でどのような値でも指定可能な為、any を許容する
    parentViewState<S = any>(): S {
      if (this.notInheritViewStatePath) {
        // viewStatePath を継承しない場合は、空オブジェクトを返却する
        return EMPTY_OBJECT;
      }
      return this.parentInfo.viewState<S>();
    },
    /**
     * 現在パスの viewState の値を store state から取得する
     * @see {@link provideViewStatePath}
     * @returns 現在パスの viewState 値
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ViewStateデータは任意でどのような値でも指定可能な為、any を許容する
    currentViewState<S = any>(): S {
      const path = this.provideViewStatePath;
      if (!path) {
        // path = undefined の場合は空オブジェクトを返却する
        return EMPTY_OBJECT;
      }
      // パスが設定されていた場合は、viewState を返却する
      return getStoreState<S>(this.$store.state, path);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ViewStateデータは任意でどのような値でも指定可能な為、any を許容する
    provideViewState<S = any>(): S {
      const userImplementsInst = this as unknown as VueUserImplements;
      // 利用者が実装する getProvideViewState メソッドが存在していたら呼び出す
      if (userImplementsInst.getProvideViewState) {
        return userImplementsInst.getProvideViewState<S>();
      }
      // 無ければ空オブジェクトを返却する
      return EMPTY_OBJECT;
    },
  },
});
