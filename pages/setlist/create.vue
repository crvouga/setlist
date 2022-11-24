<script lang="ts" setup>
import { SetlistPostBody } from "~~/utils/setlist";

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

  const body: SetlistPostBody = {
    setlistName: name.value,
  };

  const result = await $fetch("/api/setlist/create", {
    method: "POST",
    body,
  });

  if (result.type === "Ok") {
    status.value = "Ok";
    show({ message: "Setlist created" });
    router.push(`/setlist/${result.data.setlistId}`);
    return;
  }

  status.value = "Err";

  if (result.error.type === "validation") {
    nameProblems.value = result.error.name;
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
        <h2 class="fs-1 fw-bold">Create Setlist</h2>

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
