<script setup lang="ts">
import { SongId } from "~~/utils";

const name = ref("");

const { data, pending } = useFetch("/api/song", {
  query: {
    name,
  },
});

const status = ref<"NotAsked" | "Loading" | "Ok" | "Err">("NotAsked");
const problems = ref<string[]>([]);

const route = useRoute();
const router = useRouter();

const { show } = useToast();

const addSong = async ({ songId }: { songId: SongId }) => {
  status.value = "Loading";
  const setlistId = route.params.id;
  const result = await $fetch("/api/setlist-add-song", {
    method: "POST",
    body: {
      setlistId,
      songId,
    },
  });
  if (result.type === "Ok") {
    status.value = "Ok";
    show({ message: "Added song" });
    router.push(`/setlist/${setlistId}`);
    return;
  }
  status.value = "Err";
  if (result.error.type === "server_error") {
    problems.value = [result.error.message];
    return;
  }
  if (result.error.type === "validation") {
    problems.value = [...result.error.setlistId, ...result.error.songId];
    return;
  }
};
</script>
<template>
  <NavBarBack :to="`/setlist/${$route.params.id}`" />
  <main class="container mt-2">
    <div class="row">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <h1 class="m-0">Add Song</h1>
        <Button linkTo="/song/create">
          <Icon name="plus" />
          Create Song
        </Button>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-12 d-flex gap-2 mb-2">
        <input placeholder="Search songs" class="form-control" v-model="name" />
        <Button :loading="pending">
          <Icon name="search" />
          Search
        </Button>
      </div>

      <Problems
        v-if="status === 'Err'"
        class="col-12 mt-2 px-4"
        :problems="problems" />
      <!-- <div class="col-12 mt-4">
      </div> -->

      <div
        v-if="data?.type === 'Ok'"
        class="col-12 px-4 d-flex flex-column mt-2 gap-4">
        <div
          v-for="song in data.data"
          v-bind:key="song.id"
          @click="addSong({ songId: song.id })">
          <h4 class="m-0">
            {{ song.name }}
          </h4>
        </div>
      </div>
    </div>
  </main>
</template>
