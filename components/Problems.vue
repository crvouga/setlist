<script lang="ts" setup>
defineProps<{ problems: string[] }>();
</script>
<template>
  <div class="d-flex flex-column">
    <div v-for="problem in problems" class="text-danger" v-bind:key="problem">
      {{ problem }}
    </div>
  </div>
</template>
