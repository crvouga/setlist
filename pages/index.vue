<script lang="ts" setup></script>
<template>
  <nav
    class="w-100 d-flex container px-2 py-2 align-items-center justify-content-between">
    <Logo class="fs-1 mb-0" />

    <NuxtLink to="/account" class="btn btn-primary">
      <Icon name="account" />
      Account
    </NuxtLink>
  </nav>

  <main class="container mt-2">
    <section class="row">
      <div class="col-12 d-flex align-items-center justify-content-between">
        <h2 class="fw-bold fs-1">Sets</h2>
        <NuxtLink :to="{ name: 'setlist-create' }" class="btn btn-primary">
          <Icon name="plus" />
          Create New
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
