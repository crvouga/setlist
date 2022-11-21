import { Account } from "~~/utils/account";

export const useAuthAccount = () => {
  return useState<Account | null>("auth-account", () => null);
};
