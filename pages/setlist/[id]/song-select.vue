<script setup lang="ts">
import { SongId } from "~~/utils";

const status = ref<"NotAsked" | "Loading" | "Ok" | "Err">("NotAsked");
const problems = ref<string[]>([]);

const route = useRoute();
const setlistId = route.params.id;
if (typeof setlistId !== "string") {
  throw new Error("route.params.id is undefined");
}

const router = useRouter();

const { show } = useToast();

const onSelect = async ({ songId }: { songId: SongId }) => {
  status.value = "Loading";
  const result = await $fetch("/api/setlist-item/create", {
    method: "POST",
    body: {
      setlistId,
      songId,
    },
  });
  if (result.type === "Ok") {
    status.value = "Ok";
    show({ message: "Added song" });
    router.push(routes.setlist.index({ setlistId }));
    return;
  }
  status.value = "Err";
  if (result.error.type === "server_error") {
    problems.value = [result.error.message];
    return;
  }
  if (result.error.type === "validation") {
    problems.value = ["Server did not understand request"];
    return;
  }
};

const onCreate = () => {
  router.push(routes.setlist.songCreate({ setlistId }));
};
</script>
<template>
  <NavBarBack :to="routes.setlist.index({ setlistId })" />
  <SongSelectScreen :on-select="onSelect" :on-create="onCreate" />
</template>
