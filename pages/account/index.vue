<script lang="ts" setup>
const router = useRouter();

const logout = async () => {
  const result = await $fetch("/api/session/logout", {
    method: "DELETE",
  });
  if (result.type === "Ok") {
    router.push("/session/create");
    return;
  }
};
</script>
<template>
  <NavBarBack to="/" />

  <main class="container fw-bold">
    <h1 class="fs-1">Account</h1>

    <Button variant="primary" class="w-100" @click="logout">
      <Icon name="logout" />
      Logout
    </Button>
  </main>
</template>
