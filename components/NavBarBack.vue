<script setup lang="ts">
defineProps<{
  to: string;
}>();
</script>
<template>
  <nav class="container p-2">
    <NuxtLink :to="to" class="btn btn-primary">
      <Icon name="back" />
      Back
    </NuxtLink>
  </nav>
</template>
