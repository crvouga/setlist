<script lang="ts" setup>
import { sessionIdCookieName } from "./utils/session";

const cookie = useCookie(sessionIdCookieName);
</script>
<template>
  <!-- <ClientOnly fallback="Loading app...">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ClientOnly> -->
  cookie:
  {{ cookie }}
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
body {
  background-color: #f5f5f5;
}
</style>
