import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { toast } from "sonner";
import { formattedDateTime } from "./format";

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
    setTimeout(() => {
      resolve(false);
    }, 5000);
  });
};

export const toastNotification = (notification) => {
  toast.custom((t) => (
    <div
      className="grid grid-rows-[1fr_auto] w-full rounded-md gap-1  text-sm bg-on-primary p-1  text-primary cursor-pointer"
      onClick={() => toast.dismiss()}
    >
      <div className="whitespace-pre-line">{notification.message}</div>

      <div className="text-right text-xs opacity-50">
        {formattedDateTime(notification.createdAt)}
      </div>
    </div>
  ));
};
