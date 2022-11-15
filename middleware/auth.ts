export default defineNuxtRouteMiddleware((to, from) => {
  const { status } = useSession();
  if (status.value === "LoggedOut") {
    return navigateTo("/login");
  }
});
