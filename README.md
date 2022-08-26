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
|   3 | [StorePath](./src/components/StorePath.ts)       | Vue Component | StorePathMixin をカスタム利用しない場合の単一コンポーネントい  |                                                               |
|   4 | [setStoreState](./src/store/StoreControl.ts)     | method        | StoreBindMixin の storeData 設定時に設定する mutation メソッド | root store の mutation に設定する。                           |

## 使用方法

### Store 設定

- Root Store に setStoreState を設定する。
- viewState に該当する state は `ViewStateTree` に一致するデータ型で定義する。

#### ViewStateTree

- ViewState のデータ型を定義する。最終的な設定値は利用者で決定することができる。
- FIXME ！！！ここを踏まえて例を記載しなおす必要がある！！！

#### 設定例

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
  <!-- FIXME 拡張ポイントを用意しておく -->
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

|  No | vue type | name          | value type | desc                                                                                       | remarks |
| --: | -------- | ------------- | ---------- | ------------------------------------------------------------------------------------------ | ------- |
|   2 | props    | dataPath      | string     | data を定義した state パス要素                                                             |         |
|   3 | props    | viewStatePath | string     | viewState を定義した state パス要素                                                        |         |
|   4 | props    | inherit       | boolean    | 上位の dataPath, viewStatePath を継承するか否か。true の場合継承し、false の場合継承しない |         |

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

## License

[MIT](./LICENSE)

Copyright (c) 2022 BizLink Co.,Ltd.
