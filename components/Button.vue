<script lang="ts" setup>
defineProps<{
  loading?: boolean;
  variant?: "primary" | "secondary";
  size?: "xs" | "sm" | "md" | "lg";
}>();
</script>
<template>
  <button
    class="btn d-flex justify-content-center align-items-center gap-2"
    :disabled="loading"
    :class="{
      'btn-primary': variant === 'primary',
      'btn-secondary': variant === 'secondary',
      'btn-lg': size === 'lg',
      'btn-md': size === 'md',
      'btn-sm': size === 'sm',
      'btn-xs': size === 'xs',
    }">
    <div
      v-if="loading"
      class="spinner-border"
      style="width: 1.9rem; height: 1.9rem" />
    <slot v-else />
  </button>
</template>
