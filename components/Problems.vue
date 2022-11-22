<script lang="ts" setup>
defineProps<{ problems: string[] }>();
</script>
<template>
  <ul>
    <li v-for="problem in problems" class="text-danger" v-bind:key="problem">
      {{ problem }}
    </li>
  </ul>
</template>
