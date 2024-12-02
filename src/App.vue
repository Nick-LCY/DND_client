<script setup lang="ts">
import { onMounted } from 'vue';

function disableTab(e: KeyboardEvent) {
  if (e.key === "Tab") e.preventDefault()
}

onMounted(() => {
  window.addEventListener('keydown', disableTab)
})

</script>
<template>
  <router-view></router-view>
</template>
