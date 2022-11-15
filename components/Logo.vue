<template>
  <h1 class="logo">Setlist</h1>
</template>

<style lang="scss">
$primary: #0d6efd;

.logo {
  font-size: 5rem;
  font-weight: 900;
  background-color: $primary;
  background-image: linear-gradient(
    45deg,
    darken($primary, 5%),
    lighten($primary, 20%)
  );
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>
