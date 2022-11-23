<script lang="ts" setup>
import { SetlistFindByIdPayload } from "~~/utils";
import draggable from "vuedraggable";

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
          <h1 class="m-0 fw-bold fs-1 text-truncate">
            {{ data.setlistName }}
          </h1>
          <Button class="flex-1" :linkTo="`/setlist/${id}/add-song`">
            <Icon name="plus" class="mr-1" />
            Add Song
          </Button>
        </div>

        <div class="col-12 d-flex flex-column gap-4 py-4">
          <draggable
            v-model="data.songs"
            group="people"
            item-key="id"
            class="d-flex flex-column gap-4"
            handle=".handle">
            <template #item="{ element }">
              <div class="d-flex align-items-center">
                <Icon name="hamburger" class="handle d-block" />
                <div class="ml-3 fw-bold fs-4">{{ element.name }}</div>
              </div>
            </template>
          </draggable>

          <!-- <div v-for="song in data.songs" v-bind:key="song.id">
            <h5 class="m-0 fw-bold fs-4">
              {{ song.name }}
            </h5>
          </div> -->
        </div>
      </div>
    </main>
  </div>
</template>
