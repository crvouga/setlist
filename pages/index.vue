<script lang="ts" setup>
const { logout, isLoading } = useLogout();
</script>
<template>
  <main class="container">
    <h1>Index page</h1>
    <NuxtLink to="login">Login</NuxtLink>
    <Button :loading="isLoading" variant="primary" @click="logout">
      <Icon name="logout" />
      Logout
    </Button>
  </main>
</template>
