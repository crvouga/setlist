<template>
  <NavBarBack :to="`/setlist/${$route.params.id}`" />
  <main class="container mt-2">
    <div class="row">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <h1 class="m-0">Add Song</h1>
        <NuxtLink to="/song/create" class="btn btn-primary">
          <Icon name="plus" />
          Create Song
        </NuxtLink>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-12">
        <input class="form-control" required />
      </div>
    </div>
  </main>
</template>
