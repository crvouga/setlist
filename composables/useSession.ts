import { Account } from "~~/utils/account";

export const useSession = () => {
  const account = useState<Account | null>("account", () => null);
  const status = ref<"Loading" | "LoggedIn" | "LoggedOut">("Loading");
  const refresh = async () => {
    const result = await $fetch("/api/session");

    if (result.type === "Err") {
      status.value = "LoggedOut";
      account.value = null;
      return;
    }

    if (!result.data) {
      status.value = "LoggedOut";
      account.value = null;
      return;
    }

    status.value = "LoggedIn";
    account.value = result.data;
  };
  onMounted(refresh);
  return { account, status, refresh };
};

export const useLogout = () => {
  const status = ref<"NotAsked" | "Loading" | "Err" | "Ok">();
  const { refresh } = useSession();
  const logout = async () => {
    status.value = "Loading";
    const result = await $fetch("/api/session-logout", { method: "POST" });
    if (result.type === "Err") {
      status.value = "Err";
      return;
    }
    status.value = "Ok";
    refresh();
  };
  const isLoading = computed(() => status.value === "Loading");
  return {
    logout,
    status,
    isLoading,
  };
};
