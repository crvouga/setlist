<script lang="ts" setup>
import { v4 } from "uuid";
import { SongPostBody } from "~~/utils";

const status = ref<"NotAsked" | "Loading" | "Ok" | "Err">("NotAsked");

const name = useState("song-name", () => "");
const nameProblems = ref<string[]>([]);
watch(name, () => {
  nameProblems.value = [];
});

const artistSearch = ref("");

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

  const result = await $fetch("/api/song/create", {
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
          placeholder="Song name"
          id="name"
          v-model="name"
          :problems="nameProblems" />

        <label for="artistSearch" class="form-label mt-3">Artist</label>

        <NuxtLink to="/song/create/artist-search">
          <div
            class="p-2 bg-white border rounded d-flex flex-row justify-content-between"
            id="artistSearch">
            <p class="m-0 text-muted">Select artist</p>
            <Icon class="text-black" name="chevron-right" />
          </div>
        </NuxtLink>

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
