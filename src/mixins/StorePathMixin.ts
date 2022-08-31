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
 * |  No | vue type | name                 | value type     | desc                                                                                                                 | remarks            |
 * | --: | -------- | -------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------ |
 * |   1 | props    | dataPath             | string         | data を定義した state パス要素                                                                                       |                    |
 * |   2 | props    | viewStatePath        | string         | viewState を定義した state パス要素                                                                                  |                    |
 * |   3 | props    | inherit              | boolean        | 上位の dataPath, viewStatePath を継承するか。true の場合継承し、false の場合継承しない                               |                    |
 * |   4 | computed | parentInfo           | DataBinderInfo | 上位から引き継がれた `DataBinderInfo`                                                                                |                    |
 * |   5 | computed | provideDataPath      | DataBinderInfo | parentInfo.dataPath + '.' + dataPath の値                                                                            |                    |
 * |   6 | computed | provideViewStatePath | DataBinderInfo | parentInfo.viewStatePath + '.' + viewStatePath の値                                                                  |                    |
 * |   7 | methods  | parentViewState      | any            | parentInfo.viewState() の値                                                                                          | generics 利用可能  |
 * |   8 | methods  | currentViewState     | any            | provideViewStatePath に一致した store の viewState を取得                                                            | generics 利用可能  |
 * |   9 | methods  | provideViewState     | any            | 下位へ引き継ぐ viewState。getProvideViewState の返却値を設定する。getProvideViewState 未実装の場合は空オブジェクト。 | generics 利用可能  |
 * |  10 | methods  | getProvideViewState  | any            | 下位へ引き継ぐ viewState の値を返却する。mixin では未実装。拡張要素。                                                | 利用者にて実装する |
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
    inherit: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    parentInfo() {
      // 継承設定がない場合は、空の親オブジェクトを返却する
      return this.inherit ? (this as unknown as DataBindInfoInjectedInstance).dataBindInfo : EMPTY_DATA_BIND_INFO;
    },
    provideDataPath() {
      return resolvePath(this.parentInfo.dataPath(), this.dataPath);
    },
    provideViewStatePath() {
      return resolvePath(this.parentInfo.viewStatePath(), this.viewStatePath);
    },
  },
  methods: {
    /**
     * 上位の viewState を取得する。
     * 上位の情報は inject で設定された情報を使用する。
     * 自身が root の StorePathMixin の場合は、inject 設定が無いため、root パスの viewState を取得する。
     *
     * @see {@link rootViewStatePath}
     * @param inst StorePathMixin
     * @returns 親 viewState 値
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ViewStateデータは任意でどのような値でも指定可能な為、any を許容する
    parentViewState<S = any>(): S {
      return this.parentInfo.viewState<S>();
    },
    /**
     * 現在パスの viewState の値を取得する
     * @see {@link currentViewStatePath}
     * @see {@link ItemViewState}
     * @param inst StorePathMixin
     * @returns 現在パスの viewState 値
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ViewStateデータは任意でどのような値でも指定可能な為、any を許容する
    currentViewState<S = any>(): S {
      return getStoreState<S>(this.$store.state, this.provideViewStatePath);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ViewStateデータは任意でどのような値でも指定可能な為、any を許容する
    provideViewState<S = any>(): S {
      // vue メソッドを用意しておいてもらい、あればそれを呼び出す形にする。無ければデフォルト動作をする。
      const userImplementsInst = this as unknown as VueUserImplements;
      if (userImplementsInst.getProvideViewState) {
        return userImplementsInst.getProvideViewState<S>();
      }

      return EMPTY_OBJECT;
    },
  },
});
