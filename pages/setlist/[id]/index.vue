<script lang="ts" setup>
import { SetlistFindByIdPayload } from "~~/utils";

const status = ref<"Loading" | "Err" | "Ok">("Loading");
const data = ref<SetlistFindByIdPayload | null>(null);
const problems = ref<string[]>([]);

const route = useRoute();
const id = route.params.id;

const load = async () => {
  status.value = "Loading";
  const result = await $fetch("/api/setlist-by-id", {
    query: {
      id,
    },
  });
  if (result.type === "Ok") {
    status.value = "Ok";
    data.value = result.data;
    return;
  }

  status.value = "Err";

  if (result.error.type === "validation") {
    problems.value = ["Server did not understand the request"];
    return;
  }

  if (result.error.type === "server_error") {
    problems.value = [result.error.message];
    return;
  }
};

onMounted(() => {
  load();
});
</script>
<template>
  <div>
    <NavBarBack to="/" />

    <main class="container">
      <div v-if="status === 'Loading'" class="row justify-content-center">
        <Spinner class="col-12" v-if="status === 'Loading'" />
      </div>
      <div class="row" v-else-if="status === 'Err'">
        <Problems class="col-12" :problems="problems" />
      </div>
      <div v-else-if="data" class="row">
        <div class="col-12 d-flex justify-content-between align-items-center">
          <h1 class="m-0 fw-bold" style="font-size: 2.5rem">
            {{ data.setlistName }}
          </h1>
          <NuxtLink
            :to="`/setlist/${id}/add-song`"
            class="fw-bold btn btn-primary">
            <Icon name="plus" class="mr-1" />
            Add Song
          </NuxtLink>
        </div>

        <pre>
          {{ JSON.stringify(data, null, 4) }}
        </pre>
      </div>
    </main>
  </div>
</template>
