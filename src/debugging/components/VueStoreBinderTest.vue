<template>
  <div>
    <div>
      <p>{{ dataId }} = {{ storeData }}</p>
      <p>{{ viewStateId }} = {{ storeViewState }}</p>
      <input type="text" v-model="storeData" :disabled="storeViewState.disabled" />
    </div>
  </div>
</template>
<script lang="ts" src="./VueStoreBinderTest.ts" />
