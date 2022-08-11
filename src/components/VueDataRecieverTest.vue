<template>
  <div>
    <div>
      <p>{{ moduledDataId }} = {{ storeData }}</p>
      <p>{{ moduledViewStateId }} = {{ storeViewState }}</p>
      <input
        type="text"
        v-model="storeData"
        :disabled="storeViewState.disabled"
      />
    </div>
  </div>
</template>
<script lang="ts" src="./VueDataRecieverTest.ts" />
