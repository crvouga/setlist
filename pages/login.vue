<script lang="ts" setup>
const email = ref("");
const pass = ref("");
const status = ref<"NotAsked" | "Loading" | "Ok" | "Err">("NotAsked");
const emailProblems = ref<string[]>([]);
const passProblems = ref<string[]>([]);
const problems = ref<string[]>([]);

watch(email, () => {
  emailProblems.value = [];
});

watch(pass, () => {
  passProblems.value = [];
});

const login = async () => {
  status.value = "Loading";

  const result = await $fetch("/api/session-login", {
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

  if (result.error.type === "validation") {
    status.value = "Err";
    emailProblems.value = result.error.email;
    passProblems.value = result.error.pass;
    return;
  }

  if (result.error.type === "database") {
    status.value = "Err";
    problems.value = [result.error.message];
    return;
  }

  if (result.error.type === "account_does_not_exists") {
    status.value = "Err";
    emailProblems.value = [
      `Can't find account using this email. Try creating an account.`,
    ];
    return;
  }

  if (result.error.type === "wrong_password") {
    status.value = "Err";
    passProblems.value = [`Wrong password!`];
  }
};
</script>
<template>
  <div class="layout">
    <main class="form-login w-100 m-auto p-3">
      <Logo class="text-center" />

      <form @submit.prevent="login" class="fw-bold" novalidate>
        <!-- Email -->
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            :class="{
              'is-invalid': emailProblems.length > 0,
            }"
            id="email"
            v-model="email"
            required />
          <p v-for="problem in emailProblems" class="mt-1 text-danger">
            {{ problem }}
          </p>
        </div>

        <!-- Pass -->
        <div class="mb-4">
          <label class="form-label" for="password">Password</label>
          <PasswordInput
            v-model="pass"
            :input-class="{
              'is-invalid': passProblems.length > 0,
            }" />
          <p v-for="problem in passProblems" class="mt-1 text-danger">
            {{ problem }}
          </p>
        </div>

        <!-- Problems -->
        <p v-for="problem in problems" class="mt-1 alert alert-danger">
          {{ problem }}
        </p>

        <!-- Submit -->
        <Button
          :loading="status === 'Loading'"
          variant="primary"
          size="lg"
          class="w-100">
          <Icon name="login" />
          Login
        </Button>
      </form>

      <div class="d-flex flex-column justify-content-center p-5">
        <p class="h6 text-center">Don't have an account?</p>
        <NuxtLink to="/create-account" class="btn btn-primary">
          <i class="bi bi-person-plus-fill"></i>
          Create New Account
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<style>
.form-login {
  max-width: 480px;
}
.layout {
  display: flex;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
</style>
