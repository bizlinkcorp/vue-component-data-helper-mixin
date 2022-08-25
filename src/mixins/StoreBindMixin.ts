import { defineComponent } from 'vue';
import { getStoreValue, resolvePath, EMPTY_OBJECT } from './helper';
import { DataBinderInfo, PROVIDE_DATA_BIND_INFO_NAME } from './StorePathMixin';
import { ItemViewState } from '../store/StoreViewState';

/** 空オブジェクトの固定値 */
const EMPTY_DATA_BIND_INFO = EMPTY_OBJECT;

/**
 * store value bind mixin
 *
 * @remarks
 * - Storeの単一データの参照／設定を制御する
 * - Storeの使用したいデータをコントロールする
 * - path 情報は、vue 機能の inject を利用し、上位コンポーネントから伝達される
 *
 * ## 前提条件
 * - store mutations に `setStoreState` を指定し、編集データを直接設定する
 *
 * ## 使用方法
 * - パスを指定したいコンポーネントの mixin に組み込む
 * - 組み込むことで以下のプロパティを指定することができる(input要素等の入力コンポーネントに設定することを想定する)
 *   - itemId
 *     - データパス下の項目IDを指定する
 *     - StorePathMixin で指定した上位パスと項目IDを連結したパスでデータを取得する
 * - 画面で利用する computed プロパティ
 *   - storeData
 *     - Store の dataKey + path + itemId のデータを参照／設定する
 *   - storeViewState
 *     - Store の viewStateKey + path + itemId の viewState を参照する
 *     - 上位で指定された viewState を引き継ぐ。下位／自身で状態が定義されていた場合は、状態を上書きする。
 *     - 状態として `disabled`, `readonly` を定義する。指定がない場合のデフォルト値は以下の通り。
 *       - disabled : false
 *       - readonly : false
 *
 * @example
 * ## コンポーネントへの組み込み方法
 * 使用方法の一例
 *
 * ```html
 * <template>
 *   <div>
 *     <input type="text"
 *       v-model="storeData"
 *       :disabled="storeViewState.disabled"
 *       :readonly="storeViewState.readonly"
 *     >
 *   </div>
 * </template>
 * <script lang="ts">
 * import { defineComponent } from 'vue';
 * import { StoreBindMixin } from 'vue-data-binder';
 *
 * export default defineComponent({
 *   name: 'SomeBindComponent',
 *   mixins: [StorePathMixin], // mixins で本コンポーネントを指定する
 *   ...
 * })
 * </script>
 * ```
 *
 * ## store 状態例
 * ```ts
 * Vuex.Store({
 *   state: {
 *     dataKey: {
 *       dataTo: {
 *         path: {
 *           to: {
 *             subPath: {
 *               id1: 'value1',
 *               id2: 'value2',
 *               id3: 'value3',
 *             }
 *           },
 *         },
 *       },
 *     },
 *     viewStateKey: {
 *       viewStateTo: {
 *         disabled: true,
 *         path: {
 *           readonly: true,
 *           to: {
 *             subPath: {
 *               id2: {
 *                 disabled: false,
 *               },
 *               id3: {
 *                 readonly: false,
 *               },
 *             },
 *           },
 *         },
 *       },
 *     },
 *   },
 *   module: {
 *     moduleName: {
 *       state: {
 *         moduleDataKey: {
 *           path: {
 *             to: {
 *               id4: 'value4',
 *               id5: 'value5',
 *             },
 *           },
 *         },
 *         moduelViewStateKey: {
 *           readonly: true,
 *         },
 *       },
 *     },
 *   },
 * })
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
 *       <some-bind-component item-id="id1">
 *         <!--
 *           dataId = dataKey.dataTo.path.to.subPath.id1
 *           viewStateId = viewStateKey.viewStateTo.path.to.subPath.id1
 *           storeData = 'value1'
 *           storeViewState = { disabled: true, readonly: true }
 *         -->
 *       </some-bind-component>
 *       <some-bind-component item-id="id2">
 *         <!--
 *           dataId = dataKey.dataTo.path.to.subPath.id2
 *           viewStateId = viewStateKey.viewStateTo.path.to.subPath.id2
 *           storeData = 'value2'
 *           storeViewState = { disabled: false, readonly: true }
 *         -->
 *       </some-bind-component>
 *       <some-bind-component item-id="id3">
 *         <!--
 *           dataId = dataKey.dataTo.path.to.subPath.id3
 *           viewStateId = viewStateKey.viewStateTo.path.to.subPath.id3
 *           storeData = 'value3'
 *           storeViewState = { disabled: true, readonly: false }
 *         -->
 *       </some-bind-component>
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
 *       <some-bind-component item-id="id4">
 *         <!--
 *           dataId = moduleName.moduleDataKey.path.to.id4
 *           viewStateId = moduleName.moduelViewStateKey.path.to.id4
 *           storeData = 'value4'
 *           storeViewState = { disabled: false, readonly: true }
 *         -->
 *       </some-bind-component>
 *       <some-bind-component item-id="id5">
 *         <!--
 *           dataId = moduleName.moduleDataKey.path.to.id5
 *           viewStateId = moduleName.moduelViewStateKey.path.to.id5
 *           storeData = 'value5'
 *           storeViewState = { disabled: false, readonly: true }
 *         -->
 *       </some-bind-component>
 *     </some-path-component>
 *   </some-path-component>
 * </template>
 * ```
 *
 */
export default defineComponent({
  name: 'StoreBindMixin',
  inject: {
    dataBindInfo: {
      from: PROVIDE_DATA_BIND_INFO_NAME,
      default: () => EMPTY_DATA_BIND_INFO,
    },
  },
  props: {
    itemId: {
      type: String,
      required: true,
    },
  },
  computed: {
    parentInfo() {
      return this.dataBindInfo as DataBinderInfo;
    },
    dataId() {
      return resolvePath(this.parentInfo.module, this.parentInfo.dataKey, this.parentInfo.path, this.itemId);
    },
    viewStateId() {
      return resolvePath(this.parentInfo.module, this.parentInfo.viewStateKey, this.parentInfo.path, this.itemId);
    },
    storeData: {
      get() {
        // TODO any化？
        return getStoreValue((this.$store as any).state, this.dataId);
      },
      set(newVal: unknown) {
        // FIXME store mutation メソッド名がリテラル
        const commitTargetName = 'setStoreState';
        // TODO any化？
        (this.$store as any).commit(commitTargetName, {
          key: this.dataId,
          value: newVal,
        });
      },
    },
    storeViewState(): ItemViewState {
      // 設定優先順位： 自ViewState > 親ViewState > デフォルト
      // TODO any化？
      const itemViewState = getStoreValue<ItemViewState>((this.$store as any).state, this.viewStateId);
      return {
        disabled: itemViewState?.disabled ?? this.parentInfo.viewState?.disabled ?? false,
        readonly: itemViewState?.readonly ?? this.parentInfo.viewState?.readonly ?? false,
      };
    },
  },
});
