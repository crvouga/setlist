<script lang="ts" setup>
import { SongPostBody } from "~~/utils";

const { artistId, onCreated, onSelectArtist } = defineProps<{
  artistId?: string;
  onCreated: () => void;
  onSelectArtist: () => void;
}>();

const status = ref<"NotAsked" | "Loading" | "Ok" | "Err">("NotAsked");

const songName = useState("song-name", () => "");
const songNameProblems = ref<string[]>([]);
watch(songName, () => {
  songNameProblems.value = [];
});

const problems = ref<string[]>([]);

const create = async () => {
  if (!artistId) {
    return;
  }

  problems.value = [];
  status.value = "Loading";

  const body: SongPostBody = {
    songName: songName.value,
    artistId: artistId,
  };

  const result = await $fetch("/api/song/create", {
    method: "POST",
    body,
  });

  if (result.type === "Ok") {
    status.value = "Ok";
    onCreated();
    return;
  }

  status.value = "Err";

  if (result.error.type === "validation") {
    songNameProblems.value = result.error.songName ?? [];
    return;
  }

  if (result.error.type === "server_error") {
    problems.value = [result.error.message];
    return;
  }
};
</script>

<template>
  <main class="container mt-2">
    <section class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <h2 class="fs-1 fw-bold">Create Song</h2>

        <TextField
          label="Name"
          id="name"
          v-model="songName"
          :problems="songNameProblems" />

        <label for="artistSearch" class="form-label mt-3">Artist</label>

        <div
          v-if="!artistId"
          @click="onSelectArtist"
          class="p-2 bg-white border rounded d-flex flex-row justify-content-between"
          id="artistSearch">
          <p class="m-0 text-muted">Select artist</p>
          <Icon class="text-black" name="chevron-right" />
        </div>

        <div
          v-else
          class="p-2 bg-white border rounded d-flex flex-row justify-content-between">
          {{ artistId }}
        </div>

        <Problems class="mt-2" :problems="problems" />

        <div class="mt-4">
          <Button
            class="w-100"
            variant="primary"
            @click="create()"
            :loading="status === 'Loading'">
            <Icon name="plus" />
            Create
          </Button>
        </div>
      </div>
    </section>
  </main>
</template>
