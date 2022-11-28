<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
const artistId = route.query.artistId;
const setlistId = route.params.id;

if (typeof setlistId !== "string") {
  throw new Error("route.params.id is invalid");
}

if (!(typeof artistId === "string" || artistId === undefined)) {
  throw new Error("route.query.artistId is invalid");
}

const onCreated = () => {
  router.push(routes.setlist.songSelect({ setlistId }));
};
const onSelectArtist = () => {
  router.push(routes.setlist.artistSelect({ setlistId }));
};
</script>
<template>
  <NavBarBack :to="routes.setlist.songSelect({ setlistId })" />
  <SongCreateScreen
    :on-created="onCreated"
    :on-select-artist="onSelectArtist"
    :artist-id="artistId" />
</template>
