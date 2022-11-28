<script lang="ts" setup>
import { ArtistPostBody } from "~~/utils";

const songName = ref("");
const nameProblems = ref<string[]>([]);

watch(songName, () => {
  nameProblems.value = [];
});

const problems = ref<string[]>([]);
const status = ref<"NotAsked" | "Loading" | "Err" | "Ok">("NotAsked");

const create = async () => {
  status.value = "Loading";
  problems.value = [];
  nameProblems.value = [];

  const body: ArtistPostBody = {
    artistName: songName.value,
  };

  const result = await $fetch("/api/artist/create", {
    method: "POST",
    body,
  });

  if (result.type === "Ok") {
    status.value = "Ok";
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
    nameProblems.value = result.error.artistName;
    return;
  }
};
</script>

<template>
  <NavBarBack to="/" />

  <main class="container mt-2">
    <section class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <h2 class="fs-1 fw-bold">Create Artist</h2>

        <TextField
          label="Name"
          id="name"
          v-model="name"
          :problems="nameProblems" />

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
