<script lang="ts" setup>
const { logout, isLoading: isLoggingOut } = useLogout();
</script>
<template>
  <nav class="container fw-bold px-4 p-2">
    <NuxtLink to="/" class="btn btn-primary">
      <Icon name="back" />
      Back
    </NuxtLink>
  </nav>
  <main class="container fw-bold">
    <h1 class="fs-1">Account</h1>

    <Button
      variant="primary"
      class="w-100"
      :loading="isLoggingOut"
      @click="logout">
      <Icon name="logout" />
      Logout
    </Button>
  </main>
</template>
