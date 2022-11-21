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

        <div class="fw-bold">
          <label for="name" class="form-label">Name</label>
          <input class="form-control" id="name" required />
        </div>

        <div class="mt-4">
          <Button class="w-100" variant="primary">
            <Icon name="plus" />
            Create
          </Button>
        </div>
      </div>
    </section>
  </main>
</template>
