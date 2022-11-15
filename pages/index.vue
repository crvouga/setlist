<script lang="ts" setup>
const { logout, isLoading } = useLogout();
const { account, refresh } = useSession();
</script>
<template>
  <main class="container">
    <h1>Index page</h1>
    <NuxtLink to="login">Login</NuxtLink>
    <pre>
      {{ JSON.stringify(account, null, 4) }}
    </pre>
    <Button :loading="isLoading" variant="primary" @click="logout">
      <Icon name="logout" />
      Logout
    </Button>
  </main>
</template>
