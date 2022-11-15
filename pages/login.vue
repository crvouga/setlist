<script lang="ts" setup>
const email = ref("");
const pass = ref("");
const visibility = ref<"Hidden" | "Showing">("Hidden");
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

  const result = await $fetch("/api/session", {
    method: "POST",
    body: {
      email: email.value,
      pass: pass.value,
    },
  });

  if (result.type === "Err" && result.error.type === "validation") {
    status.value = "Err";
    emailProblems.value = result.error.email;
    passProblems.value = result.error.pass;
    return;
  }

  if (result.type === "Err" && result.error.type === "database") {
    status.value = "Err";
    problems.value = [result.error.message];
    return;
  }

  if (
    result.type === "Err" &&
    result.error.type === "account_does_not_exists"
  ) {
    status.value = "Err";
    emailProblems.value = [
      `Can't find account using this email. Try creating an account.`,
    ];
    return;
  }

  status.value = "Ok";
  emailProblems.value = [];
  passProblems.value = [];
};
</script>
<template>
  <div class="layout">
    <main class="form-login w-100 m-auto">
      <h1
        class="text-center mb-3 fw-bold text-primary"
        style="font-size: 3rem; font-weight: 900">
        Login
      </h1>

      <form @submit.prevent="login" class="fw-bold" novalidate>
        <!-- 

            Email

         -->

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

        <!-- 

            Pass

         -->

        <div class="mb-4">
          <label class="form-label" for="password">Password</label>
          <div class="input-group">
            <input
              v-model="pass"
              :type="visibility === 'Hidden' ? 'password' : 'text'"
              class="form-control"
              id="password"
              :class="{
                'is-invalid': passProblems.length > 0,
              }"
              required />

            <button
              v-if="visibility === 'Showing'"
              class="btn btn-primary"
              @click="visibility = 'Hidden'">
              <i class="bi bi-eye-slash"></i>
              Hide
            </button>
            <button
              v-if="visibility === 'Hidden'"
              class="btn btn-primary"
              @click="visibility = 'Showing'">
              <i class="bi bi-eye"></i>
              Show
            </button>
          </div>
          <p v-for="problem in passProblems" class="mt-1 text-danger">
            {{ problem }}
          </p>
        </div>

        <p v-for="problem in problems" class="mt-1 alert alert-danger">
          {{ problem }}
        </p>

        <!-- 

            Submit

         -->

        <button
          v-if="status === 'Loading'"
          class="btn btn-primary btn-lg w-100"
          disabled>
          <div class="spinner-border" style="width: 1.5rem; height: 1.5rem" />
        </button>
        <button type="submit" v-else class="btn btn-primary btn-lg w-100">
          <i class="bi bi-door-open"></i>
          Login
        </button>
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
  max-width: 320px;
}
.layout {
  display: flex;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
</style>
