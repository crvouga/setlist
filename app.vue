<script lang="ts" setup>
const { toast } = useToast();
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
    <div class="bg-dark position-relative bd-example-toasts">
      <div class="toast-container position-absolute p-3" id="toastPlacement">
        <div class="toast">
          <div class="toast-header">
            <img src="..." class="rounded me-2" alt="..." />
            <strong class="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
          </div>
          <div class="toast-body">Hello, world! This is a toast message.</div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style>
body {
  background-color: #f5f5f5;
}
</style>
