<script lang="ts" setup>
const email = ref("");
const pass = ref("");
const visibility = ref<"Hidden" | "Showing">("Hidden");
const status = ref<"NotAsked" | "Loading" | "Ok" | "Err">("NotAsked");
const emailProblems = ref<string[]>([]);
const passProblems = ref<string[]>([]);

watch(email, () => {
  emailProblems.value = [];
});

watch(pass, () => {
  passProblems.value = [];
});

const isSubmitted = computed(
  () => status.value === "Ok" || status.value === "Err"
);

const login = async () => {
  status.value = "Loading";

  const result = await $fetch("/api/session", {
    method: "POST",
    body: {
      email: email.value,
      pass: pass.value,
    },
  });

  if (result.type === "Err") {
    status.value = "Err";
    emailProblems.value = result.error.email;
    passProblems.value = result.error.pass;
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
        class="text-center mb-3 fw-bolder text-primary"
        style="font-size: 3rem">
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
              'is-valid': emailProblems.length === 0 && isSubmitted,
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
