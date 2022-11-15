<template>
  <nav
    class="w-100 d-flex container px-4 py-2 align-items-center justify-content-between">
    <Logo class="fs-1 mb-0" />

    <NuxtLink to="/account" class="btn btn-primary">
      <Icon name="account" />
      Account
    </NuxtLink>
  </nav>
  <main class="container">
    <NuxtLink to="login">Login</NuxtLink>
  </main>
</template>
