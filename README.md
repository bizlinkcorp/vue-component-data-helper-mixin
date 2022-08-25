# vue-data-binder

## TODOs

1. store の定義方法を決定する
2. StoreBindMixin.ts の storeData set 時の mutation の名称
   1. pinia では mutation は無く、action で対応する。

## install

```shell
npm install vue-data-binder
```

## 公開するライブラリ

| No  | 公開名                                           | タイプ        | 説明                                                           | 備考                                                          |
| --- | ------------------------------------------------ | ------------- | -------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | [StoreBindMixin](./src/mixins/StoreBindMixin.ts) | Vue mixin     | Store state と入力項目を結びつけるコンポーネント mixin         | 入力単一項目コンポーネントに設定することを想定                |
| 2   | [StorePathMixin](./src/mixins/StorePathMixin.ts) | Vue mixin     | StoreBindMixin で参照する項目の Store state パスを設定する     | StoreBindMixin を束ねるコンポーネントに設定することを想定する |
| 3   | [StorePath](./src/components/StorePath.ts)       | Vue Component | StorePathMixin をカスタム利用しない場合の単一コンポーネントい  |                                                               |
| 4   | [setStoreState](./src/store/StoreControl.ts)     | method        | StoreBindMixin の storeData 設定時に設定する mutation メソッド | root store の mutation に設定する。                           |

### コンポーネント補足

#### StoreBindMixin

- props
  - itemId (string)
    - 項目を一意に指定する ID
- computed
  - storeData (get/set)
    - パスに一致した store の値を取得する
    - set することで、store の値を直接書き換える
  - storeViewState (readonly)
    - パスに一致した store の viewState を取得する

#### StorePathMixin

- props
  - path (string)
  - dataKey (string)
  - viewStateKey (string)
  - inherit (boolean)

## 使用方法

### Store 設定

Root Store に setStoreState を設定する。

```ts
import { setStoreState } from 'vue-data-binder';

export default new Vuex.Store({
  state: () => ({
    data: {
      no: '1',
      detail: '説明',
      amount: 10000,
    },
    viewState: {
      disabled: true,
      detail: {
        disabled: false,
      },
    },
  }),
  mutations: {
    setStoreState,
  },
  modules: {
    module1: {
      state: () => ({
        modData: {
          no: '100',
          detail: 'モジュール説明',
          amount: 5000,
        },
        modViewState: {},
      }),
    },
  },
});
```

### コンポーネント定義

#### StoreBindMixin を利用したコンポーネント

src/path/to/TextBindComp.vue

```html
<template>
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

#### StorePathMixin を利用したコンポーネント

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

#### アプリケーション画面実装

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

## これより下は、デフォルト記載

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your unit tests

```
npm run test:unit
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

```

```
