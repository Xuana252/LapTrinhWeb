import { toast } from "sonner";

export const toastSuccess = (message) => {
  toast.success(message);
};

export const toastWarning = (message) => {
  toast.warning(message);
};

export const toastError = (message) => {
  toast.error(message);
};

export const toastRequest = (message) => {
  return new Promise((resolve) => {
    toast(message, {
      action: {
        label: "Yes",
        onClick: () => {
          resolve(true);
        },
      },
    });
    setTimeout(()=>{
        resolve(false)
    },5000)
  });
};
