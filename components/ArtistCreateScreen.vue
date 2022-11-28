<script lang="ts" setup>
import { ArtistPostBody } from "~~/utils";

const { onCreated } = defineProps<{
  onCreated: ({ artistId }: { artistId: string }) => void;
}>();

const artistName = ref("");
const artistNameProblems = ref<string[]>([]);

watch(artistName, () => {
  artistNameProblems.value = [];
});

const problems = ref<string[]>([]);
const status = ref<"NotAsked" | "Loading" | "Err" | "Ok">("NotAsked");

const create = async () => {
  status.value = "Loading";
  problems.value = [];
  artistNameProblems.value = [];

  const body: ArtistPostBody = {
    artistName: artistName.value,
  };

  const result = await $fetch("/api/artist/create", {
    method: "POST",
    body,
  });

  if (result.type === "Ok") {
    status.value = "Ok";
    onCreated({ artistId: result.data.artistId });
    return;
  }

  status.value = "Err";

  if (result.error.type === "server_error") {
    problems.value = [result.error.message];
    return;
  }

  if (result.error.type === "unauthorized") {
    problems.value = ["Must be signed in"];
    return;
  }

  if (result.error.type === "validation") {
    artistNameProblems.value = result.error.artistName;
    return;
  }
};
</script>

<template>
  <main class="container mt-2">
    <section class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <h2 class="fs-1 fw-bold">Create Artist</h2>

        <TextField
          label="Name"
          id="name"
          v-model="artistName"
          :problems="artistNameProblems" />

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
