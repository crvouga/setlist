<script lang="ts" setup>
const router = useRouter();
const route = useRoute();
const setlistId = route.params.id;
if (typeof setlistId !== "string") {
  throw new Error("route.params.id is invalid");
}

const onCreated = () => {
  router.push(routes.setlist.artistSelect({ setlistId }));
};
</script>
<template>
  <NavBarBack :to="routes.setlist.artistSelect({ setlistId })" />
  <ArtistCreateScreen :on-created="onCreated" />
</template>
