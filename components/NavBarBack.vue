<script setup lang="ts">
defineProps<{
  to: string;
}>();
</script>
<template>
  <nav class="container">
    <div class="row p-2">
      <Button class="w-auto" :linkTo="to">
        <Icon name="back" />
        Back
      </Button>
    </div>
  </nav>
</template>
