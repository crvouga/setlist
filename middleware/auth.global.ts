import { sessionIdCookieName } from "../utils/session";

// docs: https://nuxt.com/docs/guide/directory-structure/middleware
export default defineNuxtRouteMiddleware(async (to, _from) => {
  if (to.path === "/login" || to.path === "/create-account") {
    return;
  }

  const authAccount = useAuthAccount();

  // notice! putting the session id cookie in the query params is a hack
  const cookie = useCookie(sessionIdCookieName);
  const result = await $fetch("/api/session", {
    query: { sessionId: cookie.value },
  });

  if (result.type === "Err") {
    authAccount.value = null;
    return navigateTo({ name: "login" });
  }

  if (!result.data) {
    authAccount.value = null;
    return navigateTo({ name: "login" });
  }
});
