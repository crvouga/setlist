<script lang="ts" setup>
type Name = "login" | "create-account" | "eye" | "eye-slash" | "logout";

defineProps<{
  name: Name;
}>();

const nameToClass: { [name in Name]: string } = {
  "create-account": "bi-person-plus-fill",
  "eye-slash": "bi-eye-slash",
  eye: "bi-eye",
  login: "bi-door-open",
  logout: "bi-door-closed-fill",
};
</script>

<template>
  <i class="bi" :class="nameToClass[name]" />
</template>
