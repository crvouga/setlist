<script lang="ts" setup>
const { status } = useSession();
const router = useRouter();

watch(status, () => {
  console.log(status.value);
  if (status.value === "LoggedOut") {
    router.push("/login");
  }
});
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
body {
  background-color: #f5f5f5;
}
</style>
