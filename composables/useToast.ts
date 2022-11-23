export type Toast = {
  message: string;
};

export const useToast = () => {
  const toast = useState<Toast | null>("toast", () => null);

  const show = async (toastNew: Toast) => {
    toast.value = toastNew;
  };

  return {
    toast,
    show,
  };
};
