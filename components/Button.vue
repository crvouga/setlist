<script lang="ts" setup>
defineProps<{
  loading?: boolean;
  variant?: "primary" | "secondary";
  size?: "xs" | "sm" | "md" | "lg";
}>();
</script>
<template>
  <button
    class="btn d-flex justify-content-center align-items-center gap-2 position-relative"
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
      class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
      <div class="spinner-border" style="width: 1.75rem; height: 1.75rem" />
    </div>

    <slot :class="{ 'opacity-0': loading }" />
  </button>
</template>
