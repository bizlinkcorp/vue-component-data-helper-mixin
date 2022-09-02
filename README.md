# vue-data-binder

## Problem to be solved

- Creating a screen using Vuex Store requires the creation of the following boilerplate.
  - getters for data acquisition
  - actions, mutations for data setup
- A small amount can be managed, but when the number of items is large, management becomes complicated.
- It was created to avoid complicated management and to simply reflect/configure Store State values to screen items.

## overview

- Store State items can be bound directly to screen components with data.
- It can be bound to the hierarchical structure of Store State.
- Provide reactive change operations for Store State.
- Optionally, the display state can be defined for an item, and the state value can be freely used in screen components.
- The display state values inherit the upper values (separate implementation is required to use the set values in light of the upper values and the current values).

## Public Components

|  No | 公開名                                           | タイプ        | 説明                                                                  | 備考                                                         |
| --: | ------------------------------------------------ | ------------- | --------------------------------------------------------------------- | ------------------------------------------------------------ |
|   1 | [StoreBindMixin](./src/mixins/StoreBindMixin.ts) | Vue mixin     | Component mixin that associates a store state with an input item.     | Assumed to be set in the input single-item component.        |
|   2 | [StorePathMixin](./src/mixins/StorePathMixin.ts) | Vue mixin     | Set the store state path of the item referenced by `StoreBindMixin`.  | Assume that `StoreBindMixin` is set to a bundling component. |
|   3 | [StorePath](./src/components/StorePath.ts)       | Vue Component | Single component without custom `StorePathMixin`.                     |                                                              |
|   4 | [setStoreState](./src/store/StoreControl.ts)     | method        | Mutation method to be set when setting storeData in `StoreBindMixin`. | Set to root store mutation.                                  |
|   5 | [StateSetPayload](./src/store/StoreControl.ts)   | type          | Payload of `setStoreState` set to mutation.                           | The data type of viewState can be specified using generics.  |
|   6 | [ViewStateTree](./src/store/ViewStateTree.ts)    | type          | tree data type of viewState to be set for store state.                | The data type of viewState can be specified using generics.  |
|   7 | [DataBinderInfo](./src/mixins/helper.ts)         | type          | Databinding information inherited from `StorePathMixin`.              | Custom `StorePathMixin` when taking over ViewState.          |

## Getting Started

Bind the Store State value to a simple input text item.

### 1. install package

```shell
npm install vue-data-binder
```

### 2. setting store

1. Define the data to be data bound.
2. Set `setStoreState` to mutations.

```ts
import Vue from 'vue';
import Vuex from 'vuex';
import { setStoreState } from 'vue-data-binder';

Vue.use(Vuex);

export default new Vuex.Store({
  state: () => ({
    // -- 1 -- Set "data.card1"
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

### 3. Component creation with StoreBindMixin applied

The component to be created here is TextBindComp.vue.

1. Set `StoreBindMixin` to the component.
2. Set the mixin calculation property storeData to a screen item.

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

### 4. Set up components in your app

1. Apply the `StorePath` path configuration component.
2. Apply the TextBindComp.vue you created.
3. Set `StorePath` to dataPath.
4. Set itemId to TextBindComp(StoreBindMixin).

```vue
<template>
  <div>
    <!-- 3 -->
    <store-path data-path="data">
      <!-- 4 -- TextBindComp refers to the value of "data.card1" -->
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

### Result

```html
<div>
  <div>
    <!-- input value = 'card1Value' (from $store.state.data.card1 ) -->
    <input type="text" class="txt" />
  </div>
</div>
```

## Usage

See [example](./example/).

## License

[MIT](./LICENSE)

Copyright (c) 2022 BizLink Co.,Ltd.
