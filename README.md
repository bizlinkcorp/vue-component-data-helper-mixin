# vue-data-binder

## TODOs

1. store の定義方法を決定する
2. StoreBindMixin.ts の storeData set 時の mutation の名称
   1. pinia では mutation は無く、action で対応する。
3. 本ファイルは、README.ja.md とし、英語とする？

## 概要

- store 項目レベルで、画面コンポーネントにバインドする。
- データ項目状態を定義し、画面コンポーネントで状態値を自由に利用する。
- store state に対して、リアクティブな変更操作を提供する。

## install

```shell
npm install vue-data-binder
```

## 公開するライブラリ

|  No | 公開名                                           | タイプ        | 説明                                                           | 備考                                                          |
| --: | ------------------------------------------------ | ------------- | -------------------------------------------------------------- | ------------------------------------------------------------- |
|   1 | [StoreBindMixin](./src/mixins/StoreBindMixin.ts) | Vue mixin     | Store state と入力項目を結びつけるコンポーネント mixin         | 入力単一項目コンポーネントに設定することを想定                |
|   2 | [StorePathMixin](./src/mixins/StorePathMixin.ts) | Vue mixin     | StoreBindMixin で参照する項目の Store state パスを設定する     | StoreBindMixin を束ねるコンポーネントに設定することを想定する |
|   3 | [StorePath](./src/components/StorePath.ts)       | Vue Component | StorePathMixin をカスタム利用しない場合の単一コンポーネント    |                                                               |
|   4 | [setStoreState](./src/store/StoreControl.ts)     | method        | StoreBindMixin の storeData 設定時に設定する mutation メソッド | root store の mutation に設定する。                           |
|   5 | [DataBinderInfo](./src/mixins/helper.ts)         | type          | StorePathMixin から引き継がれるデータバインド情報              | ViewState を引継ぐ場合、StorePathMixin をカスタムする         |
|   6 | [StateSetPayload](./src/store/StoreControl.ts)   | type          | mutation に設定した `setStoreState` の Payload                 | generics を利用して viewState のデータ型を指定可能            |
|   7 | [ViewStateTree](./src/store/ViewStateTree.ts)    | type          | store state に設定する viewState の tree データ型              | generics を利用して viewState のデータ型を指定可能            |

## 使用方法

### Store 設定

- Root Store に setStoreState を設定する。
- viewState に該当する state は `ViewStateTree` に一致するデータ型で定義する。

#### 設定例

```ts
import { setStoreState, ViewStateTree } from 'vue-data-binder';

export interface AppViewState {
  /** 無効*/
  disabled?: boolean;
  /** 読み取り専用 */
  readonly?: boolean;
}

// ViewStateの設定値は AppViewState とする
export type AppViewStateTree = ViewStateTree<AppViewState>;

export default new Vuex.Store({
  // 本項以降の説明で利用する state の値を設定する。
  state: () => ({
    data: {
      card1: {
        no: '1',
        detail: '説明',
        amount: 10000,
      },
      card2: {
        no: '2',
        detail: '説明2',
        amount: 20000,
      },
    },
    viewState: {
      // viewState 全体 disabled
      disabled: true,
      card1: {
        // 個別項目
        detail: { disabled: false },
      },
      card2: {
        // card11 全体 disabled
        disabled: false,
      },
      card11: {
        // card11 全体 disabled
        disabled: false,
        // card11 全体 readonly
        readonly: true,
        // 個別項目
        amount: { readonly: false },
      },
    } as AppViewStateTree,
  }),
  mutations: {
    setStoreState,
  },
  modules: {
    module1: {
      state: () => ({
        modData: {
          card11: {
            no: '100',
            detail: 'モジュール説明',
            amount: 5000,
          },
        },
      }),
    },
  },
});
```

### コンポーネント定義

#### StoreBindMixin

##### 概要

- Store state の参照／設定を制御する
- dataPath, viewStatePath は、vue 機能の inject を利用し、上位コンポーネントから伝達する

##### 前提条件

- store mutations に `setStoreState` を指定してあること（setStoreState は store state 編集を実施）

##### 使用方法

- コンポーネントに mixin を組み込む
- プロパティ itemId に値のキー情報を設定する

##### Mixin 詳細

|  No | vue type | name           | value type     | desc                                                      | remarks                                    |
| --: | -------- | -------------- | -------------- | --------------------------------------------------------- | ------------------------------------------ |
|   1 | props    | itemId         | string         | 項目を一意に指定する ID。Store 参照時のキーとして利用する |                                            |
|   2 | computed | parentInfo     | DataBinderInfo | 上位から引き継がれた `DataBinderInfo`                     |
|   3 | computed | dataId         | string         | parentInfo.dataPath + '.' + itemId の値                   |                                            |
|   4 | computed | viewStateId    | string         | parentInfo.viewStatePath + '.' + itemId の値              |                                            |
|   5 | computed | storeData      | any            | dataId に一致した store の値を取得／設定                  |                                            |
|   6 | computed | storeViewState | any            | viewStateId に一致した store の viewState を取得          | 上位引継ぎは無し。viewStateId の値のみ取得 |

- 注意点
  - StorePathMixin の `parentInfo.viewState()` を利用する場合は、計算プロパティを個別実装すること。

##### コンポーネント定義例

src/path/to/TextBindComp.vue

```html
<template>
  <!-- 例として disable, readonly 属性に設定してある。この属性値は v-if 等で描画を切り替える等自由に設定して良い -->
  <input type="text" v-model="storeData" :disabled="storeViewState.disabled" :readonly="storeViewState.readonly" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { StoreBindMixin } from 'vue-data-binder';

  export default defineComponent({
    name: 'TextBindComp',
    mixins: [StoreBindMixin], // mixins で StoreBindMixin を指定する
    ...
    // FIXME itemViewState 拡張ポイントの実装を記載する
  })
</script>
```

#### StorePathMixin

##### 概要

- Store state のデータのパスをコントロールする
- path 情報は、vue 機能の provide/inject を利用し、下位コンポーネントへ伝達する

##### 使用方法

- パスを指定したいコンポーネントの mixin に組み込む
- dataPath, viewStatePath でモジュールを指定する場合は、先頭に `moduleName:` を指定する。
  - 参考： `moduleName:path.to`

##### mixin 詳細

|  No | vue type | name                 | value type     | desc                                                                                                                 | remarks            |
| --: | -------- | -------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------ |
|   1 | props    | dataPath             | string         | data を定義した state パス要素                                                                                       |                    |
|   2 | props    | viewStatePath        | string         | viewState を定義した state パス要素                                                                                  |                    |
|   3 | props    | inherit              | boolean        | 上位の dataPath, viewStatePath を継承するか。true の場合継承し、false の場合継承しない                               |                    |
|   4 | computed | parentInfo           | DataBinderInfo | 上位から引き継がれた `DataBinderInfo`                                                                                |                    |
|   5 | computed | provideDataPath      | DataBinderInfo | parentInfo.dataPath + '.' + dataPath の値                                                                            |                    |
|   6 | computed | provideViewStatePath | DataBinderInfo | parentInfo.viewStatePath + '.' + viewStatePath の値                                                                  |                    |
|   7 | methods  | parentViewState      | any            | parentInfo.viewState() の値                                                                                          | generics 利用可能  |
|   8 | methods  | currentViewState     | any            | provideViewStatePath に一致した store の viewState を取得                                                            | generics 利用可能  |
|   9 | methods  | provideViewState     | any            | 下位へ引き継ぐ viewState。getProvideViewState の返却値を設定する。getProvideViewState 未実装の場合は空オブジェクト。 | generics 利用可能  |
|  10 | methods  | getProvideViewState  | any            | 下位へ引き継ぐ viewState の値を返却する。mixin では未実装。拡張要素。                                                | 利用者にて実装する |

参考：以下のような定義の場合のパス要素継承イメージ

```html
<!--
  store-path： StorePathMixin を適用したコンポーネントとする。
  store-bind： StoreBindMixin を適用したコンポーネントとする。
-->
<store-path data-path="dataKey.data1.path" view-state-path="viewStateKey.case1.path">
  <!-- A -->
  <store-path data-path="to" inherit>
    <!-- B -->
    <store-bind item-id="id1" />
      <!-- C -->
    </store-bind>
  </store-path>
  <store-path data-path="module1:hoge" view-state-path="module1:viewState.hoge">
    <!-- D -->
    <store-bind item-id="huga">
      <!-- E -->
    </store-bind>
  </store-path>
</store-path>
```

上記の設定状況の場合の、継承状況や項目設定状況

|  No | type       | inherit | dataPath      | viewStatePath           | item-id | remarks                                                                                      | data path                    | viewState path              |
| --: | ---------- | ------- | ------------- | ----------------------- | ------- | -------------------------------------------------------------------------------------------- | ---------------------------- | --------------------------- |
|   A | store-path |         | dataKey.data1 | viewStateKey.case1.path | -       |                                                                                              | dataKey.data1.path           | viewStateKey.case1.path     |
|   B | store-path | true    | to            |                         | -       | dataPath, viewStatePath を上位から継承。自身の dataPath, viewStatePath は上位の値と連結      | dataKey.data1.path.to        | viewStateKey.case1.path     |
|   C | store-bind | -       | -             | -                       | id1     | dataPath, viewStatePath を上位から継承。自身の itemId を 上位の (data\|viewState)Path と連結 | dataKey.dataPath.path.to.id1 | viewStateKey.case1.path.id1 |
|   D | store-path |         | module1:hoge  | module1:viewState.hoge  | -       | inherit 未指定の為、上位の情報を継承しない。本要素で指定した値のみ利用                       | module1.hoge                 | module1.viewState.hoge      |
|   E | store-bind | -       | -             | -                       | huga    |                                                                                              | module1.hoge.huga            | module1.viewState.hoge.huga |

##### コンポーネント定義例

src/path/to/CardTemplate.vue

```html
<template>
  <div class="card-template">
    <text-bind-comp item-id="no" />
    <text-bind-comp item-id="detail" />
    <text-bind-comp item-id="amount" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { StorePathMixin } from 'vue-data-binder';
  import TextBindComp from './TextBindComp.vue';

  export default defineComponent({
    name: 'CardTemplate',
    mixins: [StorePathMixin], // mixins で StorePathMixin を指定する
    components: {
      TextBindComp,
    },
    ...
  })
</script>
```

#### アプリケーション利用例

src/App.vue

```html
<template>
  <div class="app">
    <card-template data-path="data.card1" view-state-path="viewState.card1">
      <!-- data = Store.state.data.card1.${itemId}, viewState = Store.state.viewState.card1.${itemId} -->
    </card-template>
    <card-template data-key="module1:modData.card2" view-state-key="module1:modViewState.card2">
      <!-- data = Store.state.module1.modData.card2.${itemId}, viewState = Store.state.module1.modViewState.card2.${itemId} -->
    <card-template>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import CardTemplate from './path/to/CardTemplate.vue';

  export default defineComponent({
    name: 'App',
    components: {
      CardTemplate,
    },
    ...
  })
</script>
```

## License

[MIT](./LICENSE)

Copyright (c) 2022 BizLink Co.,Ltd.
