<script lang="ts" setup>
import { Setlist } from "~~/utils";
const status = ref<"Loading" | "Err" | "Ok">("Loading");
const problems = ref<string[]>([]);
const data = ref<Setlist[]>([]);
const account = useAuthAccount();
const load = async () => {
  if (!account.value) {
    return;
  }
  status.value = "Loading";
  const result = await $fetch("/api/setlist-by-account-id", {
    query: {
      accountId: account.value.id,
    },
  });
  if (result.type === "Ok") {
    status.value = "Ok";
    data.value = result.data;
    return;
  }
  status.value = "Err";
  if (result.error.type === "validation") {
    problems.value = ["Server did not understand request"];
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
  <nav
    class="w-100 d-flex container px-3 py-2 align-items-center justify-content-between bg-light sticky-top">
    <Logo class="fs-1 mb-0" />

    <Button linkTo="/account">
      <Icon name="account" />
      Account
    </Button>
  </nav>

  <main class="container mt-2">
    <section class="row justify-content-center">
      <div class="col-12 d-flex align-items-center justify-content-end">
        <Button :linkTo="`/setlist/create`">
          <Icon name="plus" />
          Create New
        </Button>
      </div>
      <div v-if="status === 'Loading'" class="row justify-content-center mt-4">
        <Spinner class="col-12" />
      </div>
      <div v-if="status === 'Err'" class="row mt-4">
        <Problems class="col-12" :problems="problems" />
      </div>
      <div class="row justify-content-between m-0 mt-3">
        <div
          class="col-12 col-sm-6 col-md-4 col-lg-4 p-1"
          v-for="setlist in data"
          v-bind:key="setlist.id">
          <RouterLink :to="`/setlist/${setlist.id}`">
            <div class="ratio ratio-16x9 border rounded w-100">
              <h3 class="h2 fw-bold text-truncate p-4">
                {{ setlist.name }}
              </h3>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>
