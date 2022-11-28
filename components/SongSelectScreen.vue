<script setup lang="ts">
const { onCreate, onSelect } = defineProps<{
  onSelect: (payload: { songId: string }) => void;
  onCreate: () => void;
}>();

const songName = ref("");

const { data, pending } = useFetch("/api/song/search", {
  query: {
    songName,
  },
});
</script>

<template>
  <main class="container mt-2">
    <section class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="m-0">Select Song</h1>
          <Button @click="onCreate">
            <Icon name="plus" />
            Create Song
          </Button>
        </div>

        <div class="d-flex gap-2 mb-2 mt-3">
          <input
            placeholder="Search songs"
            class="form-control"
            v-model="songName" />
          <Button :loading="pending">
            <Icon name="search" />
            Search
          </Button>
        </div>

        <div
          v-if="data?.type === 'Ok'"
          class="p-2 d-flex flex-column mt-2 gap-4">
          <div
            v-for="song in data.data"
            v-bind:key="song.songId"
            @click="onSelect({ songId: song.songId })">
            <h4 class="m-0">
              {{ song.songName }}
            </h4>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
