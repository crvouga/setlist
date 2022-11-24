<script lang="ts" setup>
import { v4 } from "uuid";
import { SongPostBody } from "~~/utils";

const status = ref<"NotAsked" | "Loading" | "Ok" | "Err">("NotAsked");

const name = ref("");
const nameProblems = ref<string[]>([]);
watch(name, () => {
  nameProblems.value = [];
});

const problems = ref<string[]>([]);

const router = useRouter();
const { show } = useToast();

const create = async () => {
  problems.value = [];
  status.value = "Loading";

  const body: SongPostBody = {
    songName: name.value,
    artistId: v4(),
  };

  const result = await $fetch("/api/song-create", {
    method: "POST",
    body,
  });

  if (result.type === "Ok") {
    status.value = "Ok";
    show({ message: "Song created" });
    router.back();
    return;
  }

  status.value = "Err";

  if (result.error.type === "validation") {
    nameProblems.value = result.error.songName ?? [];
    return;
  }

  if (result.error.type === "server_error") {
    problems.value = [result.error.message];
    return;
  }
};
</script>

<template>
  <NavBarBack to="/" />

  <main class="container mt-2">
    <section class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <h2 class="fs-1 fw-bold">Create Song</h2>

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
