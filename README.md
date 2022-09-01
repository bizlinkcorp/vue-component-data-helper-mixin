# vue-data-binder

## TODOs

1. store の定義方法を決定する
2. StoreBindMixin.ts の storeData set 時の mutation の名称
   1. pinia では mutation は無く、action で対応する。
3. 本ファイルは、README.ja.md とし、英語とする？

## 初めに

- Vue Store を利用した画面を作成すると、以下のボイラープレートを作成する必要がある。
  - データ取得の為の getters
  - データ設定の為の actions / mutations
- 少量ならば管理できるが項目が大量になると管理が煩雑になってしまう。
- store データを画面項目へシンプルな反映／設定を目的として作成した。

## 概要

- store 項目レベルで、画面コンポーネントにデータを直接バインドできる。
- store state に対して、リアクティブな変更操作を提供する。
- オプションで項目に表示状態を定義することができ、画面コンポーネントで状態値を自由に利用できる。

## getting start

シンプルな input text 項目に store の値をバインドを実施する。

### 1. install package

```shell
npm install vue-data-binder
```

### 2. store 設定

1. データバインドしたいデータを定義する
2. mutations に setStoreState を設定する

```ts
import Vue from 'vue';
import Vuex from 'vuex';
import { setStoreState } from 'vue-data-binder';

Vue.use(Vuex);

export default new Vuex.Store({
  state: () => ({
    // -- 1 -- data.card1 データを設定
    data: {
      card1: 'card1Value',
    },
  }),
  mutations: {
    // -- 2 --
    setStoreState,
  },
});
```

### 3. StoreBindMixin を適用したコンポーネント作成

ここで作成するコンポーネントは TextBindComp.vue とする。

1. コンポーネントに StoreBindMixin を設定する
2. 画面項目に mixin 計算プロパティ storeData を設定する

```vue
<template>
  <!-- 2 -->
  <input type="text" class="txt" v-model="storeData" />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { StoreBindMixin } from 'vue-data-binder';

export default defineComponent({
  name: 'TextBindComp',
  // -- 1 --
  mixins: [StoreBindMixin],
});
</script>
```

### 4. アプリにコンポーネントを設定する

1. パス設定コンポーネント StorePath を適用する
2. 作成した TextBindComp.vue を適用する
3. StorePath に dataPath を設定する
4. TextBindComp に itemId を設定する

```vue
<template>
  <div>
    <!-- 3 -->
    <store-path data-path="data">
      <!-- 4 -- TextBindComp では data.card1 の値を参照する -->
      <text-bind-comp item-id="card1" />
    </store-path>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { StorePath } from 'vue-data-binder';
import TextBindComp from './TextBindComp.vue';

export default defineComponent({
  name: 'TextBindComp',
  components: {
    // -- 1 --
    StorePath,
    // -- 2 --
    TextBindComp,
  },
});
</script>
```

### 実行結果

```html
<div>
  <div>
    <!-- input value = 'card1Value' (from $store.state.data.card1 ) -->
    <input type="text" class="txt" />
  </div>
</div>
```

## ライブラリで公開するコンポーネント

|  No | 公開名                                           | タイプ        | 説明                                                           | 備考                                                          |
| --: | ------------------------------------------------ | ------------- | -------------------------------------------------------------- | ------------------------------------------------------------- |
|   1 | [StoreBindMixin](./src/mixins/StoreBindMixin.ts) | Vue mixin     | Store state と入力項目を結びつけるコンポーネント mixin         | 入力単一項目コンポーネントに設定することを想定                |
|   2 | [StorePathMixin](./src/mixins/StorePathMixin.ts) | Vue mixin     | StoreBindMixin で参照する項目の Store state パスを設定する     | StoreBindMixin を束ねるコンポーネントに設定することを想定する |
|   3 | [StorePath](./src/components/StorePath.ts)       | Vue Component | StorePathMixin をカスタム利用しない場合の単一コンポーネント    |                                                               |
|   4 | [setStoreState](./src/store/StoreControl.ts)     | method        | StoreBindMixin の storeData 設定時に設定する mutation メソッド | root store の mutation に設定する。                           |
|   5 | [StateSetPayload](./src/store/StoreControl.ts)   | type          | mutation に設定した `setStoreState` の Payload                 | generics を利用して viewState のデータ型を指定可能            |
|   6 | [ViewStateTree](./src/store/ViewStateTree.ts)    | type          | store state に設定する viewState の tree データ型              | generics を利用して viewState のデータ型を指定可能            |
|   7 | [DataBinderInfo](./src/mixins/helper.ts)         | type          | StorePathMixin から引き継がれるデータバインド情報              | ViewState を引継ぐ場合、StorePathMixin をカスタムする         |

## 使用方法

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

|  No | vue type | name                    | value type     | desc                                                                                                                 | remarks               |
| --: | -------- | ----------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------- |
|   1 | props    | dataPath                | string         | data を定義した state パス要素                                                                                       |                       |
|   2 | props    | viewStatePath           | string         | viewState を定義した state パス要素                                                                                  |                       |
|   3 | props    | notInheritDataPath      | boolean        | 上位の dataPath を継承するか。true の場合継承しない                                                                  | default value = false |
|   4 | props    | notInheritViewStatePath | boolean        | 上位の viewStatePath を継承するか。true の場合継承しない                                                             | default value = false |
|   5 | computed | parentInfo              | DataBinderInfo | 上位から引き継がれた `DataBinderInfo`。inject で指定された値。                                                       |                       |
|   6 | computed | provideDataPath         | DataBinderInfo | parentInfo.dataPath + '.' + dataPath の値                                                                            |                       |
|   7 | computed | provideViewStatePath    | DataBinderInfo | parentInfo.viewStatePath + '.' + viewStatePath の値                                                                  |                       |
|   8 | methods  | parentViewState         | any            | parentInfo.viewState() の値。notInheritViewStatePath が true の場合、空オブジェクトとなる                            | generics 利用可能     |
|   9 | methods  | currentViewState        | any            | provideViewStatePath に一致した store の viewState を取得                                                            | generics 利用可能     |
|  10 | methods  | provideViewState        | any            | 下位へ引き継ぐ viewState。getProvideViewState の返却値を設定する。getProvideViewState 未実装の場合は空オブジェクト。 | generics 利用可能     |
|  11 | methods  | getProvideViewState     | any            | 下位へ引き継ぐ viewState の値を返却する。mixin では未実装。拡張要素。                                                | 利用者にて実装する    |

参考：以下のような定義の場合のパス要素継承イメージ

```html
<!--
  store-path： StorePathMixin を適用したコンポーネントとする。
  store-bind： StoreBindMixin を適用したコンポーネントとする。
-->
<store-path data-path="dataKey.data.path" view-state-path="viewStateKey.case.path">
  <!-- A -->
  <store-path data-path="to" >
    <!-- B -->
    <store-bind item-id="id1" />
      <!-- C -->
    </store-bind>
  </store-path>
  <store-path data-path="module1:hoge" view-state-path="module1:viewState.hoge" no-inherit-data-path no-inherit-view-state-path>
    <!-- D -->
    <store-bind item-id="huga">
      <!-- E -->
    </store-bind>
  </store-path>
</store-path>
```

上記の設定状況の場合の、継承状況や項目設定状況

|  No | type       | props dataPath    | props viewStatePath     | prop itemId | remarks                                                                                      | provideDataPath \| dataId | provideViewStatePath \| viewStateId |
| --: | ---------- | ----------------- | ----------------------- | ----------- | -------------------------------------------------------------------------------------------- | ------------------------- | ----------------------------------- |
|   A | store-path | dataKey.data.path | viewStateKey.case1.path | -           | 最上位パス定義                                                                               | dataKey.data.path         | viewStateKey.case.path              |
|   B | store-path | to                |                         | -           | dataPath, viewStatePath を上位から継承。自身の dataPath, viewStatePath は上位の値と連結      | dataKey.data.path.to      | viewStateKey.case.path              |
|   C | store-bind | -                 | -                       | id1         | dataPath, viewStatePath を上位から継承。自身の itemId を 上位の (data\|viewState)Path と連結 | dataKey.data.path.to.id1  | viewStateKey.case.path.id1          |
|   D | store-path | module1:hoge      | module1:viewState.hoge  | -           | no-inherit-data-path, no-inherit-view-state-path 指定の為、本要素で指定した値のみ有効        | module1:hoge              | module1:viewState.hoge              |
|   E | store-bind | -                 | -                       | huga        | dataPath, viewStatePath を上位から継承。自身の itemId を 上位の (data\|viewState)Path と連結 | module1:hoge.huga         | module1:viewState.hoge.huga         |

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
