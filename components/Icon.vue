<script lang="ts" setup>
type Name =
  | "chevron-right"
  | "hamburger"
  | "back"
  | "login"
  | "create-account"
  | "eye"
  | "eye-slash"
  | "logout"
  | "plus"
  | "account"
  | "search";

defineProps<{
  name: Name;
}>();

const nameToClass: { [name in Name]: string } = {
  back: "bi-chevron-left",
  "chevron-right": "bi-chevron-right",
  "create-account": "bi-person-plus-fill",
  account: "bi-person-fill",
  "eye-slash": "bi-eye-slash-fill",
  eye: "bi-eye-fill",
  login: "bi-door-open-fill",
  logout: "bi-door-closed-fill",
  plus: "bi-plus",
  search: "bi-search",
  hamburger: "bi-list",
};
</script>

<template>
  <i class="bi" :class="nameToClass[name]" />
</template>
