<script lang="ts" setup>
const { variant = "primary", size = "md" } = defineProps<{
  loading?: boolean;
  variant?: "primary" | "secondary" | "primary-outlined";
  size?: "xs" | "sm" | "md" | "lg";
  linkTo?: string;
}>();

const className = [
  "btn d-flex justify-content-center align-items-center gap-2 position-relative fw-bold",
  {
    "btn-outline-primary": variant === "primary-outlined",
    "btn-primary": variant === "primary",
    "btn-secondary": variant === "secondary",
    "btn-lg": size === "lg",
    "btn-md": size === "md",
    "btn-sm": size === "sm",
    "btn-xs": size === "xs",
  },
];
</script>

<template>
  <NuxtLink v-if="linkTo" :to="linkTo" :class="className">
    <slot />
  </NuxtLink>
  <button v-else :disabled="loading" :class="className">
    <div
      v-if="loading"
      class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
      <div class="spinner-border" style="width: 1.75rem; height: 1.75rem" />
    </div>
    <slot :class="{ 'opacity-0': loading }" />
  </button>
</template>
