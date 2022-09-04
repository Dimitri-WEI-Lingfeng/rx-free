<script setup lang="ts">
import { computed, ref } from 'vue';
import store from '../stores/store';

const v = store.useStore();

function inc() {
  store.setStore((v) => {
    v.count ++
  });
}

const computedCountPlus100 = computed(() => v.value.count + 10);
</script>

<template>
  <div>store.state.count: {{ store.state.count }}</div>
  <div>v.count: {{ v.count }}</div>
  <div>store.state.countPlus10: {{ store.state.countPlus10 }}</div>
  <div>v.countPlus10: {{ v.countPlus10 }}</div>
  <div>computedCountPlus100: {{ computedCountPlus100 }}</div>
  <button @click="inc">inc</button>
</template>
