<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const setlistId = route.params.id;
if (typeof setlistId !== "string") {
  throw new Error("route.params.id is undefined");
}

const onSelect = ({ artistId }: { artistId: string }) => {
  router.push(routes.setlist.songCreate({ setlistId, artistId }));
};

const onCreate = () => {
  if (typeof setlistId === "string") {
    router.push(routes.setlist.artistCreate({ setlistId }));
  }
};
</script>
<template>
  <NavBarBack :to="routes.setlist.songCreate({ setlistId })" />
  <ArtistSelectScreen :on-select="onSelect" :on-create="onCreate" />
</template>
