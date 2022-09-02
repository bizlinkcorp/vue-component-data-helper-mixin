# vue-data-binder

## 互換性

| vue-data-binder | Vue    | Vuex |
| --------------- | ------ | ---- |
| v0.x            | v2.7.x | v3.x |

## 解決したい課題

- Vuex Store を利用した画面を作成すると、以下のボイラープレートを作成する必要がある。
  - データ取得の為の getters
  - データ設定の為の actions, mutations
- 少量ならば管理できるが項目が大量になると管理が煩雑になってしまう。
- 煩雑な管理を回避し、Store State 値を画面項目へシンプルな反映／設定を目的として作成した。

## 概要

- Store State 項目を、画面コンポーネントにデータを直接バインドできる。
- Store State の階層構造に対してバインドすることができる。
- Store State に対して、リアクティブな変更操作を提供する。
- オプションで項目に表示状態を定義することができ、画面コンポーネントで状態値を自由に利用できる。
- 表示状態の値は上位を継承する（上位の値と現在の値を鑑みた設定値を利用するには個別に実装が必要）。

## 公開コンポーネント

|  No | 名前                                             | タイプ        | 説明                                                               | 備考                                                              |
| --: | ------------------------------------------------ | ------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- |
|   1 | [StoreBindMixin](./src/mixins/StoreBindMixin.ts) | Vue mixin     | Store State と入力項目を結びつけるコンポーネント mixin。           | 入力単一項目コンポーネントに設定することを想定。                  |
|   2 | [StorePathMixin](./src/mixins/StorePathMixin.ts) | Vue mixin     | `StoreBindMixin` で参照する項目の Store State パスを設定する。     | `StoreBindMixin` を束ねるコンポーネントに設定することを想定する。 |
|   3 | [StorePath](./src/components/StorePath.ts)       | Vue Component | `StorePathMixin` をカスタム利用しない場合の単一コンポーネント。    |                                                                   |
|   4 | [setStoreState](./src/store/StoreControl.ts)     | method        | `StoreBindMixin` の storeData 設定時に設定する mutation メソッド。 | root store の mutation に設定する。                               |
|   5 | [StateSetPayload](./src/store/StoreControl.ts)   | type          | mutation に設定した `setStoreState` の Payload。                   | generics を利用して viewState のデータ型を指定可能。              |
|   6 | [ViewStateTree](./src/store/ViewStateTree.ts)    | type          | Store State に設定する viewState の tree データ型。                | generics を利用して viewState のデータ型を指定可能。              |
|   7 | [DataBinderInfo](./src/mixins/helper.ts)         | type          | `StorePathMixin` から引き継がれるデータバインド情報。              | ViewState を引継ぐ場合、`StorePathMixin` をカスタムする。         |

## Getting Started

シンプルな input text 項目に Store State の値をバインドを実施する。

### 1. install package

```shell
npm install vue-data-binder
```

### 2. store 設定

1. データバインドしたいデータを定義する。
2. mutations に `setStoreState` を設定する。

```ts
import Vue from 'vue';
import Vuex from 'vuex';
import { setStoreState } from 'vue-data-binder';

Vue.use(Vuex);

export default new Vuex.Store({
  state: () => ({
    // -- 1 -- "data.card1" を設定
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

1. コンポーネントに `StoreBindMixin` を設定する。
2. 画面項目に mixin 計算プロパティ storeData を設定する。

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

1. パス設定コンポーネント `StorePath` を適用する。
2. 作成した TextBindComp.vue を適用する。
3. `StorePath` に dataPath を設定する。
4. TextBindComp(StoreBindMixin) に itemId を設定する。

```vue
<template>
  <div>
    <!-- 3 -->
    <store-path data-path="data">
      <!-- 4 -- TextBindComp では "data.card1" の値を参照する -->
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

## 使用方法

[サンプル](./example/)を参照。

## License

[MIT](./LICENSE)

Copyright (c) 2022 BizLink Co.,Ltd.
