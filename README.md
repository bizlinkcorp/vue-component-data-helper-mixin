# vue-data-binder

## TODOs

1. store の定義方法を決定する
2. StoreBindMixin.ts の storeData set 時の mutation の名称
   1. pinia では mutation は無く、action で対応する。

## 概要

- store 項目レベルで、画面コンポーネントにバインドする。
- データ項目状態を定義し、画面コンポーネントで状態値を自由に利用する。
- store state に対して、リアクティブな変更操作を提供する。
- [LICENSE](./LICENSE)

## install

```shell
npm install vue-data-binder
```

## 公開するライブラリ

|  No | 公開名                                           | タイプ        | 説明                                                           | 備考                                                          |
| --: | ------------------------------------------------ | ------------- | -------------------------------------------------------------- | ------------------------------------------------------------- |
|   1 | [StoreBindMixin](./src/mixins/StoreBindMixin.ts) | Vue mixin     | Store state と入力項目を結びつけるコンポーネント mixin         | 入力単一項目コンポーネントに設定することを想定                |
|   2 | [StorePathMixin](./src/mixins/StorePathMixin.ts) | Vue mixin     | StoreBindMixin で参照する項目の Store state パスを設定する     | StoreBindMixin を束ねるコンポーネントに設定することを想定する |
|   3 | [StorePath](./src/components/StorePath.ts)       | Vue Component | StorePathMixin をカスタム利用しない場合の単一コンポーネントい  |                                                               |
|   4 | [setStoreState](./src/store/StoreControl.ts)     | method        | StoreBindMixin の storeData 設定時に設定する mutation メソッド | root store の mutation に設定する。                           |

### コンポーネント補足

#### StoreBindMixin

#### StorePathMixin

- props
  - path (string)
  - dataKey (string)
  - viewStateKey (string)
  - inherit (boolean)

## 使用方法

### Store 設定

- Root Store に setStoreState を設定する。
- viewState に該当する state は `ViewStateTree` に一致するデータ型で定義する。

```ts
import { setStoreState, ViewStateTree } from 'vue-data-binder';

export default new Vuex.Store({
  // 本項以降の説明で利用する state の値を設定する。
  state: () => ({
    // dataKey
    data: {
      card1: {
        no: '1',
        detail: '説明',
        amount: 10000,
      },
    },
    // viewStateKey
    viewState: {
      disabled: true,
      card1: {
        detail: {
          disabled: false,
        },
      },
    } as ViewStateTree,
  }),
  mutations: {
    setStoreState, // root store の mutations に setStoreState を指定する
  },
  modules: {
    module1: {
      state: () => ({
        // dataKey
        modData: {
          card2: {
            no: '100',
            detail: 'モジュール説明',
            amount: 5000,
          },
        },
        // viewStateKey
        modViewState: {
          readonly: true,
          card2: {
            amount: { readonly: false },
          },
        } as ViewStateTree,
      }),
    },
  },
});
```

### コンポーネント定義

#### StoreBindMixin

##### 解説

|  No | vue type | name           | value type    | desc                                                      | remarks          |
| --: | -------- | -------------- | ------------- | --------------------------------------------------------- | ---------------- |
|   1 | props    | itemId         | string        | 項目を一意に指定する ID。Store 参照時のキーとして利用する |                  |
|   2 | computed | storeData      | any           | パスに一致した store の値操作                             | 取得／設定が可能 |
|   3 | computed | storeViewState | ItemViewState | パスに一致した store の viewState を取得                  | 読み取りのみ     |

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
  })
</script>
```

#### StorePathMixin

##### 解説

|  No | vue type | name         | value type | desc                                                                                           | remarks |
| --: | -------- | ------------ | ---------- | ---------------------------------------------------------------------------------------------- | ------- |
|   1 | props    | path         | string     | "." で区切られたパス。 ":" の前にモジュールを指定可能                                          |         |
|   2 | props    | dataKey      | string     | data を定義した state パス要素                                                                 |         |
|   3 | props    | viewStateKey | string     | viewState を定義した state パス要素                                                            |         |
|   4 | props    | inherit      | boolean    | 上位の path, dataKey, viewStateKey を継承するか否か。true の場合継承し、false の場合継承しない |         |

参考：以下のような定義の場合のパス要素継承イメージ

```html
<!--
  store-path： StorePathMixin を適用したコンポーネントとする。
  store-bind： StoreBindMixin を適用したコンポーネントとする。
-->
<store-path data-key="dataKey.data1" view-state-key="viewStateKey.case1" path="path">
  <!-- A -->
  <store-path path="to" inherit>
    <!-- B -->
    <store-bind item-id="id1" />
      <!-- C -->
    </store-bind>
  </store-path>
  <store-path path="module1:hoge" view-state-key="viewState">
    <!-- D -->
    <store-bind item-id="huga">
      <!-- E -->
    </store-bind>
  </store-path>
</store-path>
```

上記の設定状況の場合の、継承状況や項目設定状況

|  No | type       | inherit | module  | dataKey          | viewStateKey       | path        | remarks                                                                         | data path                    | viewState path                 |
| --: | ---------- | ------- | ------- | ---------------- | ------------------ | ----------- | ------------------------------------------------------------------------------- | ---------------------------- | ------------------------------ |
|   A | store-path |         |         | dataKey.dataPath | viewStateKey.case1 | path        |                                                                                 | dataKey.dataPath.path        | viewStateKey.case1.path        |
|   B | store-path | true    |         | dataKey.dataPath | viewStateKey.case1 | path.to     | dataKey, viewStateKey, path を上位から継承。自身の path は上位の値と連結        | dataKey.dataPath.path.to     | viewStateKey.case1.path.to     |
|   C | store-bind | -       |         | dataKey.dataPath | viewStateKey.case1 | path.to.id1 | dataKey, viewStateKey, path を上位から継承。自身の itemId を 上位の path と連結 | dataKey.dataPath.path.to.id1 | viewStateKey.case1.path.to.id1 |
|   D | store-path |         | module1 |                  | viewState          | hoge        | inherit 未指定の為、上位の情報を継承しない。本要素で指定した値のみ利用          | module1.hoge                 | module1.viewState.hoge         |
|   E | store-bind | -       | module1 |                  | viewState          | hoge.huga   |                                                                                 | module1.hoge.huga            | module1.viewState.hoge.huga    |

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
    <card-template path="card1" data-key="data" view-state-key="viewState" />
    <card-template path="module1:card2" data-key="modData" view-state-key="modViewState" />
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
