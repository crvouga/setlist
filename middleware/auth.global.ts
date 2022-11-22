import { sessionIdCookieName } from "../utils/session";

// docs: https://nuxt.com/docs/guide/directory-structure/middleware
export default defineNuxtRouteMiddleware(async (to, _from) => {
  // prevents infinite loop
  if (to.path === "/session-login" || to.path === "/account-create") {
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
    return navigateTo({ name: "session-login" });
  }

  if (!result.data) {
    authAccount.value = null;
    return navigateTo({ name: "session-login" });
  }

  authAccount.value = result.data;
});
