<script lang="ts" setup>
const email = ref("");
const pass = ref("");
const emailProblems = ref<string[]>([]);
const passProblems = ref<string[]>([]);
const problems = ref<string[]>([]);
const status = ref<"NotAsked" | "Loading" | "Ok" | "Err">("NotAsked");

watch(email, () => {
  emailProblems.value = [];
});

watch(pass, () => {
  passProblems.value = [];
});

const createAccount = async () => {
  status.value = "Loading";
  const result = await $fetch("/api/account-create", {
    method: "POST",
    body: {
      email: email.value,
      pass: pass.value,
    },
  });

  emailProblems.value = [];
  passProblems.value = [];

  if (result.type === "Ok") {
    status.value = "Ok";
    // todo add feedback
    return;
  }

  status.value = "Err";

  if (result.error.type === "server_error") {
    problems.value = [result.error.message];
    return;
  }

  if (result.error.type === "email_taken") {
    emailProblems.value = [result.error.message];
    return;
  }

  if (result.error.type === "validation") {
    emailProblems.value = result.error.email;
    passProblems.value = result.error.pass;
    return;
  }
};
</script>
<template>
  <main class="p-4 fw-bold m-auto form-create-account">
    <h1 class="fw-bolder mb-4">Create Account</h1>

    <!-- email -->
    <div class="mb-4">
      <label for="email" class="form-label">Email</label>
      <input
        id="email"
        type="email"
        class="form-control"
        v-model="email"
        :class="{
          'is-invalid': emailProblems.length > 0,
        }" />
      <p v-for="problem in emailProblems" class="text-danger mt-1">
        {{ problem }}
      </p>
    </div>

    <!-- password -->
    <div class="mb-4">
      <label for="password" class="form-label">Password</label>
      <PasswordInput
        v-model="pass"
        :input-class="{
          'is-invalid': passProblems.length > 0,
        }" />
      <p v-for="problem in passProblems" class="text-danger mt-1">
        {{ problem }}
      </p>
    </div>

    <p v-for="problem in problems" class="text-danger mt-4">
      {{ problem }}
    </p>

    <!-- submit -->
    <Button
      class="w-100 mt-2"
      variant="primary"
      size="lg"
      :loading="status === 'Loading'"
      @click="createAccount">
      <Icon name="create-account" />
      Create New Account
    </Button>

    <!--  -->
    <div class="d-flex flex-column justify-content-center p-5">
      <p class="h6 text-center">Already have an account?</p>
      <NuxtLink to="/login" class="btn btn-primary">
        <i class="bi bi-door-open-fill"></i>
        Login
      </NuxtLink>
    </div>
  </main>
</template>

<style>
.form-create-account {
  max-width: 480px;
}
</style>
