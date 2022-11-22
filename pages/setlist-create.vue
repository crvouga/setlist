<script lang="ts" setup>
import { SetlistPostBody } from "~~/utils/setlist";

const status = ref<"NotAsked" | "Loading" | "Ok" | "Err">("NotAsked");

const name = ref("");
const nameProblems = ref<string[]>([]);
watch(name, () => {
  nameProblems.value = [];
});

const account = useAuthAccount();

const create = async () => {
  if (!account.value) {
    return;
  }

  status.value = "Loading";

  const body: SetlistPostBody = {
    creatorId: account.value.id,
    name: name.value,
  };

  const result = await $fetch("/api/setlist-create", {
    method: "POST",
    body,
  });

  if (result.error.type === "validation") {
    status.value = "Err";
    nameProblems.value = result.error.name;
    return;
  }
};
</script>

<template>
  <nav class="container p-2">
    <NuxtLink to="/" class="btn btn-primary">
      <Icon name="back" />
      Back
    </NuxtLink>
  </nav>

  <main class="container mt-2">
    <section class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <h2 class="fs-1 fw-bold">Create Setlist</h2>

        <TextField
          label="Name"
          id="name"
          v-model="name"
          :problems="nameProblems" />

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
