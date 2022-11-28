<script lang="ts" setup>
const search = ref<string>("");
const { data, pending } = useFetch("/api/artist/search", {
  query: { search: search },
});
const router = useRouter();
const addArtist = async ({ artistId }: { artistId: string }) => {
  router.push(`/song/create?artistId=${artistId}`);
};
</script>
<template>
  <NavBarBack to="/song/create" />
  <main class="container mt-2">
    <section class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6 cn">
        <div class="d-flex justify-content-between align-items-center">
          <h2 class="fw-bold m-0">Select Artist</h2>
          <Button linkTo="/artist/create">
            <Icon name="plus" />
            Create Artist
          </Button>
        </div>

        <input
          class="w-100 form-control mt-4"
          placeholder="Search artists"
          v-model="search" />

        <p v-if="pending" class="text-muted mb-0 mt-2 fw-bold">Searching...</p>
        <p
          v-else-if="data?.type === 'Ok' && data.data.length === 0"
          class="text-muted mb-0 mt-2 fw-bold">
          No artists found
        </p>
        <p
          v-else-if="data?.type === 'Ok' && data.data.length > 0"
          class="text-muted mb-0 mt-2 fw-bold">
          {{ data.data.length }} artists found
        </p>

        <div v-if="data?.type === 'Ok'" class="w-100 d-flex flex-column py-2">
          <div
            v-for="artist in data.data"
            v-bind:key="artist.artistId"
            class="py-2"
            @click="addArtist({ artistId: artist.artistId })">
            <h3>{{ artist.artistName }}</h3>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
