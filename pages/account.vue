<script lang="ts" setup>
const router = useRouter();

const logout = async () => {
  const result = await $fetch("/api/session-logout", {
    method: "POST",
  });
  if (result.type === "Ok") {
    router.push({ name: "login" });
    return;
  }
};
</script>
<template>
  <nav class="container fw-bold p-2">
    <NuxtLink to="/" class="btn btn-primary">
      <Icon name="back" />
      Back
    </NuxtLink>
  </nav>
  <main class="container fw-bold">
    <h1 class="fs-1">Account</h1>

    <Button variant="primary" class="w-100" @click="logout">
      <Icon name="logout" />
      Logout
    </Button>
  </main>
</template>
