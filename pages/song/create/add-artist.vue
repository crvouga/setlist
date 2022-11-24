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

        <input class="w-100 form-control mt-4" placeholder="Search artists" />
      </div>
    </section>
  </main>
</template>
