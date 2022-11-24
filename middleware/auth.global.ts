// docs: https://nuxt.com/docs/guide/directory-structure/middleware
export default defineNuxtRouteMiddleware(async (to, _from) => {
  const authAccount = useAuthAccount();
  const sessionId = useCookie(sessionIdCookieName);

  const result = await $fetch("/api/session", {
    query: { sessionId: sessionId.value },
  });

  authAccount.value = result.type === "Err" ? null : result.data;

  if (authAccount.value !== null) {
    return;
  }

  // prevents infinite loop
  if (to.path === "/session/create" || to.path === "/account/create") {
    return;
  }

  return navigateTo("/session/create");
});
