import { Session, sessionIdCookieName } from "~~/utils/session";

const session = ref<Session | null>(null);
const status = ref<"NotAsked" | "Loading" | "Ok" | "Err">("NotAsked");

export const useSession = () => {
  const cookie = useCookie(sessionIdCookieName);
  onMounted(async () => {
    const result = await $fetch("/api/session");

    if (result.type === "Err") {
      status.value = "Err";
      session.value = null;
      return;
    }

    status.value = "Ok";
    session.value = result.data;
    cookie.value = result.data?.id ?? "";
  });

  return {
    session,
    status,
  };
};

export const useLogout = () => {
  const status = ref<"NotAsked" | "Loading" | "Err" | "Ok">();
  const logout = async () => {
    status.value = "Loading";
    const result = await $fetch("/api/session-logout");
    if (result.type === "Err") {
      status.value = "Err";
      return;
    }
    status.value = "Ok";
  };
  const isLoading = computed(() => status.value === "Loading");
  return {
    logout,
    status,
    isLoading,
  };
};
