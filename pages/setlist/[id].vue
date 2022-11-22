<template>
  <nav class="container fw-bold p-2">
    <NuxtLink to="/" class="btn btn-primary">
      <Icon name="back" />
      Back
    </NuxtLink>
  </nav>
  <main class="container">
    <h1>Setlist</h1>
    <p>{{ $route.params.id }}</p>
  </main>
</template>
