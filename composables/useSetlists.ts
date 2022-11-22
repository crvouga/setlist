import { Setlist } from "~~/utils/setlist";

export const useSetlists = () => {
  const setlists = useState<Setlist[]>("setlists", () => []);

  const createOne = async (body: { name: string; creatorId: string }) => {
    const result = await $fetch("/api/setlist-create", {
      method: "POST",
      body: {},
    });

    if (result.type === "Err") {
      return result;
    }

    return result;
  };

  return { setlists, createOne };
};
